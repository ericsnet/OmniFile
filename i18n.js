(() => {
  const exact = {
    'Files stay in your browser':'Los archivos permanecen en tu navegador',
    'YOUR FILES, YOUR WORKFLOW':'TUS ARCHIVOS, TU FLUJO DE TRABAJO',
    'Every file has':'Cada archivo',
    'a place here.':'tiene su lugar.',
    'Preview files from your device or a URL, and convert common formats without uploading your files to a conversion server.':'Previsualiza archivos de tu dispositivo o desde una URL y convierte formatos habituales sin subirlos a un servidor de conversión.',
    'Private by design':'Privacidad por diseño',
    'Browser-powered':'Procesado en el navegador',
    'No account needed':'Sin cuenta',
    'WORKSPACE / 01':'ESPACIO DE TRABAJO / 01',
    'Open a file':'Abrir un archivo',
    'LOCAL OR ONLINE':'LOCAL O EN LÍNEA',
    'File source':'Origen del archivo',
    'From device':'Desde el dispositivo',
    'From URL':'Desde una URL',
    'Drop files to get started':'Suelta archivos para empezar',
    'or':'o',
    'browse your device':'explora tu dispositivo',
    'Files are processed locally where supported':'Los archivos se procesan localmente cuando es compatible',
    'Direct file URL':'URL directa del archivo',
    'Open URL':'Abrir URL',
    'The server must allow browser access (CORS). Some URLs require authentication or cannot be previewed.':'El servidor debe permitir el acceso desde el navegador (CORS). Algunas URL requieren autenticación o no se pueden previsualizar.',
    'SELECTED FILES':'ARCHIVOS SELECCIONADOS',
    'Clear all':'Borrar todo',
    'TOOL / 02':'HERRAMIENTA / 02',
    'File preview':'Vista previa',
    'Inspect supported images, PDFs, text, audio, video, and code in one workspace.':'Examina imágenes, PDF, texto, audio, vídeo y código compatibles en un mismo espacio.',
    'Preview selected file':'Previsualizar archivo seleccionado',
    'TOOL / 03':'HERRAMIENTA / 03',
    'Quick convert':'Conversión rápida',
    'Convert images between common formats or turn an image into a PDF.':'Convierte imágenes entre formatos habituales o transforma una imagen en PDF.',
    'OUTPUT FORMAT':'FORMATO DE SALIDA',
    'Convert':'Convertir',
    'Image conversion is browser-based. PDF export uses a small external library loaded from a CDN.':'La conversión de imágenes se realiza en el navegador. La exportación a PDF utiliza una biblioteca externa cargada desde una CDN.',
    'INSPECT / 04':'INSPECCIÓN / 04',
    'Preview':'Vista previa',
    'Close preview ×':'Cerrar vista previa ×',
    'Close preview':'Cerrar vista previa',
    'Close preview ×':'Cerrar vista previa ×',
    'BUILT FOR EVERYDAY FILES':'DISEÑADO PARA ARCHIVOS DEL DÍA A DÍA',
    'Simple tools.':'Herramientas sencillas.',
    'Clear limits.':'Límites claros.',
    'Browser-first privacy':'Privacidad desde el navegador',
    'Selected files are not sent to OmniFile servers. URL imports are fetched directly by your browser.':'Los archivos seleccionados no se envían a servidores de OmniFile. Las URL se solicitan directamente desde tu navegador.',
    'Honest format support':'Compatibilidad transparente',
    'Preview and conversion depend on the browser, the source format, and any available libraries.':'La vista previa y la conversión dependen del navegador, del formato de origen y de las bibliotecas disponibles.',
    'Local tools can go further':'El modo local puede ampliarse',
    'For advanced media conversions, use the optional local Python service and install the required system tools.':'Para conversiones multimedia avanzadas, se puede añadir un servicio local de Python e instalar las herramientas de sistema necesarias.',
    'Useful file tools, without the mystery.':'Herramientas útiles para tus archivos, sin misterios.',
    'Open source project ↗':'Proyecto en GitHub ↗',
    'Unknown MIME type':'Tipo MIME desconocido',
    'No built-in preview for this format. The file is available to download from your device; advanced support may require a local tool.':'No hay vista previa integrada para este formato. El archivo sigue disponible en tu dispositivo; la compatibilidad avanzada puede requerir una herramienta local.',
    '[Preview truncated at 1 MB of text]':'[Vista previa limitada a 1 MB de texto]',
    'PDF preview':'Vista previa del PDF',
    'Available conversions depend on the selected file. Some tools load from a CDN.':'Las conversiones disponibles dependen del archivo seleccionado. Algunas herramientas se cargan desde una CDN.',
    'No conversion has been configured for this file type yet.':'Todavía no hay ninguna conversión configurada para este tipo de archivo.',
    'PNG image':'Imagen PNG','JPEG image':'Imagen JPEG','WebP image':'Imagen WebP','PDF document':'Documento PDF',
    'PNG images (one per page)':'Imágenes PNG (una por página)','JPEG images (one per page)':'Imágenes JPEG (una por página)',
    'Extract text (.txt)':'Extraer texto (.txt)','CSV spreadsheet':'Hoja de cálculo CSV','JSON data':'Datos JSON','Pretty JSON (.json)':'JSON formateado (.json)',
    'Plain text (.txt)':'Texto sin formato (.txt)','HTML document':'Documento HTML','CSV (first sheet)':'CSV (primera hoja)','JSON (first sheet)':'JSON (primera hoja)',
    'Render PDF pages as images':'Convertir páginas PDF en imágenes','Extract PDF text':'Extraer texto del PDF','Download page ':'Descargar página ',' as PNG':' como PNG',
    'LYRICS / EMBEDDED METADATA':'LETRA / METADATOS INTEGRADOS','Looking for embedded lyrics…':'Buscando letras integradas…',
    'No embedded lyrics were found in this file. OmniFile does not search the internet for lyrics.':'No se han encontrado letras integradas en este archivo. OmniFile no busca letras en Internet.',
    'Could not read embedded lyrics metadata.':'No se han podido leer los metadatos de las letras.',
    'SYNCHRONIZED LYRICS / ID3 SYLT':'LETRA SINCRONIZADA / ID3 SYLT','LYRICS / ID3 USLT':'LETRA / ID3 USLT',
    'Playback depends on browser codec support; this does not transcode the video.':'La reproducción depende de los códecs compatibles con el navegador; esto no convierte el vídeo.',
    'Loading Word document preview…':'Cargando la vista previa del documento Word…',
    'Could not preview this DOCX file: ':'No se ha podido previsualizar este DOCX: ',
    'Extract':'Extraer','Could not open archive: ':'No se ha podido abrir el archivo comprimido: ',
    'No built-in preview for this format. You can still download or convert it when a supported conversion is available.':'No hay vista previa integrada para este formato. Puedes descargarlo o convertirlo si existe una conversión compatible.',
    'Added ':'Añadidos ',' file(s). Select one to preview or convert.':' archivo(s). Selecciona uno para previsualizarlo o convertirlo.',
    'Selected ':'Seleccionado: ','Converting ':'Convirtiendo ','Rendering PDF page ':'Procesando página PDF ',' of ':' de ',
    'Rendered ':'Procesadas ',' PDF page(s). Use each link to save a PNG.':' página(s) del PDF. Usa cada enlace para guardar un PNG.',
    'PDF text extracted.':'Texto del PDF extraído.','Could not render this PDF.':'No se ha podido procesar este PDF.',
    'Could not extract PDF text.':'No se ha podido extraer el texto del PDF.','Could not encode PDF page.':'No se ha podido codificar la página del PDF.',
    'Image encoding failed.':'Ha fallado la codificación de la imagen.','JSON to CSV requires an array of objects.':'Para convertir JSON a CSV se necesita un array de objetos.',
    'Conversion finished. If multiple PDF pages were converted, they were bundled into a ZIP archive.':'Conversión terminada. Si se han convertido varias páginas PDF, se han agrupado en un ZIP.',
    'PDF export library did not load. Check your connection.':'No se ha cargado la biblioteca de exportación PDF. Comprueba tu conexión.',
    'Could not load conversion library. Check your internet connection.':'No se ha podido cargar la biblioteca de conversión. Comprueba tu conexión a Internet.',
    'Could not load conversion library.':'No se ha podido cargar la biblioteca de conversión.',
    'Library failed to initialize.':'No se ha podido iniciar la biblioteca.',
    'No embedded lyrics were found in this file. OmniFile does not search the internet for lyrics.':'No se han encontrado letras integradas en este archivo. OmniFile no busca letras en Internet.',
    'Could not preview spreadsheet: ':'No se ha podido previsualizar la hoja de cálculo: ','Could not preview archive: ':'No se ha podido previsualizar el archivo comprimido: '
  };
  const attrs = {
    'OmniFile home':'Inicio de OmniFile',
    'File workspace':'Espacio de archivos',
    'File source':'Origen del archivo',
    'https://example.com/file.pdf':'https://ejemplo.com/archivo.pdf'
  };
  const translateText = (raw) => {
    const lead = (raw.match(/^\s*/) || [''])[0];
    const trail = (raw.match(/\s*$/) || [''])[0];
    const core = raw.slice(lead.length, raw.length - trail.length);
    if (exact[core]) return lead + exact[core] + trail;
    let m;
    if ((m = core.match(/^(\d+) file\(s\) added\. Select one to preview or convert\.$/))) return lead + 'Se han añadido ' + m[1] + ' archivo(s). Selecciona uno para previsualizarlo o convertirlo.' + trail;
    if ((m = core.match(/^Added (\\d+) file\\(s\\)\\. Select one to preview or convert\\.$/))) return lead + 'Se han añadido ' + m[1] + ' archivo(s). Selecciona uno para previsualizarlo o convertirlo.' + trail;
    if ((m = core.match(/^Rendering PDF page (\\d+) of (\\d+)…$/))) return lead + 'Procesando página PDF ' + m[1] + ' de ' + m[2] + '…' + trail;
    if ((m = core.match(/^Rendered (\\d+) PDF page\\(s\\)\\. Use each link to save a PNG\\.$/))) return lead + 'Procesadas ' + m[1] + ' página(s) del PDF. Usa cada enlace para guardar un PNG.' + trail;
    if (core.startsWith('Could not preview this DOCX file: ')) return lead + 'No se ha podido previsualizar este DOCX: ' + core.slice(33) + trail;
    if (core.startsWith('Could not preview spreadsheet: ')) return lead + 'No se ha podido previsualizar la hoja de cálculo: ' + core.slice(29) + trail;
    if (core.startsWith('Could not open archive: ')) return lead + 'No se ha podido abrir el archivo comprimido: ' + core.slice(22) + trail;
    if (core.startsWith('Could not preview archive: ')) return lead + 'No se ha podido previsualizar el archivo comprimido: ' + core.slice(26) + trail;
    if (core.startsWith('Could not extract PDF text')) return lead + 'No se ha podido extraer el texto del PDF.' + trail;
    if (core.startsWith('Could not render this PDF')) return lead + 'No se ha podido procesar este PDF.' + trail;
    if (core.startsWith('Could not encode PDF page')) return lead + 'No se ha podido codificar la página del PDF.' + trail;
    if (core.startsWith('Image encoding failed')) return lead + 'Ha fallado la codificación de la imagen.' + trail;
    if (core.startsWith('Could not load conversion library')) return lead + 'No se ha podido cargar la biblioteca de conversión. Comprueba tu conexión a Internet.' + trail;
    if (core.startsWith('Conversion finished. If multiple PDF pages were converted')) return lead + 'Conversión terminada. Si se han convertido varias páginas PDF, se han agrupado en un ZIP.' + trail;
    if ((m = core.match(/^Selected (.+)$/))) return lead + 'Seleccionado: ' + m[1] + trail;
    if ((m = core.match(/^Converting (.+)…$/))) return lead + 'Convirtiendo ' + m[1] + '…' + trail;
    if ((m = core.match(/^The URL returned HTTP (\d+)\.$/))) return lead + 'La URL ha devuelto el código HTTP ' + m[1] + '.' + trail;
    if (core === 'File list cleared.') return lead + 'Se ha vaciado la lista de archivos.' + trail;
    if (core === 'Conversion finished. Your file was created in the browser.') return lead + 'Conversión terminada. El archivo se ha creado en el navegador.' + trail;
    if (core === 'Conversion failed.') return lead + 'La conversión ha fallado.' + trail;
    if (core === 'Fetching file from URL…') return lead + 'Obteniendo el archivo desde la URL…' + trail;
    if (core === 'PDF export library did not load. Check your internet connection and reload the page.') return lead + 'No se ha cargado la biblioteca de exportación a PDF. Comprueba la conexión a Internet y recarga la página.' + trail;
    if (core === 'This image could not be encoded in the selected format.') return lead + 'No se ha podido codificar la imagen en el formato seleccionado.' + trail;
    if (core.startsWith('Could not fetch this URL. It may block cross-origin requests (CORS), require sign-in, or not be a direct file link. ')) return lead + 'No se ha podido obtener esta URL. Puede bloquear solicitudes de otros orígenes (CORS), requerir inicio de sesión o no ser un enlace directo al archivo. ' + core.slice('Could not fetch this URL. It may block cross-origin requests (CORS), require sign-in, or not be a direct file link. '.length) + trail;
    return raw;
  };
  let language = 'en';
  try {
    const saved = localStorage.getItem('omnifile-language');
    if (saved === 'es' || saved === 'en') language = saved;
    else if ((navigator.language || '').toLowerCase().startsWith('es')) language = 'es';
  } catch (_) {
    if ((navigator.language || '').toLowerCase().startsWith('es')) language = 'es';
  }
  const originals = new WeakMap();
  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!originals.has(node)) originals.set(node, node.nodeValue);
      const original = originals.get(node);
      const translated = language === 'es' ? translateText(original) : original;
      if (node.nodeValue !== translated) node.nodeValue = translated;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.matches('input#url-input')) node.placeholder = language === 'es' ? 'https://ejemplo.com/archivo.pdf' : 'https://example.com/file.pdf';
      if (node.matches('#language-select')) node.setAttribute('aria-label', language === 'es' ? 'Idioma' : 'Language');
      if (node.matches('.brand')) node.setAttribute('aria-label', language === 'es' ? 'Inicio de OmniFile' : 'OmniFile home');
      if (node.matches('.workspace')) node.setAttribute('aria-label', language === 'es' ? 'Espacio de archivos' : 'File workspace');
      if (node.matches('.source-tabs')) node.setAttribute('aria-label', language === 'es' ? 'Origen del archivo' : 'File source');
      if (node.matches('iframe')) node.title = language === 'es' ? 'Vista previa del PDF' : 'PDF preview';
      if (node.matches('select#format-select')) {
        const opts = node.options;
        for (const opt of opts) {
          if (!opt.dataset.originalText) opt.dataset.originalText = opt.textContent;
          opt.textContent = opt.dataset.originalText;
        }
      }
      for (const child of node.childNodes) translateNode(child);
    }
  }
  function apply(next) {
    language = next === 'es' ? 'es' : 'en';
    document.documentElement.lang = language;
    document.title = language === 'es' ? 'OmniFile — Herramientas para archivos en un solo lugar' : 'OmniFile — File tools, in one place';
    const selector = document.getElementById('language-select');
    if (selector) selector.value = language;
    translateNode(document.body);
    try { localStorage.setItem('omnifile-language', language); } catch (_) {}
  }
  document.addEventListener('DOMContentLoaded', () => {
    const topActions = document.querySelector('.top-actions');
    if (topActions && !document.getElementById('language-select')) {
      const label = document.createElement('label');
      label.className = 'language-control';
      label.innerHTML = '<span class="sr-only">Language</span><select id="language-select" aria-label="Language"><option value="en">English</option><option value="es">Español</option></select>';
      topActions.prepend(label);
    }
    const selector = document.getElementById('language-select');
    if (selector) selector.addEventListener('change', () => apply(selector.value));
    apply(language);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'childList') record.addedNodes.forEach(translateNode);
        else if (record.type === 'characterData') {
          const node = record.target;
          if (!originals.has(node)) originals.set(node, node.nodeValue);
          const original = originals.get(node);
          const translated = language === 'es' ? translateText(original) : original;
          if (node.nodeValue !== translated) node.nodeValue = translated;
        }
      }
    });
    observer.observe(document.body, {subtree:true, childList:true, characterData:true});
  });
})();