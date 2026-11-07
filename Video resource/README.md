# Video resource

Organize lesson records by volume in `videos.json`, for example `Vol 4`, `Vol 3`, and later `Vol 5`. Keep the volume list in [`volumes.json`](./volumes.json) so empty volumes still appear in the navigation. The first Vol 3 lesson is already registered; add future lessons as new objects and point each `youtubeUrl` at its private or unlisted YouTube watch link.

Example:

```json
"youtubeUrl": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
```

Keep volume names in the `Vol N` format. The page converts normal YouTube watch links, `youtu.be` links, Shorts links, and embed links into the web player. Private links may require the viewer to sign in to the YouTube account that has access, so the featured lesson also includes a direct **Watch on YouTube** button. The old `.mp4` file can remain local, but `.mp4` files are ignored before GitHub commits.
