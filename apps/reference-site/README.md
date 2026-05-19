# Reference Site

The fully working demo of the Next.js + Sveltia + Puck kit. An agent installing the kit on a new project clones this directory's structure into their own repo.

## Run locally

```bash
npm install
cp .env.example .env.local
# fill in DECAP_BRIDGE_SITE_UUID and GITHUB_PAT
npm run dev
```

Open http://localhost:3000.

## Routes

- `/` — Public landing page
- `/admin/` — Sveltia CMS (structured content edits) [Phase 3]
- `/admin/pages/[slug]` — Puck visual editor [Phase 4]
- `/[slug]` — Public rendering of Puck-managed pages [Phase 4]
- `/api/save-page` — Serverless function that commits Puck JSON to GitHub [Phase 5]

## Status

Built phase-by-phase. See the root [README.md](../../README.md) for status checkboxes.

## Don't edit this directly

This is the reference. Edits should go into your *copy* of this directory in your real project's repo. If you find a bug or want to improve the reference, open a PR against the kit repo.
