# Future: Porting the Kit to Astro

**Status:** 🚧 Stub. Written when an Astro target site actually needs visual editing.

The original use case for this kit was an Astro barbershop site (A Cut Above Barber Shop). When that site's owner asks for visual editing, this chapter gets written.

## What changes from Next.js to Astro

The data layer is identical — Sveltia + Puck both commit JSON to Git, the save pipeline doesn't care about the framework. What changes:

1. **Puck mounting** — Astro needs Puck as a `client:only="react"` island, not a native React route
2. **Page rendering** — Astro reads the JSON in frontmatter and passes to `<PuckRender />` as an island
3. **Serverless save function** — Astro deploys to Netlify or Vercel and uses Netlify Functions / Vercel Functions the same way Next does, but the file location and signature differ
4. **TypeScript inference** — Astro's typed JSX vs Next's TSX has gotchas around Puck's component config

## Why this is harder than Next.js

Puck is React-first. Astro is multi-framework but doesn't render React natively — every Puck instance is an island, every prop change forces a hydration boundary, and Puck's preview iframe needs careful Astro `<Slot>` handling.

Estimated effort to add the Astro chapter once Next.js version is shipped: 2-3 days.

## Reference

When this chapter is written, it should mirror the structure of `porting-to-aviara.md` — concrete, project-specific, with real install steps from actually doing the install.

The likely first Astro target: A Cut Above Barber Shop (https://github.com/Woollbert/ACutAboveBarberSC), pending the owner Kristy asking for visual editing capabilities.
