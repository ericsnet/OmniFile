(() => {
  const $ = (s) => document.querySelector(s);
  const fileInput = $('#file-input'), dropZone = $('#drop-zone'), fileList = $('#file-list'), fileListWrap = $('#file-list-wrap');
  const previewSection = $('#preview-section'), previewContent = $('#preview-content'), previewTitle = $('#preview-title'), status = $('#status');
  const formatSelect = $('#format-select'), previewAction = $('#preview-action'), convertAction = $('#convert-action');
  let files = [], selectedIndex = -1, previewUrl = null, audioContext = null, audioFrame = 0, activeAudio = null;
  const ext = f => ((f.name.match(/\.([^.]+)$/)||[])[1]||'').toLowerCase();
  const bytes = n => n < 1024 ? n+' B' : n < 1048576 ? (n/1024).toFixed(1)+' KB' : (n/1048576).toFixed(1)+' MB';
  const t = (key, fallback, ...args) => window.omniT ? window.omniT(key, ...args) : fallback;
  const setStatus = (s, error=false) => { status.textContent=s; status.classList.toggle('error',error); };
  const selectedFile = () => files[selectedIndex] || null;
  const loadScript = (src, test) => new Promise((resolve,reject) => {
    if (test()) return resolve();
    const old = document.querySelector('script[data-omni-lib="'+src+'"]');
    if (old) { old.addEventListener('load',()=>test()?resolve():reject(new Error('Library failed to initialize.')),{once:true}); old.addEventListener('error',()=>reject(new Error('Could not load conversion library.')),{once:true}); return; }
    const script=document.createElement('script'); script.src=src; script.async=true; script.dataset.omniLib=src;
    script.onload=()=>test()?resolve():reject(new Error('Library failed to initialize.'));
    script.onerror=()=>reject(new Error('Could not load conversion library. Check your internet connection.'));
    document.head.append(script);
  });
  const libs = {
    pdf: async()=>{await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',()=>!!window.pdfjsLib); window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';return window.pdfjsLib;},
    zip: async()=>{await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',()=>!!window.JSZip);return window.JSZip;},
    mammoth: async()=>{await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js',()=>!!window.mammoth);return window.mammoth;},
    sheet: async()=>{await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',()=>!!window.XLSX);return window.XLSX;}
  };
  function ensurePreviewTools(){
    if (!$('#audio-visualizer-style')) { const style=document.createElement('style'); style.id='audio-visualizer-style'; style.textContent=`
      .audio-studio{width:100%;padding:22px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(135deg,#211c35,#151721);display:grid;gap:15px}
      .audio-studio h3{margin:0;font-size:18px}.audio-meta{color:var(--muted);font-size:12px}.audio-wave{width:100%;height:140px;display:block;border-radius:12px;background:#0c0d14}
      .audio-controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.audio-controls audio{width:min(100%,560px)}.lyrics-box{white-space:pre-wrap;line-height:1.9;background:#11121b;border:1px solid var(--line);border-radius:12px;padding:18px;max-height:360px;overflow:auto}.lyrics-label{font:10px 'DM Mono',monospace;letter-spacing:1.5px;color:var(--mint)}.file-preview-image{max-width:100%;height:auto;border-radius:12px}.structured-preview{width:100%;overflow:auto}.structured-preview table{border-collapse:collapse;width:100%;font-size:12px}.structured-preview th,.structured-preview td{border:1px solid var(--line);padding:7px;text-align:left;max-width:300px;overflow-wrap:anywhere}.structured-preview th{background:var(--panel2)}.conversion-options{margin:12px 0}.conversion-help{color:var(--muted);font-size:11px;margin-top:10px}.page-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}.page-gallery img{width:100%;border-radius:8px;border:1px solid var(--line)}.page-gallery a{font-size:11px;color:var(--purple)}.audio-studio .lyrics-missing{color:var(--muted);font-size:12px}.unsupported a{color:var(--purple)}`; document.head.append(style); }
    if (!$('#conversion-help')) { const p=document.createElement('p'); p.id='conversion-help'; p.className='conversion-help'; p.textContent='Available conversions depend on the selected file. Some tools load from a CDN.'; const convertRow=$('.convert-row'); if(convertRow) convertRow.after(p); }
  }
  function addFiles(incoming){
    const fresh=Array.from(incoming||[]); if(!fresh.length)return;
    files.push(...fresh); if(selectedIndex<0)selectedIndex=0;
    renderFiles(); updateControls(); setStatus(t('filesAdded','Added '+fresh.length+' file(s). Select one to preview or convert.',fresh.length));
  }
  function renderFiles(){
    fileList.replaceChildren(); fileListWrap.classList.toggle('hidden',!files.length);
    files.forEach((file,index)=>{
      const row=document.createElement('button');row.type='button';row.className='file-row'+(index===selectedIndex?' selected':'');row.setAttribute('aria-pressed',String(index===selectedIndex));
      const type=document.createElement('span');type.className='file-type';type.textContent=(ext(file)||'file').toUpperCase().slice(0,6);
      const info=document.createElement('span');info.className='file-info';const name=document.createElement('span');name.className='file-name';name.textContent=file.name;
      const meta=document.createElement('span');meta.className='file-meta';meta.textContent=(file.type||'Unknown MIME type')+' · '+bytes(file.size);info.append(name,document.createElement('br'),meta);
      const check=document.createElement('span');check.className='file-check';check.textContent=index===selectedIndex?'✓':'';
      row.append(type,info,check);row.addEventListener('click',()=>{selectedIndex=index;renderFiles();updateControls();setStatus(t('selectedFile','Selected '+file.name,file.name));});fileList.append(row);
    });
  }
  function stopAudio(){
    if(audioFrame)cancelAnimationFrame(audioFrame);audioFrame=0;
    if(activeAudio){try{activeAudio.pause();activeAudio.removeAttribute('src');activeAudio.load();}catch(_){} activeAudio=null;}
    if(audioContext){audioContext.close().catch(()=>{});audioContext=null;}
  }
  function clearPreview(){stopAudio();if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=null;previewContent.replaceChildren();}
  function textPreview(text){const pre=document.createElement('pre');pre.textContent=text.slice(0,2_000_000)+(text.length>2_000_000?'\n\n[Preview limited to 2 MB of text]':'');previewContent.append(pre);}
  async function parseLyrics(file){
    const buffer=await file.arrayBuffer(), bytesView=new Uint8Array(buffer);
    if(bytesView.length<4)return null;
    const hasId3=String.fromCharCode(...bytesView.slice(0,3))==='ID3';
    if(hasId3&&bytesView.length>=10){
      const data=new DataView(buffer),version=bytesView[3];
      const tagSize=((bytesView[6]&127)<<21)|((bytesView[7]&127)<<14)|((bytesView[8]&127)<<7)|(bytesView[9]&127);
      let pos=10,end=Math.min(bytesView.length,10+tagSize);
      while(pos+10<=end){
        const id=String.fromCharCode(...bytesView.slice(pos,pos+4));
        if(!/^[A-Z0-9]{4}$/.test(id))break;
        const size=version===4?((bytesView[pos+4]&127)<<21)|((bytesView[pos+5]&127)<<14)|((bytesView[pos+6]&127)<<7)|(bytesView[pos+7]&127):data.getUint32(pos+4,false);
        if(!size||pos+10+size>end)break;
        if(id==='USLT'||id==='SYLT'){
          const frame=bytesView.slice(pos+10,pos+10+size),enc=frame[0];let i=id==='SYLT'?6:4;
          if(enc===1||enc===2){while(i+1<frame.length&&!(frame[i]===0&&frame[i+1]===0))i+=2;i+=2;}
          else {while(i<frame.length&&frame[i]!==0)i++;i++;}
          if(id==='USLT'){const raw=frame.slice(i);return {kind:'lyrics',text:decodeText(raw,enc).replace(/\\0/g,'').trim()};}
          const lang=String.fromCharCode(...frame.slice(1,4)),content=decodeText(frame.slice(i),enc).replace(/\\0/g,'\\n').trim();
          if(content)return {kind:'synced',text:content,lang};
        }
        pos+=10+size;
      }
    }
    // FLAC and Ogg Vorbis comments can contain plain LYRICS/UNSYNCEDLYRICS fields.
    const rawTag=new TextDecoder('windows-1252').decode(bytesView);
    const match=rawTag.match(/(?:UNSYNCEDLYRICS|LYRICS|LYRICS3)=([^\\0]+)/i);
    if(match&&match[1].trim())return {kind:'lyrics',text:match[1].trim()};
    return null;
  }
  function decodeText(bytesView,encoding){
    try{
      if(encoding===1)return new TextDecoder('utf-16').decode(bytesView);
      if(encoding===2)return new TextDecoder('utf-16be').decode(bytesView);
      if(encoding===3)return new TextDecoder('utf-8').decode(bytesView);
      return new TextDecoder('windows-1252').decode(bytesView);
    }catch(_){return new TextDecoder().decode(bytesView);}
  }
  function animateWave(canvas, analyser){
    const ctx=canvas.getContext('2d');const dpr=window.devicePixelRatio||1;
    const draw=()=>{if(!canvas.isConnected)return;const w=canvas.clientWidth||600,h=canvas.clientHeight||140;if(canvas.width!==Math.floor(w*dpr)||canvas.height!==Math.floor(h*dpr)){canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const bins=new Uint8Array(analyser.frequencyBinCount);analyser.getByteFrequencyData(bins);const mid=h/2;ctx.strokeStyle='#8de5c5';ctx.lineWidth=2;ctx.shadowColor='#8de5c5';ctx.shadowBlur=8;ctx.beginPath();const count=Math.min(96,bins.length);for(let i=0;i<count;i++){const x=i/(count-1)*w;const amp=(bins[i]/255)*(h*.42);const y=mid+Math.sin(i*.34+performance.now()*.002)*amp;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=.45;ctx.strokeStyle='#b6a0ff';ctx.beginPath();for(let i=0;i<count;i++){const x=i/(count-1)*w;const amp=(bins[i]/255)*(h*.3);const y=mid-Math.cos(i*.31+performance.now()*.0015)*amp;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.globalAlpha=1;audioFrame=requestAnimationFrame(draw);};
    draw();
  }
  async function renderAudio(file,url){
    const box=document.createElement('div');box.className='audio-studio';const title=document.createElement('h3');title.textContent=file.name;const meta=document.createElement('div');meta.className='audio-meta';meta.textContent=(file.type||ext(file).toUpperCase())+' · '+bytes(file.size);
    const canvas=document.createElement('canvas');canvas.className='audio-wave';canvas.setAttribute('aria-label','Animated audio waveform');canvas.setAttribute('role','img');
    const controls=document.createElement('div');controls.className='audio-controls';const audio=document.createElement('audio');audio.controls=true;audio.preload='metadata';audio.src=url;activeAudio=audio;controls.append(audio);
    const lyricsHead=document.createElement('div');lyricsHead.className='lyrics-label';lyricsHead.textContent='LYRICS / EMBEDDED METADATA';const lyrics=document.createElement('div');lyrics.className='lyrics-box';lyrics.textContent='Looking for embedded lyrics…';
    box.append(title,meta,canvas,controls,lyricsHead,lyrics);previewContent.append(box);
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(AudioCtx){audioContext=new AudioCtx();const source=audioContext.createMediaElementSource(audio);const analyser=audioContext.createAnalyser();analyser.fftSize=256;analyser.smoothingTimeConstant=.82;source.connect(analyser);analyser.connect(audioContext.destination);audio.addEventListener('play',()=>audioContext&&audioContext.resume().catch(()=>{}));animateWave(canvas,analyser);}
      else {const c=canvas.getContext('2d');c.strokeStyle='#8de5c5';c.lineWidth=2;c.beginPath();for(let x=0;x<canvas.width||x<500;x+=5){const y=70+Math.sin(x*.06)*20*Math.sin(x*.013);if(x===0)c.moveTo(x,y);else c.lineTo(x,y);}c.stroke();}
    }catch(_){const c=canvas.getContext('2d');c.strokeStyle='#8de5c5';c.lineWidth=2;c.beginPath();for(let x=0;x<600;x+=4){const y=70+Math.sin(x*.05)*24*Math.sin(x*.012);if(!x)c.moveTo(x,y);else c.lineTo(x,y);}c.stroke();}
    try{
      let embedded=await parseLyrics(file);
      if(!embedded||!embedded.text){
        const base=file.name.replace(/\.[^.]+$/,'').toLowerCase();
        const sidecar=files.find(candidate=>ext(candidate)==='lrc'&&candidate.name.replace(/\.[^.]+$/,'').toLowerCase()===base);
        if(sidecar)embedded={kind:'lrc',text:await sidecar.text()};
      }
      if(embedded&&embedded.text){lyrics.textContent=embedded.text;lyricsHead.textContent=embedded.kind==='synced'?'SYNCHRONIZED LYRICS / ID3 SYLT':embedded.kind==='lrc'?'LYRICS / LRC SIDECAR':'LYRICS / EMBEDDED METADATA';}
      else {lyrics.textContent='No embedded lyrics or matching .lrc sidecar were found. OmniFile does not search the internet for lyrics.';lyrics.classList.add('lyrics-missing');}
    }catch(_){lyrics.textContent='Could not read embedded lyrics metadata.';lyrics.classList.add('lyrics-missing');}
  }
  async function renderPdf(file,url){
    const frame=document.createElement('iframe');frame.src=url;frame.title='PDF preview';previewContent.append(frame);
    const button=document.createElement('button');button.className='secondary-btn';button.type='button';button.textContent='Render PDF pages as images';button.addEventListener('click',async()=>{button.disabled=true;try{const pdfjs=await libs.pdf();const doc=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;const gallery=document.createElement('div');gallery.className='page-gallery';for(let n=1;n<=doc.numPages;n++){const page=await doc.getPage(n);const viewport=page.getViewport({scale:1.5});const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;const img=document.createElement('img');img.src=canvas.toDataURL('image/png');img.alt='PDF page '+n;const a=document.createElement('a');a.href=img.src;a.download=file.name.replace(/\.pdf$/i,'')+'-page-'+n+'.png';a.textContent='Download page '+n+' as PNG';const card=document.createElement('div');card.append(img,a);gallery.append(card);}previewContent.append(gallery);setStatus('Rendered '+doc.numPages+' PDF page(s). Use each link to save a PNG.');}catch(e){setStatus(e.message||'Could not render this PDF.',true);}finally{button.disabled=false;}});previewContent.append(button);
    const extract=document.createElement('button');extract.className='secondary-btn';extract.type='button';extract.textContent='Extract PDF text';extract.style.marginLeft='8px';extract.addEventListener('click',async()=>{extract.disabled=true;try{const pdfjs=await libs.pdf();const doc=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;let all='';for(let n=1;n<=doc.numPages;n++){const page=await doc.getPage(n);const content=await page.getTextContent();all+='\n--- Page '+n+' ---\n'+content.items.map(x=>x.str).join(' ')+'\n';}const pre=document.createElement('pre');pre.textContent=all;previewContent.append(pre);setStatus('PDF text extracted.');}catch(e){setStatus(e.message||'Could not extract PDF text.',true);}finally{extract.disabled=false;}});previewContent.append(extract);
  }
  async function showPreview(file){
    if(!file)return;clearPreview();previewSection.classList.remove('hidden');previewTitle.textContent=file.name;const url=URL.createObjectURL(file);previewUrl=url;
    const e=ext(file),mime=file.type||'';
    if(mime.startsWith('audio/')||/\.(mp3|wav|ogg|oga|opus|m4a|aac|flac|aiff?|mid|midi)$/i.test(file.name)){await renderAudio(file,url);}
    else if(mime.startsWith('image/')||/\.(png|jpe?g|gif|webp|avif|bmp|svg|ico|tiff?)$/i.test(file.name)){const img=document.createElement('img');img.src=url;img.alt=file.name;img.className='file-preview-image';previewContent.append(img);}
    else if(mime==='application/pdf'||e==='pdf')await renderPdf(file,url);
    else if(/\.(docx)$/i.test(file.name)){const m=document.createElement('p');m.textContent='Loading Word document preview…';previewContent.append(m);try{const mammoth=await libs.mammoth();const result=await mammoth.convertToHtml({arrayBuffer:await file.arrayBuffer()});previewContent.innerHTML='<article class="structured-preview">'+result.value+'</article>';if(result.messages.length)setStatus('Document opened with '+result.messages.length+' conversion note(s).');}catch(err){m.textContent='Could not preview this DOCX file: '+err.message;}}
    else if(/\.(xlsx|xls|ods)$/i.test(file.name)){try{const XLSX=await libs.sheet();const wb=XLSX.read(await file.arrayBuffer(),{type:'array'});const html=XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);const wrap=document.createElement('div');wrap.className='structured-preview';wrap.innerHTML=html;previewContent.append(wrap);const select=document.createElement('select');wb.SheetNames.forEach(n=>{const o=document.createElement('option');o.value=n;o.textContent=n;select.append(o);});select.addEventListener('change',()=>{wrap.innerHTML=XLSX.utils.sheet_to_html(wb.Sheets[select.value]);});previewContent.prepend(select);}catch(err){textPreview('Could not preview spreadsheet: '+err.message);}}
    else if(/\.(zip|cbz|epub)$/i.test(file.name)){try{const JSZip=await libs.zip();const zip=await JSZip.loadAsync(file);const list=document.createElement('div');list.className='archive-list';Object.values(zip.files).filter(x=>!x.dir).forEach(entry=>{const row=document.createElement('div');row.className='file-row';const name=document.createElement('span');name.textContent=entry.name;const download=document.createElement('button');download.className='text-btn';download.textContent='Extract';download.addEventListener('click',async()=>{const blob=await entry.async('blob');downloadBlob(blob,entry.name.split('/').pop()||'extracted-file');});row.append(name,download);list.append(row);});previewContent.append(list);}catch(err){textPreview('Could not open archive: '+err.message);}}
    else if(mime.startsWith('video/')||/\.(mp4|webm|ogv|mov|m4v|mkv|avi|mpeg|mpg|3gp)$/i.test(file.name)){const video=document.createElement('video');video.controls=true;video.src=url;video.className='file-preview-image';previewContent.append(video);const note=document.createElement('p');note.className='conversion-help';note.textContent='Playback depends on browser codec support; this does not transcode the video.';previewContent.append(note);}
    else if(mime.startsWith('text/')||/\.(txt|md|json|js|ts|jsx|tsx|css|html|xml|csv|yml|yaml|log|py|rs|sh|toml|ini|conf|sql|java|c|h|cpp|go|php|rb|swift|kt|vue|svelte|graphql|tex|rtf|ics|vcf|m3u|pls|srt|vtt|ass|ssa)$/i.test(file.name)){
      const raw=await file.text();
      if(e==='json'){try{textPreview(JSON.stringify(JSON.parse(raw),null,2));}catch(_){textPreview(raw);}}
      else if(e==='csv'||e==='tsv'){const rows=raw.split(/\r?\n/).slice(0,500);const table=document.createElement('div');table.className='structured-preview';const t=document.createElement('table');rows.forEach((line,i)=>{const tr=document.createElement('tr');line.split(e==='tsv'?'\t':',').slice(0,30).forEach(cell=>{const td=document.createElement(i===0?'th':'td');td.textContent=cell.replace(/^"|"$/g,'');tr.append(td);});t.append(tr);});table.append(t);previewContent.append(table);}
      else textPreview(raw);
    } else {
      const message=document.createElement('div');message.className='unsupported';message.textContent='No built-in preview for this format. You can still download or convert it when a supported conversion is available.';const a=document.createElement('a');a.href=url;a.download=file.name;a.textContent=' Download original file';message.append(a);previewContent.append(message);
    }
    previewSection.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function downloadBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
  async function loadImage(file){const url=URL.createObjectURL(file);try{const image=new Image();image.src=url;await image.decode();return image;}finally{URL.revokeObjectURL(url);}}
  const CONVERSIONS={
    image:['image/png','image/jpeg','image/webp','application/pdf'],
    pdf:['image/png','image/jpeg','text/plain'],
    text:['application/pdf','text/csv','application/json'],
    json:['text/csv','application/pdf'],
    csv:['application/json','application/pdf','text/csv'],
    docx:['text/html','text/plain']
  };
  function conversionChoices(file){
    const e=ext(file),mime=file.type||'';let opts=[];
    if(mime.startsWith('image/')||/\.(png|jpe?g|gif|webp|avif|bmp|svg|tiff?)$/i.test(file.name))opts=[['image/png','PNG image'],['image/jpeg','JPEG image'],['image/webp','WebP image'],['application/pdf','PDF document']];
    else if(mime==='application/pdf'||e==='pdf')opts=[['image/png','PNG images (one per page)'],['image/jpeg','JPEG images (one per page)'],['text/plain','Extract text (.txt)']];
    else if(e==='json')opts=[['text/csv','CSV spreadsheet'],['application/pdf','PDF document'],['text/plain','Pretty JSON (.json)']];
    else if(e==='csv'||e==='tsv')opts=[['application/json','JSON data'],['application/pdf','PDF document'],['text/csv','CSV']];
    else if(mime.startsWith('text/')||/\.(txt|md|html|xml|log|srt|vtt)$/i.test(file.name))opts=[['application/pdf','PDF document'],['text/plain','Plain text (.txt)'],['text/html','HTML document']];
    else if(e==='docx')opts=[['text/html','HTML document'],['text/plain','Plain text (.txt)']];
    else if(/\.(xlsx|xls|ods)$/i.test(file.name))opts=[['text/csv','CSV (first sheet)'],['application/json','JSON (first sheet)']];
    return opts;
  }
  function updateControls(){
    const file=selectedFile();previewAction.disabled=!file;formatSelect.replaceChildren();
    const choices=file?conversionChoices(file):[];
    choices.forEach(([value,label])=>{const o=document.createElement('option');o.value=value;o.textContent=label;formatSelect.append(o);});
    formatSelect.disabled=!file||!choices.length;convertAction.disabled=!file||!choices.length;
    const help=$('#conversion-help');if(help)help.textContent=choices.length?'Available for this file: '+choices.map(x=>x[1]).join(', '):'No conversion has been configured for this file type yet.';
  }
  async function pdfToImages(file,target){
    const pdfjs=await libs.pdf(),doc=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;
    let zip=null;if(doc.numPages>1)zip=new (await libs.zip())();
    for(let n=1;n<=doc.numPages;n++){
      setStatus('Rendering PDF page '+n+' of '+doc.numPages+'…');const page=await doc.getPage(n);const viewport=page.getViewport({scale:1.6});const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
      const ctx=canvas.getContext('2d',{alpha:target==='image/png'});if(target==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);}
      await page.render({canvasContext:ctx,viewport}).promise;const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not encode PDF page.')),target,.92));
      const extOut=target==='image/jpeg'?'jpg':'png',name=file.name.replace(/\.pdf$/i,'')+'-page-'+String(n).padStart(3,'0')+'.'+extOut;
      if(zip)zip.file(name,blob);else downloadBlob(blob,name);
    }
    if(zip){const blob=await zip.generateAsync({type:'blob'});downloadBlob(blob,file.name.replace(/\.pdf$/i,'')+'-pages.zip');}
  }
  function csvToRows(text){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'&&quoted&&text[i+1]==='"'){cell+='"';i++;}else if(c==='"')quoted=!quoted;else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x!==''))rows.push(row);row=[];cell='';}else cell+=c;}row.push(cell);if(row.some(x=>x!==''))rows.push(row);return rows;}
  function rowsToCsv(rows){return rows.map(row=>row.map(value=>{const s=String(value??'');return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}).join(',')).join('\r\n');}
  async function convertSelected(){
    const file=selectedFile();if(!file)return;const target=formatSelect.value;convertAction.disabled=true;
    try{
      if((file.type==='application/pdf'||ext(file)==='pdf')&&(target==='image/png'||target==='image/jpeg'))await pdfToImages(file,target);
      else if((file.type==='application/pdf'||ext(file)==='pdf')&&target==='text/plain'){const pdfjs=await libs.pdf(),doc=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;let text='';for(let n=1;n<=doc.numPages;n++){const page=await doc.getPage(n),c=await page.getTextContent();text+='\n--- Page '+n+' ---\n'+c.items.map(x=>x.str).join(' ')+'\n';}downloadBlob(new Blob([text],{type:'text/plain;charset=utf-8'}),file.name.replace(/\.pdf$/i,'')+'.txt');}
      else if((file.type.startsWith('image/')||/\.(png|jpe?g|gif|webp|avif|bmp|svg|tiff?)$/i.test(file.name))&&target==='application/pdf'){
        if(!window.jspdf?.jsPDF)throw new Error('PDF export library did not load. Check your connection.');
        const image=await loadImage(file),{jsPDF}=window.jspdf,landscape=image.naturalWidth>image.naturalHeight,pdf=new jsPDF({orientation:landscape?'landscape':'portrait',unit:'pt',format:[image.naturalWidth,image.naturalHeight]});
        const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;canvas.getContext('2d').drawImage(image,0,0);pdf.addImage(canvas.toDataURL('image/jpeg',.94),'JPEG',0,0,image.naturalWidth,image.naturalHeight);pdf.save(file.name.replace(/\.[^.]+$/,'')+'.pdf');
      }
      else if(file.type.startsWith('image/')||/\.(png|jpe?g|gif|webp|avif|bmp|svg|tiff?)$/i.test(file.name)){
        const image=await loadImage(file),canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d',{alpha:target!=='image/jpeg'});if(target==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);}ctx.drawImage(image,0,0);const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Image encoding failed.')),target,.92));downloadBlob(blob,file.name.replace(/\.[^.]+$/,'')+'.'+({'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[target]));
      }
      else if(ext(file)==='json'){
        const parsed=JSON.parse(await file.text());if(target==='text/csv'){if(!Array.isArray(parsed))throw new Error('JSON to CSV requires an array of objects.');const keys=[...new Set(parsed.flatMap(x=>Object.keys(x||{})))];downloadBlob(new Blob([rowsToCsv([keys,...parsed.map(x=>keys.map(k=>x?.[k]&&typeof x[k]==='object'?JSON.stringify(x[k]):x?.[k]??''))])],{type:'text/csv;charset=utf-8'}),file.name.replace(/\.json$/i,'')+'.csv');}
        else if(target==='application/pdf')await textToPdf(JSON.stringify(parsed,null,2),file.name);
        else downloadBlob(new Blob([JSON.stringify(parsed,null,2)],{type:'application/json;charset=utf-8'}),file.name.replace(/\.json$/i,'')+'.json');
      }
      else if(ext(file)==='csv'||ext(file)==='tsv'){
        const raw=await file.text(),rows=ext(file)==='tsv'?raw.split(/\r?\n/).map(x=>x.split('\t')):csvToRows(raw);
        if(target==='application/json'){const headers=rows.shift()||[];const data=rows.map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i]??''])));downloadBlob(new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),file.name.replace(/\.(csv|tsv)$/i,'')+'.json');}
        else if(target==='application/pdf')await textToPdf(rows.map(r=>r.join(' | ')).join('\n'),file.name);
        else downloadBlob(new Blob([rowsToCsv(rows)],{type:'text/csv;charset=utf-8'}),file.name.replace(/\.(csv|tsv)$/i,'')+'.csv');
      }
      else if(/\.(xlsx|xls|ods)$/i.test(file.name)){
        const XLSX=await libs.sheet(),wb=XLSX.read(await file.arrayBuffer(),{type:'array'}),sheet=wb.Sheets[wb.SheetNames[0]];
        if(target==='text/csv')downloadBlob(new Blob([XLSX.utils.sheet_to_csv(sheet)],{type:'text/csv;charset=utf-8'}),file.name.replace(/\.(xlsx|xls|ods)$/i,'')+'.csv');
        else downloadBlob(new Blob([JSON.stringify(XLSX.utils.sheet_to_json(sheet,{defval:''}),null,2)],{type:'application/json;charset=utf-8'}),file.name.replace(/\.(xlsx|xls|ods)$/i,'')+'.json');
      }
      else if(ext(file)==='docx'){
        const mammoth=await libs.mammoth(),res=await mammoth.convertToHtml({arrayBuffer:await file.arrayBuffer()});
        if(target==='text/html')downloadBlob(new Blob([res.value],{type:'text/html;charset=utf-8'}),file.name.replace(/\.docx$/i,'')+'.html');
        else {const doc=document.createElement('div');doc.innerHTML=res.value;downloadBlob(new Blob([doc.innerText],{type:'text/plain;charset=utf-8'}),file.name.replace(/\.docx$/i,'')+'.txt');}
      }
      else {
        const raw=await file.text();
        if(target==='application/pdf')await textToPdf(raw,file.name);
        else if(target==='text/html')downloadBlob(new Blob(['<!doctype html><meta charset="utf-8"><pre>'+escapeHtml(raw)+'</pre>'],{type:'text/html;charset=utf-8'}),file.name.replace(/\.[^.]+$/,'')+'.html');
        else downloadBlob(new Blob([raw],{type:'text/plain;charset=utf-8'}),file.name.replace(/\.[^.]+$/,'')+'.txt');
      }
      setStatus('Conversion finished. If multiple PDF pages were converted, they were bundled into a ZIP archive.');
    }catch(error){setStatus(error.message||'Conversion failed.',true);}
    finally{updateControls();}
  }
  function escapeHtml(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
  async function textToPdf(text,name){
    if(!window.jspdf?.jsPDF)throw new Error('PDF export library did not load. Check your connection.');
    const {jsPDF}=window.jspdf,pdf=new jsPDF({unit:'pt',format:'a4'}),margin=42,width=pdf.internal.pageSize.getWidth()-84,lineHeight=14;
    const lines=pdf.splitTextToSize(text,width);let y=margin;for(const line of lines){if(y>pdf.internal.pageSize.getHeight()-margin){pdf.addPage();y=margin;}pdf.text(line,margin,y);y+=lineHeight;}pdf.save(name.replace(/\.[^.]+$/,'')+'.pdf');
  }
  document.querySelectorAll('.source-tab').forEach(tab=>tab.addEventListener('click',()=>{const local=tab.dataset.source==='local';document.querySelectorAll('.source-tab').forEach(b=>{b.classList.toggle('active',b===tab);b.setAttribute('aria-selected',String(b===tab));});$('#local-source').classList.toggle('hidden',!local);$('#url-source').classList.toggle('hidden',local);}));
  fileInput.addEventListener('change',e=>{addFiles(e.target.files);fileInput.value='';});
  ['dragenter','dragover'].forEach(n=>dropZone.addEventListener(n,e=>{e.preventDefault();dropZone.classList.add('dragover');}));
  ['dragleave','drop'].forEach(n=>dropZone.addEventListener(n,e=>{e.preventDefault();dropZone.classList.remove('dragover');}));
  dropZone.addEventListener('drop',e=>addFiles(e.dataTransfer.files));
  $('#clear-files').addEventListener('click',()=>{files=[];selectedIndex=-1;clearPreview();previewSection.classList.add('hidden');renderFiles();updateControls();setStatus('File list cleared.');});
  previewAction.addEventListener('click',()=>showPreview(selectedFile()).catch(e=>setStatus(e.message,true)));
  convertAction.addEventListener('click',convertSelected);
  $('#close-preview').addEventListener('click',()=>{clearPreview();previewSection.classList.add('hidden');});
  $('#url-form').addEventListener('submit',async e=>{e.preventDefault();const url=$('#url-input').value.trim();setStatus('Fetching file from URL…');try{const res=await fetch(url);if(!res.ok)throw new Error('The URL returned HTTP '+res.status+'.');const blob=await res.blob();const name=decodeURIComponent(new URL(url).pathname.split('/').pop()||'download');addFiles([new File([blob],name,{type:blob.type||''})]);}catch(err){setStatus('Could not fetch this URL. It may block cross-origin requests (CORS), require sign-in, or not be a direct file link. '+err.message,true);}});
  window.addEventListener('beforeunload',clearPreview);ensurePreviewTools();updateControls();
})();