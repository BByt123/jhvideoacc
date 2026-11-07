# JH Studyroom

A static English tutor video watching platform designed for GitHub Pages. It has a calm learning dashboard, volume navigation, search, saved lessons, progress indicators, and a YouTube-style featured video player.

## Add a lesson video

1. Upload the lesson to YouTube with the visibility set to **Private** or **Unlisted**.
2. Open [`Video resource/videos.json`](./Video%20resource/videos.json).
3. Set the matching lesson's `youtubeUrl` to the YouTube watch link.
4. Commit and push the manifest to GitHub Pages. The studyroom embeds the link and also provides a direct YouTube button for private videos.

## Publish on GitHub Pages

This project is dependency-free. Push the repository, then choose **Settings → Pages → Deploy from a branch**, select the branch and `/ (root)` folder, and save. The site entry point is [`index.html`](./index.html).

Add each new lesson object to the manifest as you add a lesson. Volume tabs are sorted with the highest volume number first. YouTube handles playback, speed, quality, scrubbing, volume, skip, and fullscreen controls. Large local video files are ignored by Git through `.gitignore`.
