(() => {
  const $ = (selector) => document.querySelector(selector);
  const fileInput = $('#file-input');
  const dropZone = $('#drop-zone');
  const fileList = $('#file-list');
  const fileListWrap = $('#file-list-wrap');
  const previewSection = $('#preview-section');
  const previewContent = $('#preview-content');
  const previewTitle = $('#preview-title');
  const status = $('#status');
  const formatSelect = $('#format-select');
  const previewAction = $('#preview-action');
  const convertAction = $('#convert-action');
  let files = [];
  let selectedIndex = -1;
  let previewUrl = null;

  const bytes = (size) => size < 1024 ? size + ' B' : size < 1048576 ? (size / 1024).toFixed(1) + ' KB' : (size / 1048576).toFixed(1) + ' MB';
  const extension = (name) => (name.split('.').pop() || '').toLowerCase().slice(0, 6);
  const setStatus = (message, error = false) => { status.textContent = message; status.classList.toggle('error', error); };
  const selectedFile = () => files[selectedIndex] || null;
  const updateControls = () => {
    const file = selectedFile();
    previewAction.disabled = !file;
    formatSelect.disabled = !file || !file.type.startsWith('image/');
    convertAction.disabled = !file || !file.type.startsWith('image/');
  };
  function addFiles(incoming) {
    const fresh = Array.from(incoming || []);
    if (!fresh.length) return;
    files.push(...fresh);
    if (selectedIndex < 0) selectedIndex = 0;
    renderFiles();
    updateControls();
    setStatus(fresh.length + ' file(s) added. Select one to preview or convert.');
  }
  function renderFiles() {
    fileList.replaceChildren();
    fileListWrap.classList.toggle('hidden', files.length === 0);
    files.forEach((file, index) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'file-row' + (index === selectedIndex ? ' selected' : '');
      row.setAttribute('aria-pressed', String(index === selectedIndex));
      const type = document.createElement('span'); type.className = 'file-type'; type.textContent = extension(file.name).toUpperCase() || 'FILE';
      const info = document.createElement('span'); info.className = 'file-info';
      const name = document.createElement('span'); name.className = 'file-name'; name.textContent = file.name;
      const meta = document.createElement('span'); meta.className = 'file-meta'; meta.textContent = (file.type || 'Unknown MIME type') + ' · ' + bytes(file.size);
      info.append(name, document.createElement('br'), meta);
      const check = document.createElement('span'); check.className = 'file-check'; check.textContent = index === selectedIndex ? '✓' : '';
      row.append(type, info, check);
      row.addEventListener('click', () => { selectedIndex = index; renderFiles(); updateControls(); setStatus('Selected ' + file.name); });
      fileList.append(row);
    });
  }
  function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    previewContent.replaceChildren();
  }
  function showPreview(file) {
    if (!file) return;
    clearPreview();
    previewSection.classList.remove('hidden');
    previewTitle.textContent = file.name;
    const url = URL.createObjectURL(file);
    previewUrl = url;
    const mime = file.type || '';
    if (mime.startsWith('image/')) {
      const img = document.createElement('img'); img.src = url; img.alt = file.name; previewContent.append(img);
    } else if (mime === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const frame = document.createElement('iframe'); frame.src = url; frame.title = 'PDF preview'; previewContent.append(frame);
    } else if (mime.startsWith('audio/')) {
      const audio = document.createElement('audio'); audio.controls = true; audio.src = url; previewContent.append(audio);
    } else if (mime.startsWith('video/')) {
      const video = document.createElement('video'); video.controls = true; video.src = url; previewContent.append(video);
    } else if (mime.startsWith('text/') || /\.(txt|md|json|js|ts|jsx|tsx|css|html|xml|csv|yml|yaml|log|py|rs|sh)$/i.test(file.name)) {
      const pre = document.createElement('pre');
      previewContent.append(pre);
      file.text().then((text) => { pre.textContent = text.slice(0, 1_000_000) + (text.length > 1_000_000 ? '\n\n[Preview truncated at 1 MB of text]' : ''); });
    } else {
      const message = document.createElement('div'); message.className = 'unsupported';
      message.textContent = 'No built-in preview for this format. The file is available to download from your device; advanced support may require a local tool.';
      previewContent.append(message);
    }
    previewSection.scrollIntoView({behavior:'smooth', block:'start'});
  }
  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  async function loadImage(file) {
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      return image;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  async function convertSelected() {
    const file = selectedFile();
    if (!file || !file.type.startsWith('image/')) return;
    convertAction.disabled = true;
    setStatus('Converting ' + file.name + '…');
    try {
      const target = formatSelect.value;
      const image = await loadImage(file);
      if (target === 'application/pdf') {
        if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('PDF export library did not load. Check your internet connection and reload the page.');
        const { jsPDF } = window.jspdf;
        const landscape = image.naturalWidth > image.naturalHeight;
        const pdf = new jsPDF({orientation:landscape?'landscape':'portrait', unit:'pt', format:[image.naturalWidth, image.naturalHeight]});
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
        canvas.getContext('2d').drawImage(image,0,0);
        pdf.addImage(canvas.toDataURL('image/jpeg',0.94),'JPEG',0,0,image.naturalWidth,image.naturalHeight);
        pdf.save(file.name.replace(/\.[^.]+$/, '') + '.pdf');
      } else {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d', {alpha: target !== 'image/jpeg'});
        if (target === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height); }
        ctx.drawImage(image,0,0);
        const blob = await new Promise((resolve,reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('This image could not be encoded in the selected format.')), target, 0.92));
        const ext = target === 'image/jpeg' ? 'jpg' : target === 'image/webp' ? 'webp' : 'png';
        downloadBlob(blob, file.name.replace(/\.[^.]+$/, '') + '.' + ext);
      }
      setStatus('Conversion finished. Your file was created in the browser.');
    } catch (error) {
      setStatus(error.message || 'Conversion failed.', true);
    } finally { updateControls(); }
  }
  document.querySelectorAll('.source-tab').forEach((tab) => tab.addEventListener('click', () => {
    const isLocal = tab.dataset.source === 'local';
    document.querySelectorAll('.source-tab').forEach((button) => { button.classList.toggle('active', button === tab); button.setAttribute('aria-selected', String(button === tab)); });
    $('#local-source').classList.toggle('hidden', !isLocal);
    $('#url-source').classList.toggle('hidden', isLocal);
  }));
  fileInput.addEventListener('change', (event) => { addFiles(event.target.files); fileInput.value = ''; });
  ['dragenter','dragover'].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.add('dragover'); }));
  ['dragleave','drop'].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.remove('dragover'); }));
  dropZone.addEventListener('drop', (event) => addFiles(event.dataTransfer.files));
  $('#clear-files').addEventListener('click', () => { files = []; selectedIndex = -1; clearPreview(); previewSection.classList.add('hidden'); renderFiles(); updateControls(); setStatus('File list cleared.'); });
  previewAction.addEventListener('click', () => showPreview(selectedFile()));
  convertAction.addEventListener('click', convertSelected);
  $('#close-preview').addEventListener('click', () => { clearPreview(); previewSection.classList.add('hidden'); });
  $('#url-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = $('#url-input').value.trim();
    setStatus('Fetching file from URL…');
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('The URL returned HTTP ' + response.status + '.');
      const blob = await response.blob();
      const name = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'download');
      addFiles([new File([blob], name, {type:blob.type || ''})]);
    } catch (error) {
      setStatus('Could not fetch this URL. It may block cross-origin requests (CORS), require sign-in, or not be a direct file link. ' + error.message, true);
    }
  });
  window.addEventListener('beforeunload', clearPreview);
  updateControls();
})();