# [https://lukasrozado.pages.dev/](https://lukasrozado.pages.dev/)

Personal portfolio and technical writing site for Lukas Rozado, Data Engineer.
Static HTML/CSS/JS, no build step, no framework, deployed via GitHub Pages.

Live: https://lukasrozado.pages.dev/

## Stack

- HTML5, CSS3, vanilla JavaScript (ES modules) — no framework, no bundler.
- Client-side component includes via `data-include` (see Architecture notes).
- Formspree for the contact form backend.
- Service Worker for offline/PWA support (`sw.js`).
- Bilingual (PT-BR / EN) with parallel page pairs and `hreflang` alternates.

## Structure

```
.
├── index.html, index-en.html          Home page
├── contact.html, contact-en.html      Contact page (Formspree form)
├── 404.html                           Not-found page
├── robots.txt, sitemap.xml,
│   sitemap-images.xml, llms.txt       Crawler and AI-agent directives
├── feed.xml                           RSS for /writing/
├── site.webmanifest, sw.js            PWA manifest and service worker
├── _headers                           HTTP security headers (CSP, HSTS, etc.)
│
├── components/
│   ├── pt/                            PT-BR component sources (header, hero, footer, ...)
│   └── en/                            EN component sources
│
├── projects/                          Case study pages (PT + EN pairs)
│   └── <slug>.html, <slug>-en.html
│
├── writing/                           Long-form essays (PT + EN pairs)
│   ├── index.html, index-en.html
│   └── <slug>.html, <slug>-en.html
│
├── data/projects/
│   ├── pt.json                        Project card data (Portuguese)
│   └── en.json                        Project card data (English)
│
├── assets/
│   ├── js/modules/                    ES modules (menu, projects-loader, filters, ...)
│   ├── images/                        Diagrams, OG cards, photos
│   ├── icons/                         Favicons and tech icons
│   └── svg/                           Inline SVG assets
│
└── styles/main.css                    Global stylesheet
```

## Architecture notes

### Component includes

Header, hero, footer, and the projects grid are marked with
`data-include="./components/<lang>/<name>.html"`. Each of these `div`s also
ships the component's rendered HTML inline as a static fallback, so the page
is fully readable without JavaScript and without a build step. This means
the same markup can exist in two places — the component source under
`components/` and the inline copy on every page that includes it. Both must
be kept in sync when editing shared copy (see `CONTRATO.md`, not tracked in
this repository, for the full editing contract).

### Project pages

Each case study lives under `projects/` as a PT/EN pair sharing one slug
(`<slug>.html` / `<slug>-en.html`). Pages include: breadcrumb navigation,
JSON-LD (`BreadcrumbList` + `TechArticle` or `Dataset`), a lead paragraph
with a concrete metric, a Problem/Solution/Impact block, a social-proof
line, a primary contact CTA, a secondary newsletter CTA, related-project
links, and share actions (LinkedIn, X, copy-link).

Case studies describing contracted work are anonymized: no client, employer,
or data-provider names, no disclosed financial volumes, no internal schema
or table names. Only architectural decisions, trade-offs, and engineering
metrics (throughput, latency, uptime, record counts) are published.

### Writing

`/writing/` holds long-form technical essays, published as static PT/EN
HTML pairs with their own JSON-LD (`BlogPosting`) and an entry in
`feed.xml`. `writing/_TEMPLATE.html` is the starting point for a new post
(git-ignored, local-only).

## Local development

```powershell
./servir-local.ps1
```

Serves the repository root over HTTP so `data-include` and module scripts
resolve correctly (opening the files directly via `file://` breaks both).

## Customization

- Global styles: `styles/main.css`.
- Project card data: `data/projects/pt.json` and `data/projects/en.json`.
- Shared header/hero/footer copy: `components/pt/` and `components/en/`
  (remember to update both the component source and any inline fallback
  copies — see Architecture notes above).
- Contact form endpoint: `contact.html` / `contact-en.html`, Formspree form
  ID in the `<form action>` attribute.

## License

This repository is not open for reuse. Content, structure, design, and code
are created exclusively for the personal and professional use of Lukas
Rozado. Reproduction, redistribution, or reuse without explicit permission
is not permitted.

## Contact

- LinkedIn: https://www.linkedin.com/in/lukasrozado/
- Email: lukasrozado@proton.me
- Newsletter (Dado Bruto): https://www.linkedin.com/newsletters/dado-bruto-7498525638908321792/
