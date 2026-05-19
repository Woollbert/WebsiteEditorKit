# Porting the Kit to AviaraDesignCo

**Target:** https://github.com/Woollbert/AviaraDesignCo (subdir `aviara-site/`)
**Stack:** Next.js 15.5 + React 19 + Tailwind 3 + TypeScript + Playwright
**Status:** ✅ Dry-run port completed 2026-05-19. Branch `kit-port-dry-run`. All 6 smoke tests pass against built+started Aviara.
**Live install:** Pending DJ-provided credentials (DECAP_BRIDGE_SITE_UUID, GITHUB_PAT, EDITOR_SHARED_TOKEN).

---

## What this doc is now

This was originally a speculative install guide. After actually executing the port on Aviara, it's been rewritten to reflect **what really happened**, including:
- The one real compatibility gotcha (Tailwind version mismatch)
- The theme-bridge pattern that made the kit's blocks work in Aviara colors with zero block modifications
- What broke during the port (nothing, it turns out)
- What still needs real credentials to fully verify

To reproduce: see the [kit-port-dry-run branch](https://github.com/Woollbert/AviaraDesignCo/tree/kit-port-dry-run) on Aviara.

---

## Pre-flight findings (Aviara repo audit, 2026-05-19)

| Aspect | Aviara | Kit | Compatibility |
|---|---|---|---|
| Framework | Next.js 15.5.0 | Next.js 15.1.4 | ✅ Compatible |
| React | 19.0.0 | 19.0.0 | ✅ Match |
| **Tailwind** | **3.4.17 (config.ts-based)** | **4.0.0 (CSS-based @theme)** | ⚠️ Different syntax, but kit's blocks use plain CSS variables — works in either |
| Project layout | Root + `aviara-site/` subdir | Single project | Port targets `aviara-site/` paths |
| Existing pages | Hand-coded `page.tsx` only | Puck-managed via JSON | Coexist — Aviara's `/` and kit's `/[slug]` don't collide |
| CMS today | None | Sveltia mounted | Clean slate |
| Playwright | Already installed | Same | No conflict |
| Brand palette | `--color-bone`, `--color-ink`, `--color-brass` (CSS vars on `:root`) | Generic kit names (`--color-cream`, `--color-gold`) | **Solved with CSS variable aliases** — see Theme Bridge below |

**Bottom line:** structurally compatible. The Tailwind major-version difference is a non-issue because the kit's reference blocks use inline `style={{ background: 'var(--color-cream)' }}` rather than Tailwind utility classes for color tokens.

---

## The one real install gotcha

**Theme tokens have different names.** The kit's blocks reference `--color-cream`, `--color-ink`, `--color-gold`, `--color-cream-soft`, `--color-ink-soft`, `--color-gold-deep`. Aviara's globals.css defines `--color-bone`, `--color-ink`, `--color-brass`, etc.

**Without a fix:** kit blocks render with undefined CSS variables → fall back to browser defaults → look broken.

**The fix (one block in `aviara-site/src/app/globals.css`):**

```css
:root {
  /* Existing Aviara variables (kept as-is) */
  --color-bone: #f4efe8;
  --color-ink: #1c1815;
  --color-brass: #9a7b3d;
  /* ... */

  /* WebsiteEditorKit compatibility aliases */
  --color-cream: var(--color-bone);
  --color-cream-soft: var(--color-ivory);
  --color-ink-soft: var(--color-slate);
  --color-gold: var(--color-brass);
  --color-gold-deep: var(--color-brass-deep);
}
```

This makes the kit's 8 reference blocks pick up Aviara's brand colors **without modifying a single block source file**. Verified at runtime: the CTABand block with `background: 'gold'` computes to `rgb(154, 123, 61)` — Aviara's brass, not the kit's default amber.

**Why this pattern matters for the future:** when you port the kit to any other site (a third one), the same trick works. Drop the kit, add the aliases, done. No block-by-block migration.

---

## What was copied (verbatim from kit)

These files moved from `WebsiteEditorKit/apps/reference-site/` → `AviaraDesignCo/aviara-site/`, no edits:

- `src/puck/` (entire dir — config.ts + all 8 block files)
- `src/components/PuckEditor.client.tsx`
- `src/components/PuckRender.tsx`
- `src/lib/pages.ts`
- `src/app/api/save-page/route.ts`
- `public/admin/index.html`
- `.env.example`

These were copied + edited for Aviara:

- `src/app/admin/pages/[slug]/page.tsx` — identical to kit's version
- `src/app/[slug]/page.tsx` — identical to kit's version, plus a comment noting that Aviara's hand-coded pages take precedence over same-slug Puck pages
- `public/admin/config.yml` — **replaced kit's services/team collections with Aviara-specific projects (with photo sets + room enum), testimonials, services**
- `src/app/globals.css` — added the 5 CSS variable aliases described above
- `src/content/pages/home-editable.json` — a sample editable page proving the renderer works

---

## Install command sequence (reproducible)

From a fresh clone of `AviaraDesignCo`:

```powershell
cd AviaraDesignCo
git checkout -b kit-port-dry-run

# Create the directories the kit needs
cd aviara-site
mkdir src/puck/blocks src/lib src/content/pages src/content/projects src/content/testimonials src/content/services
mkdir src/app/admin/pages "src/app/[slug]" src/app/api/save-page public/admin

# Copy kit files (paths assume the kit repo is at C:\Users\wooll\nextjs-sveltia-puck-kit)
cp -r ../../nextjs-sveltia-puck-kit/apps/reference-site/src/puck src/
cp ../../nextjs-sveltia-puck-kit/apps/reference-site/src/components/PuckEditor.client.tsx src/components/
cp ../../nextjs-sveltia-puck-kit/apps/reference-site/src/components/PuckRender.tsx src/components/
cp ../../nextjs-sveltia-puck-kit/apps/reference-site/src/lib/pages.ts src/lib/
cp ../../nextjs-sveltia-puck-kit/apps/reference-site/src/app/api/save-page/route.ts src/app/api/save-page/
cp ../../nextjs-sveltia-puck-kit/apps/reference-site/public/admin/index.html public/admin/
cp ../../nextjs-sveltia-puck-kit/apps/reference-site/.env.example .

# Apply Aviara-specific edits:
#   1. Write src/app/admin/pages/[slug]/page.tsx        (mount the editor)
#   2. Write src/app/[slug]/page.tsx                    (public dynamic route)
#   3. Write public/admin/config.yml                    (Aviara collections)
#   4. Add CSS variable aliases to src/app/globals.css
#   5. Seed src/content/pages/home-editable.json

# Install kit dependencies
npm install @puckeditor/core@^0.21.2 @octokit/rest@^21.0.2

# Verify the build
npm run build
```

**Time elapsed for actual execution: ~12 minutes** (clone + audit + copy + edits + install + build). No errors at any step.

---

## What the smoke tests prove

Tests live at `aviara-site/tests/kit-port-smoke.spec.ts`. Run with:

```powershell
EDITOR_SHARED_TOKEN=any-string GITHUB_PAT=any-string GITHUB_REPO=test/repo GITHUB_BRANCH=main npx playwright test --project=desktop tests/kit-port-smoke.spec.ts
```

| Test | What it proves |
|---|---|
| Aviara existing homepage still loads | The port didn't break the hand-coded `/` |
| `/home-editable` renders kit blocks | The renderer + Puck data flow works |
| **CTABand picks up Aviara brass color** | **The theme bridge works at runtime, not just in theory** |
| `/admin/index.html` serves Sveltia | The Sveltia mount is reachable |
| `/admin/pages/[slug]` mounts editor | The Puck route is wired |
| `/api/save-page` rejects unauthenticated | Auth gate enforced |

Result: 6/6 passing in 5.4s.

---

## What still needs real credentials to fully verify

These three flows can only be tested with real creds (DJ has to provide):

1. **Sveltia login** — needs a real `DECAP_BRIDGE_SITE_UUID`. Without it, the login button hangs because DecapBridge can't find the site UUID.
2. **Puck publish round-trip** — needs a real `GITHUB_PAT` with Contents: Write scope on `Woollbert/AviaraDesignCo`. The save endpoint passes auth + validation already (verified by 502 in test env, which is the test endpoint trying to call GitHub with a bogus PAT). With a real PAT, it should round-trip to a real GitHub commit.
3. **Auto-deploy verification** — needs Aviara's Vercel project to be picking up commits on the `kit-port-dry-run` branch (or merged to main first).

DJ's TODO when ready:
- [ ] Register at https://decapbridge.com, get site UUID, paste into `aviara-site/public/admin/config.yml` and `.env.local`
- [ ] Create fine-grained GitHub PAT scoped to AviaraDesignCo, Contents: Read+Write
- [ ] Add `EDITOR_SHARED_TOKEN`, `GITHUB_PAT`, `GITHUB_REPO`, `GITHUB_BRANCH` to Vercel env (production)
- [ ] Merge `kit-port-dry-run` → `main` (or test on the branch first via Vercel preview)
- [ ] Walk through end-to-end manually: edit at `/admin/pages/home-editable` → publish → verify GitHub commit → verify Vercel deploy → verify live page

---

## What's NOT in this dry-run (deliberately)

- **Aviara-specific custom blocks.** The 8 generic blocks (Hero, RichText, CTABand, FeatureGrid, ImageGallery, Testimonial, ContactInfo, Spacer) cover the structural integration. Aviara likely wants additional blocks like `BeforeAfterSlider`, `ProjectShowcase`, `TestimonialCarousel`, `RoomGrid`. These get built when there's a concrete design ask, not preemptively.
- **Decap → Sveltia auth gate on the Puck editor route.** Currently `/admin/pages/[slug]` is reachable by anyone who knows the URL (publish is gated by the shared token, but viewing the editor isn't). Tracked in [SPEC.md §3 risks](../SPEC.md#3-trade-offs).
- **Image upload UI inside Puck blocks.** Owner uploads via Sveltia's media library at `/admin/` and pastes URLs into block fields. Out of scope for v0.1.
- **Migrating Aviara's existing hand-coded pages to Puck.** Aviara's homepage at `/` stays hand-coded. Only new pages get Puck-managed (currently just `/home-editable` as a demo). When the owner wants the homepage editable, delete `aviara-site/src/app/page.tsx` and add `src/content/pages/home.json`.

---

## Open questions for DJ before the live install

These are the actual decisions left, captured from the dry-run experience:

1. **Should `/home-editable` stay as the demo page, or rename to something more meaningful?** (Currently lives at `/home-editable`; could be `/test-puck` or removed once you confirm it works.)
2. **Who is the owner email for DecapBridge invitation?** This determines the magic-link recipient.
3. **Do you want Vercel to deploy the `kit-port-dry-run` branch as a preview before merging?** (Default: yes, so you can click around the editor on a real URL before main gets touched.)
4. **What's the timeline for adding Aviara-specific blocks (BeforeAfterSlider etc.)?** Lower priority; defer until owner uses the kit and identifies a missing block.
5. **Should we add a `aviara-site/tests/kit-port-smoke.spec.ts` to the existing CI run?** Currently it's there but not invoked by default — Aviara's playwright.config doesn't auto-discover it because of the project filter.
