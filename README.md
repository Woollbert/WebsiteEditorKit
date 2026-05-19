# Next.js + Sveltia + Puck Visual Editor Kit

A free, OSS, Git-backed visual editing stack for Next.js sites. Drop-in package that gives non-technical site owners:

- **Form-based content editing** via Sveltia CMS (drop-in Decap replacement) at `/admin/`
- **Block-based visual page editing** via Puck at `/admin/pages/[slug]/`
- **Email magic-link auth** via DecapBridge — no GitHub knowledge required for editors
- **Content stays in Git** — leave any tool at any time without losing data
- **Zero monthly cost** — all OSS, runs on free tiers (Vercel/Netlify)

## When to use this kit

Use this when you need a small business owner to manage their own site without:

- Paying $49/mo for CloudCannon or similar SaaS visual editors
- Locking content into Wix / Squarespace / Webflow
- Giving the owner direct GitHub access
- Letting the owner break the design system (block library is constrained on purpose)

## When NOT to use this kit

- You need **true freeform** Wix/Webflow-style editing (anyone-can-place-anything). This kit is constrained-block by design — there's no free OSS path to freeform on Next.js in 2026. See [SPEC.md §3](./SPEC.md#3-trade-offs).
- The site is **already on a different framework** (Astro, WordPress, Wix). An Astro chapter is planned; see [docs/future-porting-to-astro.md](./docs/future-porting-to-astro.md).
- The site doesn't need editing — owner is happy to ask a dev for changes.

## Structure

```
nextjs-sveltia-puck-kit/
├── README.md                      ← you are here
├── SPEC.md                        ← architecture & decisions
├── SETUP.md                       ← step-by-step install on a fresh Next.js site
├── apps/
│   └── reference-site/            ← fully working demo (Next + Sveltia + Puck)
├── templates/                     ← copy-paste-ready snippets
└── docs/
    ├── porting-to-aviara.md       ← specific guide for the Aviara target
    └── future-porting-to-astro.md ← stub; written when Astro chapter lands
```

## Quick start (for a fresh project)

See [SETUP.md](./SETUP.md) for the step-by-step install. The TL;DR:

1. Clone `apps/reference-site` into your project
2. Copy your Tailwind theme tokens in
3. Rebrand the Puck block library to match your design system
4. Set up DecapBridge auth for the owner
5. Deploy to Vercel or Netlify
6. Add the owner as a GitHub collaborator (DecapBridge handles the rest)

## Quick start (for an existing Next.js project)

Follow [SETUP.md](./SETUP.md) — the install copies the `/admin/`, Puck mount, and Save Function into your existing tree without disrupting your pages.

## Agent-followable install

If you're an AI coding agent installing this kit on a new project, **start with [SETUP.md](./SETUP.md)** — it's written as numbered steps with file paths and exact commands. Don't infer; follow.

## License

MIT. Use freely, fork freely, no attribution required (but appreciated).

## Status

✅ v0.1 complete. All 6 phases shipped:

- [x] Phase 1 — Scaffolding + SPEC.md + README outline
- [x] Phase 2 — Next.js 15 reference site skeleton (Tailwind 4 + TypeScript)
- [x] Phase 3 — Sveltia CMS wired with 3 example collections (settings, services, team)
- [x] Phase 4 — Puck 0.21.2 editor + 8-block reference library
- [x] Phase 5 — Save pipeline (POST /api/save-page → GitHub Contents API → auto-deploy)
- [x] Phase 6 — SETUP.md + porting-to-aviara.md + templates/

**Next:** ground-truth the Aviara port. Open issues for anything that doesn't match the docs.
