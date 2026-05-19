# Setup Guide

**Audience:** A coding agent (or human dev) installing this kit on a new or existing Next.js project.
**Status:** 🚧 Placeholder — written in detail at end of Phase 6, after the reference site proves the install path.

---

## What this guide will contain (when complete)

1. **Prerequisites**
   - Existing Next.js 14+ project with App Router
   - Tailwind 4 set up
   - GitHub repo (any visibility)
   - Vercel or Netlify account (free tier OK)

2. **Step 1 — Install kit dependencies**
   - `npm install` exact list with pinned versions

3. **Step 2 — Copy the `/admin/` directory**
   - Sveltia CMS mount
   - `config.yml` with collection examples

4. **Step 3 — Configure DecapBridge**
   - Sign up at decapbridge.com (free for ≤5 editors)
   - Get site UUID
   - Paste into `config.yml`
   - Add owner as GitHub collaborator (DecapBridge sends email invite)

5. **Step 4 — Copy Puck mount**
   - `src/app/admin/pages/[slug]/page.tsx`
   - `src/puck/config.ts` (block registry)
   - `src/puck/blocks/*` (reference block library — rebrand to match your design)

6. **Step 5 — Copy save pipeline**
   - `src/app/api/save-page/route.ts` (serverless function)
   - Environment variables (GitHub PAT, repo identifier)
   - Vercel/Netlify env var setup

7. **Step 6 — Copy renderer**
   - `src/app/[...slug]/page.tsx` (dynamic route reading saved JSON)
   - `src/components/PuckRender.tsx`

8. **Step 7 — Verify**
   - Run `npm run dev`
   - Open `/admin/` — see Sveltia
   - Open `/admin/pages/home` — see Puck editor
   - Edit, click Publish — verify GitHub commit lands
   - Verify auto-deploy completes and edits are live

9. **Step 8 — Rebrand**
   - Edit `src/puck/blocks/*` to match your site's typography / spacing / colors
   - Edit `public/admin/config.yml` collections to match your content shape
   - Optional: add/remove block variants

10. **Troubleshooting**
    - DecapBridge auth not working → check site UUID
    - GitHub commits not landing → verify PAT scopes
    - Puck not rendering → check `<PuckRender />` mount + `client:only` directive
    - Auto-deploy not triggering → confirm Vercel/Netlify is watching the right branch

---

## For now

This file is a stub. The actual step-by-step instructions get written when Phase 6 lands — **so they reflect the real install path, not what we *think* it'll be**. Writing the guide before doing the install is how guides end up wrong.

Until Phase 6 ships, refer to `apps/reference-site/` as the working reference.
