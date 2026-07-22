# The Caviar Reserve — sitio rediseñado

Rediseño completo de thecaviarreserve.com: mismo espíritu de lujo (fondo tinta profunda, acentos dorados, tipografía serif editorial), pero con:

- **9 productos reales** tomados de la ficha técnica de catálogo (Baerii, Osetra, Smoked Osetra, Amur Beluga, Amur Osetra, Persicus Irani, Iranian Beluga, Iranian Beluga 000, Albino Belgian), cada uno con calibre de grano, selección, formatos y nota de cata.
- **Sin precios** en ningún punto del sitio — todo pedido se cotiza vía formulario/correo.
- Animación ambiental de "roe" (huevas) en el hero, hecha en `<canvas>`, ligera y respetando `prefers-reduced-motion`.
- Totalmente responsive, sin frameworks — HTML + CSS + JS puro. Cero dependencias de build.

## Estructura

```
.
├── index.html
├── css/style.css
├── js/script.js
├── images/            # 9 fotografías de producto (recortadas de las fichas)
├── render.yaml         # despliegue como sitio estático en Render
└── README.md
```

## Ver en local

No requiere instalación. Basta abrir `index.html` en el navegador, o servirlo con cualquier servidor estático:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Subir a GitHub

```bash
cd the-caviar-reserve
git init
git add .
git commit -m "Rediseño: catálogo de 9 variedades, sin precios, nueva identidad visual"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/the-caviar-reserve.git
git push -u origin main
```

(Sustituye `TU_USUARIO` por tu usuario o el de tu organización en GitHub. Si el repo aún no existe, créalo antes desde github.com/new, vacío, sin README ni licencia.)

## Desplegar en Render

**Opción A — con `render.yaml` (recomendado, ya incluido):**
1. Entra a [render.com](https://render.com) → **New** → **Blueprint**.
2. Conecta el repo de GitHub que acabas de crear.
3. Render detecta `render.yaml` automáticamente y crea un **Static Site** llamado `the-caviar-reserve`. Confirma y despliega.

**Opción B — manual:**
1. **New** → **Static Site**.
2. Conecta el repositorio.
3. Build Command: (déjalo vacío)
4. Publish directory: `.`
5. Deploy.

Una vez desplegado, Render te da una URL tipo `https://the-caviar-reserve.onrender.com`. Puedes conectar tu dominio propio (`thecaviarreserve.com`) desde **Settings → Custom Domain**.

## Personalizar

- **Textos de contacto** (correo, teléfono, dirección): en `index.html`, sección `#contacto`.
- **Colores**: variables en la parte superior de `css/style.css` (`:root`).
- **Añadir/quitar producto**: duplica un bloque `<article class="product-card">…</article>` dentro de `#coleccion` en `index.html` y su imagen correspondiente en `images/`.
- El formulario de contacto abre el cliente de correo del usuario con los datos precargados (`mailto:`). Si prefieres un backend real (Formspree, Resend, etc.), sustituye el listener en `js/script.js`.
