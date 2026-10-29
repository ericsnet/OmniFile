# OmniFile

[Español: README.es.md](README.es.md) · [Open OmniFile on GitHub Pages](https://ericsnet.github.io/OmniFile/)

**A browser-first file viewer and converter, with an optional local service planned for advanced formats.**

OmniFile is a static web app that can be published on GitHub Pages and opened locally. It is designed to make common file previews and conversions accessible from one interface.

## Current features

- Open one or more files from your device using the file picker or drag and drop.
- Preview browser-supported images, PDF, audio, video, source code, subtitles, and common text formats.
- Preview DOCX documents with Mammoth; inspect XLSX/XLS/ODS spreadsheets with SheetJS.
- Inspect ZIP/CBZ/EPUB archive contents and extract individual files in the browser.
- Read embedded ID3 lyrics from audio files when present, with an animated audio-reactive waveform.
- Import a direct file URL when the remote server permits cross-origin browser access (CORS).
- Convert images between PNG, JPEG, WebP, and PDF.
- Convert PDF pages to PNG/JPEG (one page per image; multi-page output is bundled into ZIP), or extract PDF text.
- Convert text, Markdown, HTML, JSON, CSV/TSV, DOCX, and spreadsheets to supported outputs such as PDF, HTML, TXT, CSV, or JSON.
- Process selected local files in the browser; OmniFile does not upload those files to an OmniFile backend.
- Start the local web app with one launcher script; no Node.js packages or Python dependencies are required.
- Switch the interface between English and Spanish using the language selector in the top bar.

## Run locally

**Requirements:** Python 3.9 or newer. The app uses Python's standard library for its local web server; no pip installation is needed.

### Windows

1. Download the repository using **Code → Download ZIP**, then extract it, or clone it with Git.
2. Open the extracted `OmniFile` folder.
3. Double-click `start-local.bat`.
4. Your browser should open OmniFile automatically. If it does not, open the local address printed in the terminal.
5. Keep the terminal open while using the app. Press `Ctrl+C` in the terminal to stop the server.

### Linux / macOS

1. Clone or download the repository and open a terminal in the `OmniFile` folder.
2. Run:

   ```bash
   chmod +x start-local.sh
   ./start-local.sh
   ```

3. Your browser should open automatically. If it does not, use the address printed in the terminal.
4. Press `Ctrl+C` to stop the server.

### Manual method

If you prefer not to use a launcher:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. You can also run `python run_local.py` to start the app on an available local port and open the browser automatically.

The local server binds only to `127.0.0.1` (your own computer), not to your public network interface. The browser still enforces its normal file access and cross-origin restrictions. The same language selector is available in both local mode and GitHub Pages.

## Format support: what is and isn't included

| Task | Current support |
| --- | --- |
| Image preview | Formats supported by the browser, commonly PNG, JPEG, GIF, WebP, SVG, AVIF (browser-dependent) |
| Image conversion | PNG, JPEG, WebP, PDF; actual output depends on browser encoder support |
| PDF conversion | PDF pages to PNG/JPEG and PDF text to TXT; multi-page images are bundled in ZIP |
| Text/data conversion | TXT/Markdown/HTML to PDF/HTML/TXT; JSON ↔ CSV for supported object arrays/tables |
| Office preview/conversion | DOCX preview/export to HTML/TXT; XLSX/XLS/ODS first-sheet export to CSV/JSON |
| Archive preview | ZIP, CBZ, EPUB file listing and individual-file extraction; not full EPUB rendering |
| Embedded audio lyrics | ID3 USLT/SYLT plus detected LYRICS/UNSYNCEDLYRICS comments; only if metadata exists |
| Image to PDF | Yes, via jsPDF CDN; image is placed on a PDF page |
| PDF preview | Browser PDF viewer support required |
| Text and source preview | Common text, markup, configuration and source files; preview is capped at 2 MB of text |
| Audio/video preview | Browser-supported codecs and containers only |
| MP4 to MP3 | **Not implemented in the web version** |
| Office documents, archives, CAD, 3D, proprietary formats | **No universal support yet**; format-specific libraries or external local tools are needed |

“Universal” is the long-term goal, not a claim that every file type is supported today. A file extension alone does not guarantee a format can be decoded.

## GitHub Pages

The repository is configured to deploy through GitHub Actions. The site is available at <https://ericsnet.github.io/OmniFile/> once the latest workflow run finishes. You can check **Actions** in the repository if the deployment is still pending.

## Privacy and limitations

- Files selected from your device stay in the browser unless you explicitly open a remote URL. This app has no upload endpoint.
- URL import uses `fetch()`; the remote host must allow cross-origin access. A normal web page URL is not necessarily a direct file URL.
- jsPDF, PDF.js, Mammoth, SheetJS, JSZip, and Google Fonts can load from external CDNs. Related tools require internet access the first time they are used; conversion will fail if a required CDN is unavailable.
- Very large files or images may exceed browser memory limits.
- This is a browser-based app, not a privileged filesystem browser. The browser requires you to select files and cannot read arbitrary paths from your computer.
- Running OmniFile locally currently means serving the web interface from your computer. It does **not** yet include a local FFmpeg conversion backend. Advanced conversions such as MP4 → MP3, video transcoding, full Office fidelity, CAD/3D formats, and batch media processing still need additional tools and integration.

## Roadmap

- [ ] Optional local conversion service with explicit format capability checks
- [ ] FFmpeg-backed audio/video conversion (including MP4 → MP3 when codecs are available)
- [ ] Additional document and archive formats
- [ ] Conversion queue, progress, cancellation, and batch downloads
- [ ] Tests for format detection and conversion errors

## Development

The project uses plain HTML, CSS, and JavaScript with no build step, plus a Python standard-library launcher for local use. Keep the compatibility table in this README aligned with the actual implementation.

## License

No license has been added yet. Unless a license is provided, public visibility does not automatically grant permission to reuse, modify, or redistribute the code.
