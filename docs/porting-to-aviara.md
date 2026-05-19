# Porting the Kit to AviaraDesignCo

**Target:** https://github.com/Woollbert/AviaraDesignCo
**Stack:** Next.js + Tailwind + TypeScript + Playwright (confirmed 2026-05-19)
**Status:** 🚧 Will be filled in after Phase 6 completes and the kit is published.

---

## What this guide will cover

A specific, step-by-step set of instructions for installing the kit into Aviara's existing repo at `aviara-site/` — handling:

1. **Existing-project install** (not greenfield) — the kit drops into Aviara's existing Next.js tree without colliding
2. **Tailwind theme bridging** — Aviara's typography and neutral-palette tokens get plumbed into the Puck block library so blocks match the brand
3. **Photo-heavy content model** — staging companies live on before/after photos; Sveltia collections shaped for portfolio galleries (project name, location, photo set, description)
4. **Content collections specific to Aviara** — Projects, Testimonials, Services, Team, Inquiry form copy
5. **Block library customization** — likely needs additions like `BeforeAfterSlider`, `PhotoGallery`, `ProjectShowcase`, `TestimonialQuote`
6. **DecapBridge setup with Aviara's owner email** — magic-link invite flow
7. **Deploy path** — Aviara is on Vercel; specific env var setup

---

## Why this isn't written yet

The reference site needs to exist first. Once Phase 6 ships, this guide gets written by **actually doing the install** on Aviara — capturing real steps, real gotchas, real fixes. Writing it speculatively would produce a guide that's wrong in ways nobody discovers until install day.

---

## Open questions for DJ before this install begins

- Does Kristy or Aviara's owner have a preferred email for the magic-link login?
- Should the editor flow be password-protected behind Vercel preview, or live on the production domain?
- Are there specific pages Aviara wants visually editable (homepage, portfolio index) vs. left code-only (legal, contact form)?
- What's the photo upload volume expected? (Determines whether Sveltia's media library handles it or we need Cloudinary/Imgix)
