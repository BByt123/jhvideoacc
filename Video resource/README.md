# Video resource

Organize tutor videos in one folder per volume, for example `vol4/`, `vol3/`, and later `vol5/`. Point the matching `videoUrl` field in `videos.json` to the volume-relative path.

Example:

```json
"videoUrl": "vol4/algebra-essentials.mp4"
```

Keep folder names in the `volN` format and file names lowercase with hyphens. The app puts the highest numbered volume first and uses the browser's native HTML5 video controls. GitHub Pages serves these files as static assets, so no server or database is needed. The app uses the inline catalog as a fallback when opened directly from disk, and loads this manifest when it is hosted.
