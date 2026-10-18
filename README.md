# CorrectPen

CorrectPen es un autocorrector random mas que incluye triplellingue, privacidad total (No se envian tus datos al pentagono ni a un servidor), y correcion de dos capas: 

**Diccionario:** Corrige errores comunes y palabras mal escritas (ej. *haya* → *haya*, *recieve* → *receive*). 


**Heurísticas:** Corrige automáticamente espacios dobles, falta de espacios tras comas/puntos y mayúsculas al inicio de frase.

## Instalacion

- Descarga o clona este repositorio en tu ordenador.

- Abre tu navegador (Chrome, Edge, Brave, etc.).

- Ve a la página de extensiones:

Chrome: chrome://extensions

Edge: edge://extensions

- Activa el Modo de Desarrollador (interruptor en la esquina superior derecha).

- Haz clic en el botón Cargar descomprimida (Load unpacked).

- Selecciona la carpeta correctpen que descargaste.

- ¡Listo! Fija la extensión (icono de rompecabezas) en tu barra de herramientas para acceder fácilmente.

## Modificar el proyecto XDXD


### Añadir nuevas palabras al diccionario


Si quieres que la extensión corrija tus propios errores frecuentes o jerga de internet, abre el archivo background. Js y edita el objeto COMMON_MISTAKES 


```javascript
const COMMON_MISTAKES = {
 es: {
 'haya': 'haya',
 'xq': 'porque', // Añade tus propias reglas aquí
 'salu2': 'saludos'
 },
 //...
};
```


Eso si ve otra vez a la pagina de extensiones y recarga la extension


### Cambiar la velocidad de corrección


Por defecto, el corrector espera 1.2 segundos después de que dejas de teclear. Si lo prefieres más rápido o más lento, edita esta línea en el archivo content. Js:


```javascript
const DEBOUNCE_MS = 1200; // Cambia este valor (en milisegundos)
```

## limitaciones

Algunos editores de texto muy avanzados (como los de redes sociales o herramientas como WhatsApp Web) bloquean la modificación de sus cajas de texto por seguridad. La extensión funciona mejor en inputs estándar, barras de búsqueda y foros, pero, mira al lado bueno, al menos tienes un auto corrector extra

## Licencia

Este proyecto esta bajo la licencia MIT
