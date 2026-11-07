# JH Studyroom

A static tutor video watching platform designed for GitHub Pages. It has a calm learning dashboard, subject filters, search, saved lessons, progress indicators, and a featured lesson area ready to switch to native video playback.

## Add a lesson video

1. Put the file in its volume folder, such as [`Video resource/vol4`](./Video%20resource/vol4/) or [`Video resource/vol3`](./Video%20resource/vol3/).
2. Open [`Video resource/videos.json`](./Video%20resource/videos.json).
3. Set the matching lesson's `videoUrl` to the volume-relative path, for example `"vol4/algebra-essentials.mp4"`.
4. Commit and push the folder to GitHub Pages.

## Publish on GitHub Pages

This project is dependency-free. Push the repository, then choose **Settings → Pages → Deploy from a branch**, select the branch and `/ (root)` folder, and save. The site entry point is [`index.html`](./index.html).

The UI works without local video files: lessons show their poster and a clear queue state until a `videoUrl` is added. Volume tabs are sorted with the highest volume number first.
