# OmniFile

**Un visor y conversor de archivos basado en el navegador, disponible tanto en GitHub Pages como en local.**

OmniFile reúne en una sola web la vista previa de archivos habituales y algunas conversiones sencillas. La interfaz permite elegir entre **español e inglés**; la preferencia se guarda en el navegador.

[English README](README.md) · [Abrir OmniFile en GitHub Pages](https://ericsnet.github.io/OmniFile/)

## Funciones actuales

- Abrir uno o varios archivos del dispositivo mediante el selector de archivos o arrastrar y soltar.
- Previsualizar imágenes, PDF, audio, vídeo y formatos comunes de texto/código compatibles con el navegador.
- Importar archivos desde una URL directa si el servidor remoto permite el acceso entre orígenes (CORS).
- Convertir imágenes a PNG, JPEG o WebP mediante Canvas del navegador.
- Exportar una imagen como PDF usando jsPDF cargado desde una CDN.
- Procesar los archivos seleccionados en el navegador; OmniFile no los sube a un servidor propio.
- Usar la misma interfaz en GitHub Pages o servirla desde tu propio equipo.
- Cambiar el idioma de la interfaz entre español e inglés desde el selector superior.

## Usar la versión publicada (GitHub Pages)

1. Abre [OmniFile](https://ericsnet.github.io/OmniFile/).
2. En el selector de idioma de la parte superior, elige **Español** o **English**.
3. Abre archivos locales o importa una URL directa.

La versión de Pages no necesita instalación. Para importar URL, el servidor remoto debe permitir CORS.

## Ejecutar en local

**Requisito:** Python 3.9 o posterior. Solo se usa la biblioteca estándar de Python; no hace falta instalar paquetes con `pip` ni instalar Node.js.

### Windows

1. Descarga el repositorio con **Code → Download ZIP** y descomprime el archivo, o clónalo con Git.
2. Abre la carpeta `OmniFile`.
3. Haz doble clic en `start-local.bat`.
4. Se abrirá el navegador. Si no se abre automáticamente, visita la dirección que aparece en la terminal.
5. Mantén abierta la terminal mientras uses OmniFile. Pulsa `Ctrl+C` para detener el servidor.

### Linux / macOS

1. Descarga o clona el repositorio y abre una terminal en la carpeta `OmniFile`.
2. Ejecuta:

   ```bash
   chmod +x start-local.sh
   ./start-local.sh
   ```

3. Se abrirá el navegador. Si no ocurre, utiliza la dirección que muestra la terminal.
4. Pulsa `Ctrl+C` para detener el servidor.

### Método manual

También puedes ejecutar:

```bash
python run_local.py
```

El servidor escucha únicamente en `127.0.0.1` (tu propio equipo), elige un puerto disponible e intenta abrir el navegador automáticamente. Como alternativa, puedes ejecutar `python -m http.server 8000` y abrir <http://localhost:8000>.

La interfaz y el selector de idioma son los mismos en Pages y en local. La preferencia se guarda en el almacenamiento local del navegador; si este está bloqueado, la selección seguirá funcionando durante la sesión.

## Compatibilidad de formatos

| Función | Compatibilidad actual |
| --- | --- |
| Vista previa de imágenes | Formatos compatibles con el navegador, normalmente PNG, JPEG, GIF, WebP, SVG y AVIF (según el navegador) |
| Conversión de imágenes | PNG, JPEG y WebP; depende de los codificadores del navegador |
| Imagen a PDF | Sí, mediante jsPDF; la imagen se coloca en una página PDF |
| Vista previa de PDF | Requiere compatibilidad con el visor PDF del navegador |
| Texto y código fuente | Formatos comunes de texto, marcado, configuración y código; vista previa limitada a 1 MB de texto |
| Audio y vídeo | Solo contenedores y códecs compatibles con el navegador |
| MP4 a MP3 | **No implementado** en la versión web actual |
| Documentos Office, archivos comprimidos, CAD, 3D y formatos propietarios | **Sin compatibilidad universal**; hacen falta bibliotecas específicas o herramientas externas locales |

«Universal» es el objetivo del proyecto, no una afirmación de que ya pueda abrir cualquier formato. La extensión del archivo por sí sola no garantiza que pueda decodificarse.

## Privacidad y límites

- Los archivos seleccionados permanecen en el navegador y no se envían a un backend de OmniFile.
- La importación por URL usa `fetch()`; el servidor remoto debe permitir CORS. Una página web normal no siempre es un enlace directo a un archivo.
- jsPDF y Google Fonts se cargan desde servicios externos. La conversión a PDF puede fallar si la CDN no está disponible.
- Los archivos o imágenes muy grandes pueden superar los límites de memoria del navegador.
- El navegador exige que selecciones los archivos; OmniFile no puede leer rutas arbitrarias del disco.
- Ejecutar OmniFile en local significa servir la interfaz web desde tu equipo. **Todavía no incluye un backend local de FFmpeg** ni conversiones avanzadas como MP4 a MP3, documentos Office o archivos comprimidos.

## Próximos pasos

- [ ] Servicio local opcional de conversión con comprobaciones de compatibilidad
- [ ] Conversión de audio y vídeo con FFmpeg (incluido MP4 a MP3 cuando estén disponibles los códecs necesarios)
- [ ] Más formatos de documentos y archivos comprimidos
- [ ] Cola de conversiones, progreso, cancelación y descargas por lotes
- [ ] Pruebas de detección de formatos y errores de conversión

## Desarrollo

El proyecto utiliza HTML, CSS y JavaScript sin proceso de compilación, más un lanzador local basado en la biblioteca estándar de Python. La interfaz se comparte entre GitHub Pages y la ejecución local.

## Licencia

El repositorio aún no tiene una licencia. Que sea público no concede automáticamente permiso para reutilizar, modificar o redistribuir el código.
