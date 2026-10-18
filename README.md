

# CorrectPen


**CorrectPen** es una extensión ligera y rápida para navegadores basados en Chromium (Chrome, Edge, Brave, Opera) que actúa como un autocorrector inteligente. Soporta **Español (ES)**, **Inglés (EN)** y **Portugués (PT)**.


A diferencia de otras extensiones, CorrectPen funciona **100% de forma local**. No envía tus datos a ningún servidor externo, no requiere conexión a internet y no necesita instalar dependencias ni usar herramientas de compilación (como `npm` o Webpack).


## Características


- **Multilingüe:** Soporte nativo para Español, Inglés y Portugués.
- **Privacidad total:** Todo el procesamiento de texto ocurre en tu navegador. Nada se sube a la nube.
- **Cero dependencias:** Escrito en Vanilla JavaScript (JS puro). No requiere `package. Json` ni `node_modules`.
- **Corrección en dos capas:**
 - **Diccionario:** Corrige errores comunes y palabras mal escritas (ej. *haya* → *haya*, *recieve* → *receive*).
 - **Heurísticas:** Corrige automáticamente espacios dobles, falta de espacios tras comas/puntos y mayúsculas al inicio de frase.
- **Sin iconos innecesarios:** Utiliza el icono genérico del navegador, manteniendo el proyecto libre de archivos binarios.


## 📂 Estructura del Proyecto


```text
correctpen/
├── _locales/ # Traducciones de la interfaz (ES, EN, PT)
│ ├── en/messages. Json
│ ├── es/messages. Json
│ └── pt/messages. Json
├── background. Js # Service Worker (Motor de corrección)
├── content. Js # Script que detecta y corrige los textos en las webs
├── manifest. Json # Configuración de la extensión (Manifest V3)
├── popup. Html # Interfaz gráfica del menú
└── popup. Js # Lógica del menú (guardar idioma, activar/desactivar)
```


### Añadir nuevas palabras al diccionario
































































Si quieres que la extensión corrija tus propios errores frecuentes o jerga de internet, abre el archivo background. Js y edita el objeto COMMON_MISTAKES
