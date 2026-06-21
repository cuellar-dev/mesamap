# MesaMap 🍽️

A lightweight, fast and minimalist **interactive map** to discover where to eat and drink in Sancti Spíritus (Cuba): restaurants, bars, cafeterias, pizzerias and ice‑cream shops.

> 🔗 **Live demo:** https://cuellar-dev.github.io/mesamap/
> 📱 **Mobile‑first** — built and best experienced on a phone.

> ℹ️ **About this project:** a **personal learning project** where I practiced integrating interactive maps, working with structured data and mobile‑first design. It's intentionally a sandbox for experimenting and improving.

## Features

- 🗺️ **Interactive map** built with **MapLibre GL JS**, with custom color‑coded markers per type of venue.
- 🏷️ **Category legend & filtering**: restaurants, bars, cafeterias, pizzerias, ice‑cream shops.
- 📋 **Detail panel** for each place: description, address, price range, opening hours, amenities and an **image gallery**.
- 🕒 **Open/closed awareness** based on each venue's opening and closing hours.
- 💲 **Price guidance** (categories `$`, `$$`, `$$$`) with a short price analysis per place.
- 📱 **Responsive, mobile‑first** design with a hamburger menu and a dark theme.
- 📝 **"Suggest a business"** section so owners/users can request new places.
- 📈 Integrated **Google Analytics** to track usage.
- 🔎 **SEO & social ready**: meta description, Open Graph tags and a custom theme color.

## Tech stack

- HTML5
- CSS3 (custom, dark theme, responsive)
- JavaScript (vanilla, no framework)
- [MapLibre GL JS](https://maplibre.org/) for the interactive map
- Google Analytics (gtag.js)

## Data

All venues live in `lugares.json`. Each entry looks like this:

```json
{
  "id": 1,
  "nombre": "El Cuervo",
  "tipo": "Bar-Cafeteria",
  "tipoReal": "cafeteria",
  "descripcion": "…",
  "direccion": "Calle Máximo Gómez #15…",
  "coordenadas": [-79.44189, 21.92618],
  "precios": { "categoria": "$", "rango": "150 - 1500", "moneda": "CUP" },
  "horario": { "normal": "5:00PM-12:00AM", "abre": 17, "cierra": 24 },
  "amenidades": ["Aire Acondicionado", "Música", "Domicilio"],
  "imagen": "Imagenes/cuervo/portada.jpg",
  "imagenes": ["Imagenes/cuervo/1.jpg", "Imagenes/cuervo/2.jpg"]
}
```

`coordenadas` use `[longitude, latitude]` (MapLibre order).

## Run it locally

Static site — no build step required:

```bash
python -m http.server 5500
# then open http://localhost:5500
```

Or use the **Live Server** extension in VS Code.

## Add a new place

1. Open `lugares.json`.
2. Copy an existing object and update its fields (name, type, coordinates, prices, hours, images…).
3. Drop the photos in the matching `Imagenes/` subfolder.
4. Check that the JSON stays valid.

## Deploy

Host it for free on **GitHub Pages**, **Netlify**, **Vercel** or **Cloudflare Pages**. Remember to update the Open Graph `og:url` / `og:image` with your real domain.

## Author

**Luis Ernesto Cuellar del Castillo** — [@cuellar-dev](https://github.com/cuellar-dev)
