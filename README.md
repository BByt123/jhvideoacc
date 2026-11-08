# JH Studyroom

A static English tutor video watching platform designed for GitHub Pages. It has a calm learning dashboard, volume navigation, search, saved lessons, progress indicators, and a YouTube-style featured video player.

## Add a lesson video

1. Upload the lesson to YouTube with the visibility set to **Private** or **Unlisted**.
2. Open [`Video resource/videos.json`](./Video%20resource/videos.json).
3. Add or update one object in `Video resource/videos.json` with its `volume`, `volumeNumber`, title, and `youtubeUrl`.
4. Commit and push the JSON catalog to GitHub Pages. The studyroom embeds each YouTube link and provides a direct YouTube button for private videos.

## Publish on GitHub Pages

This project is dependency-free. Push the repository, then choose **Settings → Pages → Deploy from a branch**, select the branch and `/ (root)` folder, and save. The site entry point is [`index.html`](./index.html).

Add each new YouTube lesson object to [`Video resource/videos.json`](./Video%20resource/videos.json). Keep the volume number in the object; tabs are sorted with the highest volume number first. [`Video resource/volumes.json`](./Video%20resource/volumes.json) only keeps empty volume tabs visible. YouTube supplies playback, speed, quality, scrubbing, volume, and fullscreen controls inside the embed.
