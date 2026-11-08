const librarySeed = [];

let lessons = librarySeed.map(normalizeLesson);
let knownVolumes = [];
let activeFilter = "All";
let activeView = "Home";
let activeVolume = null;
let featuredId = null;
let toastTimeout;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function normalizeLesson(lesson) {
  const numberFromLabel = Number(String(lesson.volume || "").match(/\d+/)?.[0]);
  const volumeNumber = Number(lesson.volumeNumber) || numberFromLabel || 1;
  return { ...lesson, volumeNumber, volume: lesson.volume || `Vol ${volumeNumber}`, volumeId: `vol-${volumeNumber}` };
}

function getYoutubeUrl(lesson) {
  return lesson?.youtubeUrl || lesson?.youtube || "";
}

function getYoutubeEmbedUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    let videoId = url.searchParams.get("v");
    if (!videoId && url.hostname === "youtu.be") videoId = url.pathname.slice(1).split("/")[0];
    if (!videoId && url.pathname.includes("/embed/")) videoId = url.pathname.split("/embed/")[1].split("/")[0];
    if (!videoId && url.pathname.includes("/shorts/")) videoId = url.pathname.split("/shorts/")[1].split("/")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&fs=1&mute=1&playsinline=1&rel=0&modestbranding=1` : value;
  } catch (error) {
    return value;
  }
}

function volumeGroups() {
  const groups = new Map(knownVolumes.map((volume) => [volume.id, { ...volume, lessons: [] }]));
  lessons.forEach((lesson) => {
    if (!groups.has(lesson.volumeId)) groups.set(lesson.volumeId, { id: lesson.volumeId, label: lesson.volume, number: lesson.volumeNumber, lessons: [] });
    groups.get(lesson.volumeId).lessons.push(lesson);
  });
  return [...groups.values()].sort((a, b) => b.number - a.number);
}

function activeVolumeGroup() {
  return volumeGroups().find((volume) => volume.id === activeVolume);
}

function updateNavCounts() {
  const counts = {
    Home: lessons.length,
    Library: lessons.length,
    Saved: lessons.filter((lesson) => lesson.saved).length
  };
  $$(".nav-item").forEach((item) => {
    const count = item.querySelector(".nav-count");
    if (count) count.textContent = counts[item.dataset.view] ?? 0;
  });
}

function renderVolumeTabs() {
  const volumes = volumeGroups();
  if (!volumes.length) {
    activeVolume = null;
    $("#volumeTabs").innerHTML = "";
    $("#volumeSummary").textContent = "Add a volume to the JSON catalog to get started";
    return;
  }
  if (!activeVolume || (activeVolume !== "all" && !volumes.some((volume) => volume.id === activeVolume))) {
    activeVolume = volumes.find((volume) => volume.lessons.length > 0)?.id || volumes[0].id;
  }
  const tabs = volumes.map((volume) => `
    <button class="volume-tab${activeVolume === volume.id ? " is-active" : ""}" data-volume="${volume.id}" type="button" role="tab" aria-selected="${activeVolume === volume.id}">
      <span class="volume-tab-label">${volume.label}</span><span class="volume-tab-count">${volume.lessons.length} videos</span>
    </button>
  `).join("");
  $("#volumeTabs").innerHTML = `${tabs}<button class="volume-tab is-all${activeVolume === "all" ? " is-active" : ""}" data-volume="all" type="button" role="tab" aria-selected="${activeVolume === "all"}"><span class="volume-tab-label">All volumes</span><span class="volume-tab-count">${lessons.length} videos</span></button>`;
  const current = activeVolumeGroup();
  $("#volumeSummary").textContent = activeVolume === "all" ? `${lessons.length} videos across ${volumes.length} volumes` : `${current.lessons.length} videos · newest volume first`;
}

function filteredLessons() {
  const query = $("#searchInput").value.trim().toLowerCase();
  return lessons.filter((lesson) => {
    const matchesFilter = activeFilter === "All" || lesson.subject === activeFilter;
    const matchesVolume = activeVolume === "all" || !activeVolume || lesson.volumeId === activeVolume;
    const matchesView = activeView !== "Saved" || lesson.saved;
    const haystack = `${lesson.title} ${lesson.subject} ${lesson.tutor}`.toLowerCase();
    return matchesFilter && matchesVolume && matchesView && (!query || haystack.includes(query));
  }).sort((a, b) => b.volumeNumber - a.volumeNumber || a.title.localeCompare(b.title));
}

function renderFeatured() {
  const lesson = lessons.find((item) => item.id === featuredId) || lessons[0];
  const featured = $("#featuredLesson");
  const poster = $("#featuredPoster");
  const embed = $("#featuredEmbed");
  const playButton = $("#playButton");
  const saveButton = $("#saveFeaturedButton");
  const resumeButton = $("#resumeButton");
  const youtubeOpenButton = $("#youtubeOpenButton");
  const volumePill = $("#featuredVolume");
  const subjectPill = $("#featuredSubject");
  if (!lesson) {
    featured.classList.add("is-empty");
    $("#videoStage").classList.remove("has-youtube");
    poster.hidden = true;
    embed.hidden = true;
    embed.removeAttribute("src");
    playButton.hidden = true;
    saveButton.hidden = true;
    resumeButton.hidden = true;
    youtubeOpenButton.hidden = true;
    volumePill.hidden = true;
    subjectPill.hidden = true;
    $("#videoStatus").textContent = "No lesson selected";
    $("#featuredDuration").textContent = "";
    $("#featuredProgressLabel").textContent = "";
    $("#featuredLessonNumber").textContent = "";
    $("#featuredUpdated").textContent = "Ready for your first upload";
    $("#featuredTitle").textContent = "Your lesson shelf is ready";
    $("#featuredDescription").textContent = "Add a YouTube lesson to the JSON catalog in Video resource/videos.json.";
    $("#featuredTutor").textContent = "No lessons added yet";
    $("#featuredTutorRole").textContent = "Waiting for your YouTube links";
    $("#featuredTutorAvatar").textContent = "--";
    $("#featuredProgressBar").style.width = "0%";
    return;
  }
  featured.classList.remove("is-empty");
  playButton.hidden = true;
  saveButton.hidden = false;
  resumeButton.hidden = true;
  volumePill.hidden = false;
  subjectPill.hidden = false;
  const youtubeUrl = getYoutubeUrl(lesson);
  const hasYoutube = Boolean(youtubeUrl);
  $("#videoStage").classList.toggle("has-youtube", hasYoutube);
  poster.hidden = true;
  poster.removeAttribute("src");
  embed.hidden = !hasYoutube;
  embed.src = hasYoutube ? getYoutubeEmbedUrl(youtubeUrl) : "";
  $("#featuredTitle").textContent = lesson.title;
  $("#featuredVolume").textContent = lesson.volume;
  $("#featuredSubject").textContent = lesson.subject;
  $("#featuredUpdated").textContent = lesson.updated;
  $("#featuredDescription").textContent = lesson.description;
  $("#featuredTutor").textContent = lesson.tutor;
  $("#featuredTutorRole").textContent = lesson.tutorRole || "English tutor";
  $("#featuredTutorAvatar").textContent = lesson.initials;
  $("#featuredDuration").textContent = lesson.duration;
  $("#featuredProgressLabel").textContent = lesson.watched;
  $("#featuredProgressBar").style.width = `${lesson.progress}%`;
  $("#featuredLessonNumber").textContent = lesson.lessonNumber || "Tutor lesson";
  $("#playButton").setAttribute("aria-label", `Play ${lesson.title}`);
  $("#saveFeaturedButton").classList.toggle("is-saved", lesson.saved);
  $("#videoStatus").textContent = hasYoutube ? "YouTube lesson" : "YouTube link needed";
  youtubeOpenButton.hidden = !hasYoutube;
  youtubeOpenButton.dataset.url = youtubeUrl;
  renderIcons();
}

function openYoutubeLesson(url) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function renderCards() {
  const visibleLessons = filteredLessons();
  const grid = $("#lessonGrid");
  grid.innerHTML = visibleLessons.map((lesson) => `
    <article class="lesson-card${featuredId === lesson.id ? " is-selected" : ""}" data-lesson-id="${lesson.id}">
      <div class="card-poster">
        <button class="card-button-title" type="button" aria-label="Open ${lesson.title}">${lesson.title}</button>
        <span class="card-label">${lesson.subject}</span>
        ${getYoutubeUrl(lesson) ? `<button class="card-time card-youtube" type="button" data-youtube aria-label="Watch ${lesson.title} on YouTube">YouTube</button>` : `<span class="card-time">${lesson.duration}</span>`}
      </div>
      <div class="card-body">
        <div class="card-meta"><span class="mini-avatar">${lesson.initials}</span><span>${lesson.tutor}</span><span aria-hidden="true">·</span><span>${lesson.progress ? `${lesson.progress}% watched` : "New lesson"}</span></div>
        <div class="card-progress" aria-label="${lesson.progress}% watched"><span style="width: ${lesson.progress}%"></span></div>
      </div>
    </article>
  `).join("");
  const isEmpty = visibleLessons.length === 0;
  $("#emptyState").hidden = !isEmpty;
  $("#emptyState h3").textContent = $("#searchInput").value ? "No lessons found" : "No lessons added yet";
  $("#emptyState p").textContent = $("#searchInput").value ? "Try a different search term." : "Add your first YouTube lesson to Video resource/videos.json.";
  $("#clearSearchButton").hidden = !$("#searchInput").value;
  const currentVolume = activeVolumeGroup();
  $("#lessonCount").textContent = activeVolume === "all" ? `${visibleLessons.length} lessons across all volumes` : `${visibleLessons.length} lessons in ${currentVolume?.label || "this volume"}`;
  updateNavCounts();
  renderIcons();
}

function selectLesson(id) {
  featuredId = id;
  $$(".lesson-card").forEach((card) => {
    const selected = card.dataset.lessonId === id;
    card.classList.toggle("is-selected", selected);
  });
  renderFeatured();
  $("#featuredLesson").scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("Lesson loaded into your study desk.");
}

function bindEvents() {
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => {
    activeView = button.dataset.view;
    $$(".nav-item").forEach((item) => item.classList.toggle("is-active", item === button));
    $("#catalogTitle").textContent = activeView === "Saved" ? "Saved for later" : activeView === "Library" ? "Your full library" : "For your study list";
    renderCards();
  }));

  $$(".filter-tab").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    $$(".filter-tab").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    renderCards();
  }));

  $("#volumeTabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-volume]");
    if (!button) return;
    activeVolume = button.dataset.volume;
    const firstLesson = activeVolume === "all" ? filteredLessons()[0] : volumeGroups().find((volume) => volume.id === activeVolume)?.lessons[0];
    featuredId = firstLesson?.id || null;
    renderVolumeTabs();
    renderFeatured();
    renderCards();
  });

  $("#youtubeOpenButton").addEventListener("click", () => openYoutubeLesson($("#youtubeOpenButton").dataset.url));

  $("#searchInput").addEventListener("input", renderCards);
  $("#clearSearchButton").addEventListener("click", () => {
    $("#searchInput").value = "";
    $("#searchInput").focus();
    renderCards();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== $("#searchInput")) {
      event.preventDefault();
      $("#searchInput").focus();
    }
  });

  $("#lessonGrid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-lesson-id]");
    if (!card) return;
    if (event.target.closest("[data-youtube]")) {
      const lesson = lessons.find((item) => item.id === card.dataset.lessonId);
      openYoutubeLesson(getYoutubeUrl(lesson));
      return;
    }
    selectLesson(card.dataset.lessonId);
  });
  $("#viewQueueButton").addEventListener("click", () => showToast(lessons.length ? "Your queue is ready." : "Your queue is empty until you add a lesson."));
  $("#saveFeaturedButton").addEventListener("click", () => {
    const lesson = lessons.find((item) => item.id === featuredId);
    if (!lesson) {
      showToast("Add a lesson to your catalog before saving it.");
      return;
    }
    lesson.saved = !lesson.saved;
    renderFeatured();
    renderCards();
    showToast(lesson.saved ? "Saved to your study list." : "Removed from saved lessons.");
  });
}

async function loadCatalog() {
  try {
    const [lessonResponse, volumeResponse] = await Promise.all([
      fetch("./Video%20resource/videos.json", { cache: "no-store" }),
      fetch("./Video%20resource/volumes.json", { cache: "no-store" })
    ]);
    if (!lessonResponse.ok) throw new Error("Manifest unavailable");
    const remoteLessons = await lessonResponse.json();
    if (Array.isArray(remoteLessons)) lessons = remoteLessons.filter((lesson) => getYoutubeUrl(lesson)).map(normalizeLesson);
    if (volumeResponse.ok) {
      const remoteVolumes = await volumeResponse.json();
      if (Array.isArray(remoteVolumes)) knownVolumes = remoteVolumes.map((volume) => ({
        id: `vol-${volume.number}`,
        label: volume.label || `Vol ${volume.number}`,
        number: Number(volume.number) || 0
      }));
    }
  } catch (error) {
    // The empty catalog keeps the page usable when opened directly from disk.
  }
  if (!featuredId) {
    featuredId = activeVolume === "all" ? filteredLessons()[0]?.id || lessons[0]?.id || null : activeVolumeGroup()?.lessons[0]?.id || lessons[0]?.id || null;
  }
  renderVolumeTabs();
  renderFeatured();
  renderCards();
}

function setDate() {
  const date = new Date();
  $("#dateLine").textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date);
  const hour = date.getHours();
  $("#greeting").textContent = `${hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"}.`;
}

setDate();
bindEvents();
loadCatalog();
