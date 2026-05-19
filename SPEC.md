# Architecture Specification

**Status:** Phase 1 (scaffolding) — this doc will firm up as later phases ship.
**Authored:** 2026-05-19
**Author:** DJ + Claude (Anthropic)

This document explains *why* the kit is shaped the way it is — the constraints, the alternatives considered and rejected, and the trade-offs accepted. Read this before extending or porting the kit.

---

## 1. Goal

Give a non-technical site owner (e.g. a barbershop owner, an interior designer, a personal-brand operator) the ability to update content and layout on their own site, with these constraints:

- **$0/mo recurring cost** (no SaaS visual editor like CloudCannon or Wix)
- **Content stored in Git** (so the owner is never locked in)
- **No GitHub knowledge required** for the owner — email magic-link login only
- **Design system protected** — owner can't accidentally pick Comic Sans or rainbow gradients
- **Static-deploy compatible** — runs on Vercel / Netlify free tiers
- **Mobile-friendly admin** — owner can edit from her phone

---

## 2. The chosen stack

| Layer | Tool | Why |
|---|---|---|
| Site framework | **Next.js (App Router) + Tailwind 4** | Puck has first-class Next support; Tailwind is the de facto styling system |
| Form-based content CMS | **Sveltia CMS** | Drop-in replacement for Decap CMS — same `config.yml` schema, same Git backend, much better UX (mobile-friendly, faster, modern) |
| Visual layout editor | **Puck (@measured/puck)** | Best OSS block-composer for React; outputs JSON that an Astro/Next renderer can consume |
| Auth proxy | **DecapBridge** | PKCE-based OAuth proxy that hides GitHub from the editor. Free for ≤5 editors. |
| Hosting | **Vercel or Netlify** | Both have free tiers with serverless functions, GitHub auto-deploy, and CDN |
| Persistence backend | **GitHub Contents API via serverless function** | No DB, no separate backend. Edits → commit → auto-rebuild → live in ~60s |

All MIT-licensed. All free forever. All replaceable.

---

## 3. Trade-offs (read this if you're tempted to redesign)

### 3a. Why constrained blocks, not freeform editing

Puck is a **block composer** — owners drag pre-built sections (`<HeroBlock>`, `<PricingBlock>`, `<CTABand>`) and edit a fixed set of props (heading text, image, alignment) but **cannot change fonts, colors, or arbitrary CSS**.

This is a deliberate choice. The alternatives:

| Alternative | Why rejected |
|---|---|
| Wix / Webflow | Lock-in. Re-platforming away later is months of work. Paid tiers required. |
| CloudCannon | $49/mo. Best paid OSS-friendly option — recommended if budget allows. |
| Build a Wix-clone | Underestimating this is a months-long mistake. Wix has 18 years of engineering on responsive constraint solvers, asset pipelines, undo/redo CRDT, cross-browser quirks. |
| GrapesJS / Webstudio | GrapesJS produces HTML that bypasses your design system. Webstudio replaces your framework entirely. |
| TinaCMS | Requires its own backend (DB + Auth). Heavier than what most small-business sites need. |

The constrained-block model trades editor freedom for **brand safety**. Owners can rearrange, edit copy, swap images — they cannot accidentally make the site ugly.

### 3b. Why Sveltia not just Decap

Decap CMS is the long-standing default. Sveltia is a drop-in replacement (same `config.yml`) with:

- Faster admin loads (GraphQL bulk fetch vs Decap's per-file REST)
- Mobile-friendly UI
- Active maintenance (Decap's pace slowed)
- Better i18n support if you ever need it

If Sveltia stops being maintained, swap one `<script src>` tag and you're back on Decap. Zero migration cost.

### 3c. Why Next.js as the kit's reference framework

Originally specced for Astro (the target was a barbershop site on Astro). But Puck's mainstream integration is Next.js — Astro requires React-island gymnastics and custom rendering. When the kit's first deployment target turned out to be Next.js (Aviara Design Co.), we pivoted to Next-first.

An Astro chapter will be added later when an Astro target site actually needs it. The Sveltia + Puck patterns are framework-agnostic at the data layer — only the mount points differ.

### 3d. Why GitHub Contents API, not a real backend

The save flow is: editor clicks "Publish" → POST to `/api/save-page` serverless function → function commits JSON to GitHub via Octokit → GitHub push triggers Vercel/Netlify build → site live in ~60s.

This trades **save latency** (15-60 sec to see changes live) for **architectural simplicity** (no DB, no auth server, no separate hosting). For a low-edit-frequency site (a few changes/month), the trade is correct.

If your site needs sub-second saves or multi-editor real-time collaboration, this kit is the wrong fit — use TinaCMS Cloud or Sanity instead.

---

## 4. Data flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ Owner opens /admin/                                                 │
│ → Sveltia CMS loads, prompts magic-link login (DecapBridge OAuth)   │
│ → Owner edits structured content (services.json, hours.json, etc.)  │
│ → Sveltia commits to GitHub                                         │
│ → Vercel/Netlify auto-deploys                                       │
│                                                                     │
│ Owner opens /admin/pages/[slug]/                                    │
│ → Puck editor loads with current page JSON                          │
│ → Owner drags/edits blocks                                          │
│ → Click "Publish" → POST /api/save-page                             │
│ → Serverless function commits src/content/pages/[slug].json         │
│ → Vercel/Netlify auto-deploys                                       │
│                                                                     │
│ Visitor opens /[slug]                                               │
│ → Next.js renders via <PuckRender /> reading src/content/pages/...  │
│ → Sub-second response (static generation or ISR)                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Block library design principles

When extending the block library:

1. **One block = one Astro/Next section.** Don't make mega-blocks with 30 props.
2. **Props are user-language, not designer-language.** Use `heading` not `headingText`; use `imageAlignment: 'left' | 'right'` not `flexDirection`.
3. **Lock all visual styling at the component level.** Owner edits `heading`, never `headingClassName` or `headingColor`.
4. **Provide 2-3 layout variants per block, no more.** "Hero Centered" / "Hero Split" / "Hero Full-Bleed" — not 12 freely-mixed options.
5. **Defaults must be brand-safe.** Every block, dropped onto a page with no edits, should look like the brand intended it.
6. **Every prop has a sensible empty state.** No "your image here" placeholder text leaking to production.

---

## 6. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Puck breaking change | Medium | Medium | Pin version in package.json. Review release notes before upgrading. |
| Sveltia stalls before v1.0 GA | Low | Low | Drop-in Decap fallback always available. |
| DecapBridge service shuts down | Low | High | Self-host the PKCE proxy (it's ~50 LOC) or switch to GitHub OAuth App directly. Migration is 1-2 hours. |
| GitHub PAT expires | Medium | High | Use long-lived fine-grained PAT scoped to one repo. Document rotation in SETUP.md. |
| Owner edits collide on push | Low | Low | Owner is solo editor; commits are sequential. If multi-editor needed, switch to TinaCMS. |
| Serverless cold-start lag | Low | Low | Vercel/Netlify cold-starts are sub-second; save UX tolerates it. |

---

## 7. References

- **Puck:** https://puckeditor.com — block-composer for React/Next
- **Sveltia CMS:** https://sveltiacms.app — modern Decap replacement
- **DecapBridge:** https://decapbridge.com — PKCE OAuth proxy for non-technical editors
- **Decap CMS (predecessor):** https://decapcms.org — for reference / fallback
- **GitHub Contents API:** https://docs.github.com/en/rest/repos/contents

---

## 8. Open questions (to be resolved in later phases)

- Should `/admin/pages/[slug]/` enumerate creatable slugs, or only edit existing ones?
- How do we handle image uploads in Puck blocks? (Sveltia media library? Direct GitHub commit?)
- Should published pages support draft / scheduled-publish? (out of scope for v1)
- How does the owner add a *new* page vs editing an existing one? (probably "duplicate page" UX in Puck)
- Versioning / undo beyond Git? (probably skip for v1 — Git history is the version system)
