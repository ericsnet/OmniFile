# OmniFile

**A browser-first file viewer and converter, with an optional local service planned for advanced formats.**

OmniFile is a static web app that can be published on GitHub Pages and opened locally. It is designed to make common file previews and conversions accessible from one interface.

## Current features

- Open one or more files from your device using the file picker or drag and drop.
- Preview browser-supported images, PDF files, audio, video, and common text/code formats.
- Import a direct file URL when the remote server permits cross-origin browser access (CORS).
- Convert images to PNG, JPEG, or WebP using the browser's Canvas API.
- Export an image as a PDF using jsPDF loaded from a CDN.
- Process selected local files in the browser; OmniFile does not upload those files to an OmniFile backend.

## Format support: what is and isn't included

| Task | Current support |
| --- | --- |
| Image preview | Formats supported by the browser, commonly PNG, JPEG, GIF, WebP, SVG, AVIF (browser-dependent) |
| Image conversion | PNG, JPEG, WebP; actual output depends on browser encoder support |
| Image to PDF | Yes, via jsPDF CDN; image is placed on a PDF page |
| PDF preview | Browser PDF viewer support required |
| Text and source preview | Common text, markup, configuration and source files; preview is capped at 1 MB of text |
| Audio/video preview | Browser-supported codecs and containers only |
| MP4 to MP3 | **Not implemented in the web version** |
| Office documents, archives, CAD, 3D, proprietary formats | **No universal support yet**; format-specific libraries or external local tools are needed |

“Universal” is the long-term goal, not a claim that every file type is supported today. A file extension alone does not guarantee a format can be decoded.

## Run locally

No build step is required for the static web interface.

### Option A — Python

From the repository directory:

```bash
python -m http.server 8000
```

Open <http://localhost:8000>.

### Option B — Node.js

```bash
npx serve .
```

Open the local URL shown in the terminal.

You can also open `index.html` directly, but a local HTTP server is recommended because some browser features behave differently on `file://` URLs.

## GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Select **Deploy from a branch**.
3. Choose `main` and the `/ (root)` folder.
4. Save and wait for GitHub Pages to publish the site.

The public site URL will normally be <https://ericsnet.github.io/OmniFile/>.

## Privacy and limitations

- Files selected from your device stay in the browser unless you explicitly open a remote URL. This app has no upload endpoint.
- URL import uses `fetch()`; the remote host must allow cross-origin access. A normal web page URL is not necessarily a direct file URL.
- jsPDF and Google Fonts are loaded from external CDNs. The first PDF export needs the jsPDF script to have loaded; the UI remains usable without it, but PDF conversion will fail.
- Very large files or images may exceed browser memory limits.
- This is a client-side web app, not a privileged filesystem browser. The browser requires you to select files and cannot read arbitrary paths from your computer.
- Advanced local conversion (such as MP4 → MP3, Office formats, archives, and batch media processing) needs a local backend and tools such as FFmpeg or format-specific libraries. These are not included in the initial version.

## Roadmap

- [ ] Optional local conversion service with explicit format capability checks
- [ ] FFmpeg-backed audio/video conversion (including MP4 → MP3 when codecs are available)
- [ ] Additional document and archive formats
- [ ] Conversion queue, progress, cancellation, and batch downloads
- [ ] Tests for format detection and conversion errors

## Development

The project currently uses plain HTML, CSS, and JavaScript with no build step. Keep the compatibility table in this README aligned with the actual implementation.

## License

No license has been added yet. Unless a license is provided, public visibility does not automatically grant permission to reuse, modify, or redistribute the code.
