const librarySeed = [
  {
    id: "algebra-essentials",
    volume: "Vol 4",
    volumeNumber: 4,
    title: "Algebra essentials: systems of equations",
    subject: "Math",
    tutor: "Priya Chandra",
    initials: "PC",
    tutorRole: "Mathematics tutor",
    description: "Build a clear method for solving two equations together, with Priya's paper-first walkthrough.",
    duration: "14:32",
    watched: "06:18 watched",
    progress: 43,
    lessonNumber: "Lesson 03 of 08",
    updated: "Updated yesterday",
    poster: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1400&q=85",
    videoUrl: "",
    saved: false
  },
  {
    id: "essay-architecture",
    volume: "Vol 4",
    volumeNumber: 4,
    title: "The architecture of a strong essay",
    subject: "Writing",
    tutor: "Maya Patel",
    initials: "MP",
    tutorRole: "Writing tutor",
    description: "Turn a loose idea into a structure your reader can trust, one paragraph at a time.",
    duration: "18:05",
    watched: "03:42 watched",
    progress: 21,
    lessonNumber: "Lesson 01 of 06",
    updated: "Added 2 days ago",
    poster: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: true
  },
  {
    id: "cellular-energy",
    volume: "Vol 4",
    volumeNumber: 4,
    title: "Cellular energy, without the fog",
    subject: "Science",
    tutor: "Noah Williams",
    initials: "NW",
    tutorRole: "Biology tutor",
    description: "A visual tour of how cells store and spend energy, built for a first clear pass.",
    duration: "22:11",
    watched: "11:10 watched",
    progress: 50,
    lessonNumber: "Lesson 02 of 05",
    updated: "Added 4 days ago",
    poster: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: false
  },
  {
    id: "fractions-confidence",
    volume: "Vol 4",
    volumeNumber: 4,
    title: "Fractions with confidence",
    subject: "Math",
    tutor: "Priya Chandra",
    initials: "PC",
    tutorRole: "Mathematics tutor",
    description: "Use one reliable visual model to make adding and comparing fractions feel ordinary.",
    duration: "11:48",
    watched: "00:00 watched",
    progress: 0,
    lessonNumber: "Lesson 01 of 04",
    updated: "Added 1 week ago",
    poster: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: false
  },
  {
    id: "reading-between-lines",
    volume: "Vol 3",
    volumeNumber: 3,
    title: "Reading between the lines",
    subject: "Writing",
    tutor: "Maya Patel",
    initials: "MP",
    tutorRole: "Writing tutor",
    description: "Notice the choices an author makes before you decide what a passage means.",
    duration: "16:23",
    watched: "00:00 watched",
    progress: 0,
    lessonNumber: "Lesson 01 of 07",
    updated: "Added 1 week ago",
    poster: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: false
  },
  {
    id: "lab-notebook",
    volume: "Vol 3",
    volumeNumber: 3,
    title: "How to think in a lab notebook",
    subject: "Science",
    tutor: "Noah Williams",
    initials: "NW",
    tutorRole: "Biology tutor",
    description: "A practical lesson in recording observations so your next experiment teaches you more.",
    duration: "13:09",
    watched: "00:00 watched",
    progress: 0,
    lessonNumber: "Lesson 01 of 05",
    updated: "Added 2 weeks ago",
    poster: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: false
  }
];

let lessons = librarySeed.map(normalizeLesson);
let activeFilter = "All";
let activeView = "Home";
let activeVolume = null;
let featuredId = "algebra-essentials";
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

function volumeGroups() {
  const groups = new Map();
  lessons.forEach((lesson) => {
    if (!groups.has(lesson.volumeId)) groups.set(lesson.volumeId, { id: lesson.volumeId, label: lesson.volume, number: lesson.volumeNumber, lessons: [] });
    groups.get(lesson.volumeId).lessons.push(lesson);
  });
  return [...groups.values()].sort((a, b) => b.number - a.number);
}

function activeVolumeGroup() {
  return volumeGroups().find((volume) => volume.id === activeVolume);
}

function renderVolumeTabs() {
  const volumes = volumeGroups();
  if (!volumes.length) return;
  if (!activeVolume || (activeVolume !== "all" && !volumes.some((volume) => volume.id === activeVolume))) activeVolume = volumes[0].id;
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
  if (!lesson) return;
  const player = $("#featuredVideo");
  const hasVideo = Boolean(lesson.videoUrl);
  $("#featuredPoster").src = lesson.poster;
  $("#featuredPoster").alt = `Tutor lesson cover for ${lesson.title}`;
  $("#featuredPoster").hidden = hasVideo;
  player.hidden = !hasVideo;
  player.pause();
  player.removeAttribute("src");
  if (hasVideo) player.src = resolveVideoUrl(lesson.videoUrl);
  $("#featuredTitle").textContent = lesson.title;
  $("#featuredVolume").textContent = lesson.volume;
  $("#featuredSubject").textContent = lesson.subject;
  $("#featuredUpdated").textContent = lesson.updated;
  $("#featuredDescription").textContent = lesson.description;
  $("#featuredTutor").textContent = lesson.tutor;
  $("#featuredTutorAvatar").textContent = lesson.initials;
  $("#featuredDuration").textContent = lesson.duration;
  $("#featuredProgressLabel").textContent = lesson.watched;
  $("#featuredProgressBar").style.width = `${lesson.progress}%`;
  $("#featuredLessonNumber").textContent = lesson.lessonNumber || "Tutor lesson";
  $("#playButton").setAttribute("aria-label", `Play ${lesson.title}`);
  $("#saveFeaturedButton").classList.toggle("is-saved", lesson.saved);
  $("#videoStatus").textContent = lesson.videoUrl ? "Ready to watch" : "Preview lesson";
  $("#resumeButton").innerHTML = `<i data-lucide="${lesson.progress ? "play-circle" : "sparkles"}" aria-hidden="true"></i>${lesson.progress ? "Resume lesson" : "Start lesson"}`;
  renderIcons();
}

function resolveVideoUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/") || value.startsWith("./Video%20resource/")) return value;
  return `./Video%20resource/${value.replace("./", "")}`;
}

function renderCards() {
  const visibleLessons = filteredLessons();
  const grid = $("#lessonGrid");
  grid.innerHTML = visibleLessons.map((lesson) => `
    <article class="lesson-card" data-lesson-id="${lesson.id}">
      <button class="card-poster" type="button" aria-label="Open ${lesson.title}">
        <img loading="lazy" src="${lesson.poster}" alt="" />
        <span class="card-label">${lesson.subject}</span>
        <span class="card-time">${lesson.duration}</span>
      </button>
      <div class="card-body">
        <h3>${lesson.title}</h3>
        <div class="card-meta"><span class="mini-avatar">${lesson.initials}</span><span>${lesson.tutor}</span><span aria-hidden="true">·</span><span>${lesson.progress ? `${lesson.progress}% watched` : "New lesson"}</span></div>
        <div class="card-progress" aria-label="${lesson.progress}% watched"><span style="width: ${lesson.progress}%"></span></div>
      </div>
    </article>
  `).join("");
  $("#emptyState").hidden = visibleLessons.length > 0;
  $("#clearSearchButton").hidden = !$("#searchInput").value;
  const currentVolume = activeVolumeGroup();
  $("#lessonCount").textContent = activeVolume === "all" ? `${visibleLessons.length} lessons across all volumes` : `${visibleLessons.length} lessons in ${currentVolume?.label || "this volume"}`;
  renderIcons();
}

function selectLesson(id) {
  featuredId = id;
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
    if (firstLesson) featuredId = firstLesson.id;
    renderVolumeTabs();
    renderFeatured();
    renderCards();
  });

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
    if (card) selectLesson(card.dataset.lessonId);
  });
  $("#viewQueueButton").addEventListener("click", () => showToast("Your queue is ready: 3 lessons are in progress."));
  $("#playButton").addEventListener("click", () => {
    const lesson = lessons.find((item) => item.id === featuredId);
    if (!lesson.videoUrl) {
      showToast("This lesson is queued for video. Add its file in Video resource, then set videoUrl in videos.json.");
      return;
    }
    const player = $("#featuredVideo");
    if (player.paused) {
      player.play().then(() => showToast("Playback started.")).catch(() => showToast("The video file could not be opened yet."));
    } else {
      player.pause();
      showToast("Playback paused.");
    }
  });
  $("#resumeButton").addEventListener("click", () => $("#playButton").click());
  $("#saveFeaturedButton").addEventListener("click", () => {
    const lesson = lessons.find((item) => item.id === featuredId);
    lesson.saved = !lesson.saved;
    renderFeatured();
    renderCards();
    showToast(lesson.saved ? "Saved to your study list." : "Removed from saved lessons.");
  });
}

async function loadCatalog() {
  try {
    const response = await fetch("./Video%20resource/videos.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Manifest unavailable");
    const remoteLessons = await response.json();
    if (Array.isArray(remoteLessons) && remoteLessons.length) lessons = remoteLessons.map(normalizeLesson);
  } catch (error) {
    // The inline seed keeps the page usable when opened directly from disk.
  }
  renderVolumeTabs();
  renderFeatured();
  renderCards();
}

function setDate() {
  const date = new Date();
  $("#dateLine").textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date);
  const hour = date.getHours();
  $("#greeting").textContent = `${hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"}, Alex.`;
}

setDate();
bindEvents();
loadCatalog();
