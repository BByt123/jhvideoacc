# Video resource

Drop tutor video files in this folder and point the matching `videoUrl` field in `videos.json` to the file name.

Example:

```json
"videoUrl": "algebra-essentials.mp4"
```

Keep file names lowercase with hyphens. The app resolves the name inside this folder and uses the browser's native HTML5 video controls. GitHub Pages serves these files as static assets, so no server or database is needed. The app uses the inline catalog as a fallback when opened directly from disk, and loads this manifest when it is hosted.
