# Templates

This folder is a pointer index, not a duplicate of working code. The kit's reference implementation lives at [`../apps/reference-site/`](../apps/reference-site/) — that's what you copy from when installing.

## Files to copy when porting

| Purpose | Source path |
|---|---|
| Sveltia CMS mount | [`apps/reference-site/public/admin/index.html`](../apps/reference-site/public/admin/index.html) |
| Sveltia config (collections schema) | [`apps/reference-site/public/admin/config.yml`](../apps/reference-site/public/admin/config.yml) |
| Puck editor wrapper (client) | [`apps/reference-site/src/components/PuckEditor.client.tsx`](../apps/reference-site/src/components/PuckEditor.client.tsx) |
| Puck renderer (server) | [`apps/reference-site/src/components/PuckRender.tsx`](../apps/reference-site/src/components/PuckRender.tsx) |
| Block registry | [`apps/reference-site/src/puck/config.ts`](../apps/reference-site/src/puck/config.ts) |
| Reference blocks (8 of them) | [`apps/reference-site/src/puck/blocks/`](../apps/reference-site/src/puck/blocks/) |
| Filesystem helpers | [`apps/reference-site/src/lib/pages.ts`](../apps/reference-site/src/lib/pages.ts) |
| Editor route | [`apps/reference-site/src/app/admin/pages/[slug]/page.tsx`](../apps/reference-site/src/app/admin/pages/[slug]/page.tsx) |
| Public dynamic page route | [`apps/reference-site/src/app/[slug]/page.tsx`](../apps/reference-site/src/app/[slug]/page.tsx) |
| Save pipeline (API route) | [`apps/reference-site/src/app/api/save-page/route.ts`](../apps/reference-site/src/app/api/save-page/route.ts) |
| Env var template | [`apps/reference-site/.env.example`](../apps/reference-site/.env.example) |

## Why no duplication?

If templates lived here AND in `apps/reference-site/`, they would drift apart the moment one was edited. The single source of truth is the reference site. This folder just tells you which files to lift.

When you copy a file into your project, **change the import paths** if your project uses different aliases. The reference uses `@/*` for `./src/*`.
