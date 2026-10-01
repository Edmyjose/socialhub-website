# HubSocial AI — Landing Page Multi-idioma (GitHub Pages)

Landing page estática y ultra-optimizada para la aplicación **HubSocial AI**, diseñada con estética glassmorphism en modo oscuro, micro-interacciones, tipografía moderna (Outfit & Inter), diseño responsive y arquitectura multi-idioma con diccionario centralizado en un solo archivo.

---

## 🌐 Gestión de Idiomas en 1 Solo Archivo

Todos los textos, titulares, botones, descripciones de plataformas, preguntas frecuentes y metadatos residen en **[`translations.js`](translations.js)**.

### Idiomas Soportados:
- 🇺🇸 **Inglés (`en`)** — Predeterminado
- 🇪🇸 **Español (`es`)**
- 🇧🇷 **Português (`pt`)**

### ¿Cómo editar o corregir un texto?
1. Abre [`translations.js`](translations.js) en cualquier editor de código o texto.
2. Localiza la clave correspondiente (por ejemplo: `hero.title_part1` o `pricing.plan_pro_price`).
3. Guarda el archivo. ¡Los cambios se reflejan inmediatamente al recargar la página!

### ¿Cómo agregar un nuevo idioma?
1. En [`translations.js`](translations.js), añade una nueva clave en `window.TRANSLATIONS` (ej. `fr: { ... }`).
2. En [`index.html`](index.html), dentro del contenedor `#langDropdown`, agrega la opción:
   ```html
   <button class="lang-option" data-lang="fr">
     <span>🇫🇷</span> Français
   </button>
   ```
3. En [`app.js`](app.js), registra la clave en `LANG_CONFIG`:
   ```javascript
   fr: { code: 'fr', label: 'Français', flag: '🇫🇷' }
   ```

---

## 📁 Estructura del Proyecto

```text
D:\GitHub\socialhub\
├── index.html          # Estructura semántica, SEO, Schema.org y marcado data-i18n
├── translations.js     # DICCIONARIO ÚNICO con todas las traducciones (ES, EN, PT)
├── styles.css          # Sistema de diseño Vanilla CSS (Glassmorphism, Dark Mode, Glows)
├── app.js              # Motor i18n, sticky navbar, acordeón FAQ y menú móvil
├── CNAME               # Dominio personalizado: socialhub.ejsstudios.com
├── robots.txt          # Directivas para rastreadores de búsqueda
├── sitemap.xml         # Mapa del sitio con enlaces alternativos hreflang
├── README.md           # Esta guía de uso y despliegue
└── images/             # Iconos y capturas oficiales de la app
    ├── logo.webp
    ├── screen-agency.png
    ├── screen-hub.png
    └── screen-dashboard.png
```

---

## 🚀 Despliegue en GitHub Pages

### 1. Inicializar repositorio Git y subir a GitHub:
```bash
cd D:\GitHub\socialhub
git init
git add .
git commit -m "feat: Initial commit of HubSocial AI multi-language landing page"
git branch -M main
git remote add origin https://github.com/Edmyjose/socialhub-landing.git
git push -u origin main
```

*(Nota: puedes usar `socialhub-landing` o el nombre de repositorio que prefieras).*

### 2. Habilitar GitHub Pages:
1. Ve a la pestaña **Settings** de tu repositorio en GitHub.
2. Navega a **Pages** (en el menú lateral izquierdo).
3. En **Build and deployment > Source**, selecciona `Deploy from a branch`.
4. Elige rama `main` y carpeta `/ (root)`.
5. Haz clic en **Save**.
6. En **Custom domain**, confirma que detecte `socialhub.ejsstudios.com` y marca **Enforce HTTPS**.

### 3. Configuración DNS en tu proveedor de dominio:
Agrega un registro `CNAME` en tu proveedor DNS (Cloudflare / Namecheap / GoDaddy / etc.):
- **Tipo**: `CNAME`
- **Nombre (Host)**: `socialhub`
- **Valor / Destino**: `edmyjose.github.io` (o el CNAME raíz de tu GitHub Pages)

---

## 💻 Prueba Local

Puedes abrir directamente el archivo `index.html` en cualquier navegador web moderno con doble clic:
```text
file:///D:/GitHub/socialhub/index.html
```
No requiere ningún servidor web, Node.js ni herramientas de compilación para funcionar o alternar entre idiomas.


## Campaign Attribution and Events

The landing page captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`, `gclid`, `gbraid`, `wbraid`, and `fbclid` for the current session. It queues these events in `window.dataLayer` so a Google Tag Manager container can consume them after one is configured:

- `landing_view`
- `hero_cta_click` and `how_it_works_click`
- `pricing_view` and `pricing_plan_click`
- `download_google_play_click` and `contact_support_click`

No analytics provider or tracking tag is loaded by default. Until you add and configure a Tag Manager container, these events remain in the page and are not sent to an analytics service. Install conversion tracking for store installs and paid subscriptions separately in the relevant app stores and application billing flows.
