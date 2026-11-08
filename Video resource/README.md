# Video resource

Keep one JSON list of YouTube lesson records in `videos.json`. Each record carries its volume metadata, so the page does not read video files from Vol 3, Vol 4, or any other local folder. Keep the volume list in [`volumes.json`](./volumes.json) only when an empty volume should still appear in navigation. The first Vol 3 lesson is already registered; add future lessons as new objects and point each `youtubeUrl` at its private or unlisted YouTube watch link.

Example:

```json
"youtubeUrl": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
```

Keep volume names in the `Vol N` format. The page converts normal YouTube watch links, `youtu.be` links, Shorts links, and embed links into the web player. Private links may require the viewer to sign in to the YouTube account that has access, so the featured lesson also includes a direct **Watch on YouTube** button.
