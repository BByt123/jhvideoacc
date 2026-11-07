const librarySeed = []; /*
  {
    id: "algebra-essentials",
    volume: "Vol 4",
    volumeNumber: 4,
    title: "Grammar essentials: sentence control",
    subject: "English",
    tutor: "Priya Chandra",
    initials: "PC",
    tutorRole: "English tutor",
    description: "Build confident sentences by seeing how clauses, punctuation, and rhythm work together.",
    duration: "14:32",
    watched: "06:18 watched",
    progress: 43,
    lessonNumber: "Lesson 01 of 04",
    updated: "Updated yesterday",
    poster: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=85",
    videoUrl: "",
    saved: false
  },
  {
    id: "essay-architecture",
    volume: "Vol 4",
    volumeNumber: 4,
    title: "The architecture of a strong essay",
    subject: "English",
    tutor: "Maya Patel",
    initials: "MP",
    tutorRole: "English tutor",
    description: "Turn a loose idea into a structure your reader can trust, one paragraph at a time.",
    duration: "18:05",
    watched: "03:42 watched",
    progress: 21,
    lessonNumber: "Lesson 02 of 04",
    updated: "Added 2 days ago",
    poster: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: true
  },
  {
    id: "cellular-energy",
    volume: "Vol 4",
    volumeNumber: 4,
    title: "Reading for evidence, without the fog",
    subject: "English",
    tutor: "Noah Williams",
    initials: "NW",
    tutorRole: "English tutor",
    description: "Learn to spot the exact words that prove an interpretation before you write your answer.",
    duration: "22:11",
    watched: "11:10 watched",
    progress: 50,
    lessonNumber: "Lesson 03 of 04",
    updated: "Added 4 days ago",
    poster: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: false
  },
  {
    id: "fractions-confidence",
    volume: "Vol 4",
    volumeNumber: 4,
    title: "Vocabulary that sticks",
    subject: "English",
    tutor: "Priya Chandra",
    initials: "PC",
    tutorRole: "English tutor",
    description: "Make new words memorable with context, word families, and a repeatable review habit.",
    duration: "11:48",
    watched: "00:00 watched",
    progress: 0,
    lessonNumber: "Lesson 04 of 04",
    updated: "Added 1 week ago",
    poster: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: false
  },
  {
    id: "reading-between-lines",
    volume: "Vol 3",
    volumeNumber: 3,
    title: "Speaking with confidence",
    subject: "English",
    tutor: "Maya Patel",
    initials: "MP",
    tutorRole: "English tutor",
    description: "Shape a clear spoken answer with a simple opening, evidence, and a strong final sentence.",
    duration: "16:23",
    watched: "00:00 watched",
    progress: 0,
    lessonNumber: "Lesson 01 of 04",
    updated: "Added 1 week ago",
    poster: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: false
  },
  {
    id: "lab-notebook",
    volume: "Vol 3",
    volumeNumber: 3,
    title: "Editing in three passes",
    subject: "English",
    tutor: "Noah Williams",
    initials: "NW",
    tutorRole: "English tutor",
    description: "Edit for meaning, structure, and accuracy in three focused passes that keep your voice intact.",
    duration: "13:09",
    watched: "00:00 watched",
    progress: 0,
    lessonNumber: "Lesson 02 of 04",
    updated: "Added 2 weeks ago",
    poster: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: false
  },
  {
    id: "exam-reading-strategy",
    volume: "Vol 3",
    volumeNumber: 3,
    title: "Exam reading strategy: find the proof",
    subject: "English",
    tutor: "Priya Chandra",
    initials: "PC",
    tutorRole: "English tutor",
    description: "Move from a question to the exact line that answers it, without rereading the whole passage.",
    duration: "15:18",
    watched: "00:00 watched",
    progress: 0,
    lessonNumber: "Lesson 03 of 04",
    updated: "Added 2 weeks ago",
    poster: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: false
  },
  {
    id: "clear-paragraphs",
    volume: "Vol 3",
    volumeNumber: 3,
    title: "Build a clear paragraph",
    subject: "English",
    tutor: "Maya Patel",
    initials: "MP",
    tutorRole: "English tutor",
    description: "Use a dependable paragraph shape to move from an idea to evidence and explanation.",
    duration: "10:42",
    watched: "00:00 watched",
    progress: 0,
    lessonNumber: "Lesson 04 of 04",
    updated: "Added 3 weeks ago",
    poster: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=85",
    videoUrl: "",
    saved: false
  }
]; */

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

function getVideoSources(lesson) {
  const listedSources = lesson?.videoSources || lesson?.sources || [];
  const sources = Array.isArray(listedSources) ? listedSources.map((source) => {
    if (typeof source === "string") return { label: "Auto", src: source };
    return { label: source.label || source.quality || "Auto", src: source.src || source.url || "" };
  }).filter((source) => source.src) : [];
  if (!sources.length && lesson?.videoUrl) sources.push({ label: "Auto", src: lesson.videoUrl });
  return sources;
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
    return videoId ? `https://www.youtube.com/embed/${videoId}?controls=1&fs=1&playsinline=1&rel=0&modestbranding=1` : value;
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
    $("#volumeSummary").textContent = "Add a volume folder to get started";
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
  const player = $("#featuredVideo");
  const embed = $("#featuredEmbed");
  const playButton = $("#playButton");
  const saveButton = $("#saveFeaturedButton");
  const resumeButton = $("#resumeButton");
  const playerControls = $("#playerControls");
  const youtubeOpenButton = $("#youtubeOpenButton");
  const volumePill = $("#featuredVolume");
  const subjectPill = $("#featuredSubject");
  if (!lesson) {
    featured.classList.add("is-empty");
    $("#videoStage").classList.remove("has-youtube");
    poster.hidden = true;
    player.hidden = true;
    player.pause();
    player.removeAttribute("src");
    player.load();
    embed.hidden = true;
    embed.removeAttribute("src");
    renderQualityOptions([]);
    playButton.hidden = true;
    saveButton.hidden = true;
    resumeButton.hidden = true;
    playerControls.hidden = true;
    youtubeOpenButton.hidden = true;
    volumePill.hidden = true;
    subjectPill.hidden = true;
    $("#videoStatus").textContent = "No lesson selected";
    $("#featuredDuration").textContent = "";
    $("#featuredProgressLabel").textContent = "";
    $("#featuredLessonNumber").textContent = "";
    $("#featuredUpdated").textContent = "Ready for your first upload";
    $("#featuredTitle").textContent = "Your lesson shelf is ready";
    $("#featuredDescription").textContent = "Add your English tutor videos to a volume folder, then list them in Video resource/videos.json.";
    $("#featuredTutor").textContent = "No lessons added yet";
    $("#featuredTutorRole").textContent = "Waiting for your video files";
    $("#featuredTutorAvatar").textContent = "--";
    $("#featuredProgressBar").style.width = "0%";
    return;
  }
  featured.classList.remove("is-empty");
  playButton.hidden = false;
  saveButton.hidden = false;
  resumeButton.hidden = false;
  volumePill.hidden = false;
  subjectPill.hidden = false;
  const sources = getVideoSources(lesson);
  const youtubeUrl = getYoutubeUrl(lesson);
  const hasYoutube = Boolean(youtubeUrl);
  const hasLocalVideo = sources.length > 0;
  const hasVideo = hasYoutube || hasLocalVideo;
  $("#videoStage").classList.toggle("has-youtube", hasYoutube);
  playButton.hidden = hasYoutube;
  resumeButton.hidden = hasYoutube;
  playerControls.hidden = !hasLocalVideo;
  poster.src = lesson.poster || "";
  poster.alt = `Tutor lesson cover for ${lesson.title}`;
  poster.hidden = hasVideo;
  player.hidden = !hasLocalVideo;
  embed.hidden = !hasYoutube;
  embed.src = hasYoutube ? getYoutubeEmbedUrl(youtubeUrl) : "";
  player.pause();
  player.removeAttribute("src");
  player.load();
  renderQualityOptions(sources);
  if (hasLocalVideo) {
    player.src = resolveVideoUrl(sources[0].src);
    player.load();
  }
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
  $("#videoStatus").textContent = hasYoutube ? "Private YouTube link" : hasLocalVideo ? "Ready to watch" : "Preview lesson";
  youtubeOpenButton.hidden = !hasYoutube;
  youtubeOpenButton.dataset.url = youtubeUrl;
  $("#resumeButton").innerHTML = `<i data-lucide="${lesson.progress ? "play-circle" : "sparkles"}" aria-hidden="true"></i>${lesson.progress ? "Resume lesson" : "Start lesson"}`;
  renderIcons();
}

function renderQualityOptions(sources) {
  const quality = $("#playerQuality");
  quality.innerHTML = sources.length ? sources.map((source, index) => `<option value="${index}">${source.label}</option>`).join("") : "<option value=\"\">Auto</option>";
  quality.disabled = sources.length < 2;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  return `${hours ? `${hours}:` : ""}${hours ? String(minutes).padStart(2, "0") : minutes}:${String(remainder).padStart(2, "0")}`;
}

function setPlayerIcon(icon, label) {
  const button = $("#playerPlayPause");
  button.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
  button.setAttribute("aria-label", label);
  renderIcons();
}

function updatePlayerUi() {
  const player = $("#featuredVideo");
  const duration = Number.isFinite(player.duration) ? player.duration : 0;
  const percentage = duration ? (player.currentTime / duration) * 100 : 0;
  $("#playerCurrentTime").textContent = formatTime(player.currentTime);
  $("#playerDuration").textContent = formatTime(duration);
  if (duration) $("#featuredDuration").textContent = formatTime(duration);
  $("#playerSeek").value = percentage;
  $("#featuredProgressBar").style.width = `${percentage}%`;
  $("#playerVolume").value = player.muted ? 0 : player.volume;
  $("#playerMute").innerHTML = `<i data-lucide="${player.muted || player.volume === 0 ? "volume-x" : "volume-2"}" aria-hidden="true"></i>`;
  $("#playerMute").setAttribute("aria-label", player.muted ? "Unmute video" : "Mute video");
}

function togglePlayback() {
  const player = $("#featuredVideo");
  const lesson = lessons.find((item) => item.id === featuredId);
  if (getYoutubeUrl(lesson)) {
    openYoutubeLesson(getYoutubeUrl(lesson));
    return;
  }
  if (!lesson || !getVideoSources(lesson).length) {
    showToast("Add a YouTube link to this lesson before playing it.");
    return;
  }
  if (player.paused) {
    if (player.ended) player.currentTime = 0;
    player.play().catch(() => showToast("The video file could not be opened yet."));
  }
  else player.pause();
}

function openYoutubeLesson(url) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function switchVideoSource(index) {
  const lesson = lessons.find((item) => item.id === featuredId);
  const source = getVideoSources(lesson)[Number(index)];
  const player = $("#featuredVideo");
  if (!source) return;
  const nextUrl = new URL(resolveVideoUrl(source.src), window.location.href).href;
  if (player.currentSrc === nextUrl) return;
  const position = player.currentTime;
  const wasPlaying = !player.paused;
  player.pause();
  player.src = resolveVideoUrl(source.src);
  player.load();
  player.addEventListener("loadedmetadata", () => {
    player.currentTime = Math.min(position, player.duration || position);
    if (wasPlaying) player.play().catch(() => {});
  }, { once: true });
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
  const isEmpty = visibleLessons.length === 0;
  $("#emptyState").hidden = !isEmpty;
  $("#emptyState h3").textContent = $("#searchInput").value ? "No lessons found" : "No lessons added yet";
  $("#emptyState p").textContent = $("#searchInput").value ? "Try a different search term." : "Add your first English video to a volume folder, then update videos.json.";
  $("#clearSearchButton").hidden = !$("#searchInput").value;
  const currentVolume = activeVolumeGroup();
  $("#lessonCount").textContent = activeVolume === "all" ? `${visibleLessons.length} lessons across all volumes` : `${visibleLessons.length} lessons in ${currentVolume?.label || "this volume"}`;
  updateNavCounts();
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
    featuredId = firstLesson?.id || null;
    renderVolumeTabs();
    renderFeatured();
    renderCards();
  });

  const player = $("#featuredVideo");
  player.addEventListener("loadedmetadata", updatePlayerUi);
  player.addEventListener("timeupdate", updatePlayerUi);
  player.addEventListener("play", () => {
    setPlayerIcon("pause", "Pause video");
    updatePlayerUi();
  });
  player.addEventListener("pause", () => {
    setPlayerIcon("play", "Play video");
    updatePlayerUi();
  });
  player.addEventListener("ended", () => {
    setPlayerIcon("rotate-ccw", "Replay video");
    updatePlayerUi();
  });
  player.addEventListener("volumechange", () => {
    updatePlayerUi();
    renderIcons();
  });
  $("#playerPlayPause").addEventListener("click", togglePlayback);
  $("#playButton").addEventListener("click", togglePlayback);
  $("#playerSkipBack").addEventListener("click", () => { player.currentTime = Math.max(0, player.currentTime - 10); });
  $("#playerSkipForward").addEventListener("click", () => { player.currentTime = Math.min(player.duration || player.currentTime + 10, player.currentTime + 10); });
  $("#playerSeek").addEventListener("input", (event) => {
    if (player.duration) player.currentTime = (Number(event.target.value) / 100) * player.duration;
  });
  $("#playerVolume").addEventListener("input", (event) => {
    player.volume = Number(event.target.value);
    player.muted = player.volume === 0;
  });
  $("#playerMute").addEventListener("click", () => { player.muted = !player.muted; });
  $("#playerSpeed").addEventListener("change", (event) => { player.playbackRate = Number(event.target.value); });
  $("#playerQuality").addEventListener("change", (event) => switchVideoSource(event.target.value));
  $("#playerFullscreen").addEventListener("click", async () => {
    const stage = $("#videoStage");
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (stage.requestFullscreen) await stage.requestFullscreen();
    else if (player.webkitEnterFullscreen) player.webkitEnterFullscreen();
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
    if (card) selectLesson(card.dataset.lessonId);
  });
  $("#viewQueueButton").addEventListener("click", () => showToast(lessons.length ? "Your queue is ready." : "Your queue is empty until you add a lesson."));
  $("#resumeButton").addEventListener("click", togglePlayback);
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
    if (Array.isArray(remoteLessons)) lessons = remoteLessons.map(normalizeLesson);
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
