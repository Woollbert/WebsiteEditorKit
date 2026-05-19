# Setup Guide

**Audience:** A coding agent (or human dev) installing this kit on a Next.js project.
**Time:** ~30 min for a greenfield project, ~60 min for an existing project.
**Tested on:** Next.js 15.5, React 19, Tailwind 4, Puck 0.21.2 (May 2026)

> This guide is written from the actual install path that produced [`apps/reference-site/`](./apps/reference-site). Every step has been run end-to-end. If you hit something not covered, open a PR.

---

## Prerequisites

Before starting, you need:

- **Node.js ≥ 22.12** (`node --version` to check)
- A **Next.js 14+ App Router project** to install into (or use this kit as your starter)
- **Tailwind 4** (the kit uses CSS-based theme tokens, not a `tailwind.config.ts`)
- A **GitHub repo** for your site (public or private, doesn't matter)
- A **Vercel** or **Netlify** account (free tier is fine)
- A **DecapBridge** account at https://decapbridge.com (free for ≤5 editors)

---

## Path A — Greenfield install (you're starting fresh)

Easiest path. The kit's reference site IS a working Next.js project. Copy it.

### Step 1 — Clone the kit and lift the reference site into your repo

```powershell
git clone https://github.com/Woollbert/WebsiteEditorKit.git
cd WebsiteEditorKit
# Copy the reference-site as the starting point for your new project
cp -r apps/reference-site/. ../your-project-name
cd ../your-project-name
git init -b main
git add -A
git commit -m "Initial commit from WebsiteEditorKit reference-site"
```

Skip to **Step 4 — Wire up environment variables** below.

---

## Path B — Add to an existing Next.js project

If you already have a Next.js App Router project running, integrate piece by piece.

### Step 1 — Install dependencies

```powershell
cd your-existing-nextjs-project
npm install @puckeditor/core @octokit/rest
```

If you don't already have Tailwind 4, also:

```powershell
npm install -D tailwindcss @tailwindcss/postcss postcss
```

### Step 2 — Copy core files from the kit

From the kit's `apps/reference-site/`, copy these paths to the same locations in your project:

| Kit path | What it does |
|---|---|
| `public/admin/index.html` | Sveltia CMS loader |
| `public/admin/config.yml` | CMS schema — **edit collections to match your content** |
| `src/puck/blocks/*` | 8 reference blocks — **rebrand to match your design system** |
| `src/puck/config.ts` | Block registry |
| `src/components/PuckEditor.client.tsx` | Client-side editor wrapper |
| `src/components/PuckRender.tsx` | Server-side renderer |
| `src/lib/pages.ts` | Filesystem helpers for `src/content/pages/*.json` |
| `src/app/admin/pages/[slug]/page.tsx` | Editor route mount |
| `src/app/[slug]/page.tsx` | Public route for Puck-managed pages |
| `src/app/api/save-page/route.ts` | Save pipeline |
| `src/content/pages/home.json` | Sample page (rename or delete) |
| `src/content/site.json`, `hours.json` | Sample Sveltia content (rename or delete) |
| `.env.example` | Reference for the env vars you'll need |

### Step 3 — Path aliases

The kit uses `@/*` aliases (configured in [`tsconfig.json`](./apps/reference-site/tsconfig.json)). Make sure your project has the same alias or change the imports:

```json
"paths": { "@/*": ["./src/*"] }
```

---

## Step 4 — Wire up environment variables

Create `.env.local` from `.env.example`:

```powershell
cp .env.example .env.local
```

Fill in these required values:

| Variable | What it is | How to get it |
|---|---|---|
| `DECAP_BRIDGE_SITE_UUID` | Auth proxy site UUID | Sign up at https://decapbridge.com, register your site, copy the UUID |
| `GITHUB_PAT` | Fine-grained PAT scoped to your repo | https://github.com/settings/personal-access-tokens/new → Repository access: only this repo → Contents: Read+Write |
| `GITHUB_REPO` | Format: `owner/repo` | e.g. `Woollbert/AviaraDesignCo` |
| `GITHUB_BRANCH` | Branch edits commit to | Usually `main` |
| `EDITOR_SHARED_TOKEN` | Secret protecting `/api/save-page` | Generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | Public URL of your site | e.g. `https://aviaradesignco.com` |

Also paste the `DECAP_BRIDGE_SITE_UUID` into `public/admin/config.yml` under `backend.site_uuid`, and set `backend.repo` to your `owner/repo` value.

---

## Step 5 — Update the Sveltia config collections

Edit `public/admin/config.yml` to match your site's content shape. The reference config has `settings`, `services`, and `team` — replace with whatever your project actually has.

Each `collection` becomes a section in the `/admin/` sidebar. See https://decapcms.org/docs/configuration-options/ for the full schema (Sveltia uses the same).

---

## Step 6 — Rebrand the Puck blocks

Open `src/puck/blocks/*.tsx`. Each block uses CSS variables defined in `src/app/globals.css` (`--color-ink`, `--color-cream`, `--color-gold`, etc.). Either:

**Option A:** Change the CSS variable values in `globals.css` to match your brand.

**Option B:** Edit each block's JSX to use your existing design tokens directly.

The reference blocks are deliberately styled in a warm/cream/gold palette — that's a starting point, not a recommendation. Replace it.

---

## Step 7 — Deploy

### Vercel

```powershell
npm install -g vercel
vercel login
vercel
```

In the Vercel dashboard, add all the env vars from `.env.local` (Project Settings → Environment Variables). The `NEXT_PUBLIC_SITE_URL` should match your Vercel preview URL or custom domain.

### Netlify

```powershell
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

Same env-var instructions in the Netlify dashboard (Site settings → Environment variables).

---

## Step 8 — Invite the site owner

In your GitHub repo settings:

1. Settings → Collaborators → Add people → invite the owner's email
2. They accept the email invitation
3. Send them the URL `https://yoursite.com/admin/`
4. They click "Login with GitHub" — DecapBridge's flow handles the auth via email magic link (no GitHub account knowledge needed)

---

## Step 9 — Verify the end-to-end loop

1. Open `https://yoursite.com/admin/` → log in → edit a Sveltia collection → click Publish → check GitHub for the commit
2. Open `https://yoursite.com/admin/pages/home` → drag a block → edit text → click Publish → check GitHub for the new `src/content/pages/home.json` commit
3. Wait ~60 seconds for the auto-deploy
4. Refresh `https://yoursite.com/` → confirm your edits are live

If step 2's publish errors:
- "Unauthorized" → `EDITOR_SHARED_TOKEN` mismatch between admin page and env
- "GitHub commit failed" → `GITHUB_PAT` is missing Contents:Write permission or scope is wrong
- "Server misconfigured" → an env var isn't set in your deploy environment

---

## Troubleshooting

### Sveltia doesn't load at `/admin/`

- Confirm `public/admin/index.html` deployed to your build output
- Confirm `public/admin/config.yml` is valid YAML (paste into https://www.yamllint.com/)
- Open DevTools console — Sveltia logs errors there with detail

### DecapBridge login fails

- Confirm `backend.site_uuid` in `config.yml` matches the UUID in your DecapBridge dashboard
- Confirm the editor's email is added as a GitHub collaborator on the repo
- DecapBridge has a status page — check there if everything looks right

### Puck editor mounts but blocks aren't draggable

- React/Next version mismatch — Puck 0.21+ requires React 19. Check `package.json`.
- CSS not loaded — confirm `import '@puckeditor/core/puck.css'` is present in `PuckEditor.client.tsx`

### Saved pages don't show up at `/[slug]`

- This is by design with static generation — new pages require a redeploy
- For instant-publish, set `export const dynamic = 'force-dynamic'` on `src/app/[slug]/page.tsx`
- Tradeoff: dynamic mode means every page load reads from disk; OK for small sites, not for high-traffic ones

### GitHub PAT expired

- Generate a new fine-grained PAT scoped only to this repo with Contents: Read+Write
- Update in Vercel/Netlify env vars
- Trigger a re-deploy (env var changes don't auto-rebuild)
- Document the rotation date — fine-grained PATs default to 30/60/90 days

---

## What this kit doesn't include (yet)

- Image upload UI inside Puck (use Sveltia's media library at `/admin/` for now, paste the URL into the block)
- Draft/scheduled-publish workflow (every publish goes live immediately)
- Multi-editor conflict resolution (single-editor assumption; concurrent edits will Git-conflict noisily)
- Page-creation UI (you have to add a new `src/content/pages/<slug>.json` file by hand or via Sveltia, then the editor can edit it)
- Astro support (see [docs/future-porting-to-astro.md](./docs/future-porting-to-astro.md))

If you need any of these, open an issue or send a PR.
