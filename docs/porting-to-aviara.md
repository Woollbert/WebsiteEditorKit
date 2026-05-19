# Porting the Kit to AviaraDesignCo

**Target:** https://github.com/Woollbert/AviaraDesignCo (subdir `aviara-site/`)
**Stack:** Next.js + Tailwind + TypeScript + Playwright (confirmed 2026-05-19)
**Status:** Reference install guide. Actual install steps will be refined once executed against Aviara's tree.

---

## Why this exists separately from SETUP.md

[`SETUP.md`](../SETUP.md) is the generic install guide. This doc captures the **Aviara-specific** choices: which Sveltia collections match Aviara's content, which extra Puck blocks Aviara likely needs, and the deploy-specific details (Aviara is on Vercel; the editor's email is X).

When this doc gets ground-truthed against the real install on Aviara, it should be updated with what actually happened — including any gotchas.

---

## Pre-flight checks

Before starting:

1. **Confirm Aviara's owner has access to their site's Vercel project** (they'll need to add env vars). If DJ owns the Vercel project, confirm DJ will be the one editing initially.
2. **Decide if Aviara is using DecapBridge or some other auth.** The kit assumes DecapBridge. If Aviara already has another auth flow set up, adapt rather than replace.
3. **Confirm photo upload volume.** Aviara is a staging company → photos are the product. If the owner expects to upload 50+ photos per project, the kit's "paste URL into block" UX is too painful. Consider either:
   - Switching to Cloudinary or Imgix integration in the ImageGallery block
   - Or making the Sveltia media library the primary upload point

---

## Aviara-specific install steps

Most of this follows [SETUP.md Path B (existing project)](../SETUP.md#path-b--add-to-an-existing-nextjs-project). The deltas below are Aviara-only.

### Step 1 — Install into `aviara-site/`, not the repo root

The Aviara repo has the Next.js project at `aviara-site/`, not the repo root. All copy operations from the kit's `apps/reference-site/` should target `aviara-site/` paths.

```powershell
cd /path/to/AviaraDesignCo/aviara-site
npm install @puckeditor/core @octokit/rest
```

### Step 2 — Bridge Tailwind themes

Aviara's `tailwind.config.ts` uses a luxury neutral palette. The kit's blocks use CSS variables (`--color-ink`, `--color-cream`, `--color-gold`).

**Option A (recommended):** Add the kit's CSS variables to Aviara's existing `globals.css`, but **assign them to Aviara's brand values**:

```css
@theme {
  --color-ink: /* Aviara's primary dark */;
  --color-cream: /* Aviara's primary light */;
  --color-gold: /* Aviara's accent — if no accent, use a neutral mid-tone */;
  /* etc */
}
```

This means the kit's blocks "just work" in Aviara's palette without rewriting each block.

**Option B:** Rewrite each block's JSX to use Aviara's Tailwind classes directly (`bg-stone-50`, `text-zinc-900`, etc.). More work but cleaner long-term.

### Step 3 — Sveltia collections for Aviara

Replace the kit's `services` / `team` collections in `public/admin/config.yml` with Aviara's actual content shape:

```yaml
collections:
  - name: settings
    label: Site Settings
    files:
      - name: site
        label: Site Info
        file: src/content/site.json
        fields:
          - { name: name, label: Business Name, widget: string }
          - { name: tagline, label: Tagline, widget: string }
          - { name: phone, label: Phone, widget: string }
          - { name: email, label: Email, widget: string }
          - { name: serviceArea, label: Service Area, widget: string }

  - name: projects
    label: Projects (Portfolio)
    folder: src/content/projects
    create: true
    slug: '{{slug}}'
    fields:
      - { name: title, label: Project Title, widget: string }
      - { name: location, label: Location, widget: string }
      - { name: completedDate, label: Completed, widget: datetime }
      - { name: description, label: Description, widget: text }
      - name: photos
        label: Photos
        widget: list
        fields:
          - { name: url, label: Image URL, widget: image }
          - { name: caption, label: Caption, widget: string }
          - { name: room, label: Room (kitchen, bedroom, etc.), widget: string }

  - name: testimonials
    label: Testimonials
    folder: src/content/testimonials
    create: true
    fields:
      - { name: quote, label: Quote, widget: text }
      - { name: attribution, label: Attributed To, widget: string }
      - { name: role, label: Role (Realtor, Homeowner, etc.), widget: string }
      - { name: featured, label: Show on homepage, widget: boolean }

  - name: services
    label: Services
    folder: src/content/services
    create: true
    fields:
      - { name: name, label: Service Name, widget: string }
      - { name: shortDescription, label: Short Description, widget: text }
      - { name: longDescription, label: Long Description, widget: markdown }
      - { name: hero, label: Hero Image, widget: image }
```

### Step 4 — Aviara-specific Puck blocks

The 8 generic blocks in the kit get you most of the way. For staging/interiors, you'll likely want to add:

| Block | Why Aviara needs it |
|---|---|
| `BeforeAfterSlider` | Show staged-vs-empty rooms — the marquee value prop |
| `ProjectShowcase` | Pull a single project from the `projects` collection, render full photo gallery with metadata |
| `ServiceDetail` | Pull a single service, render hero + description + CTA |
| `TestimonialCarousel` | Pull featured testimonials and rotate through them |
| `RoomGrid` | Photo grid filtered by room type (kitchen, bedroom, living) |

Each one follows the same pattern as the kit's existing blocks — `ComponentConfig<Props>` with `fields`, `defaultProps`, `render`. Use `ImageGalleryBlock.tsx` as a copy-paste starting point for any photo-heavy block.

### Step 5 — Vercel env vars

Aviara is on Vercel. Add the env vars from [SETUP.md Step 4](../SETUP.md#step-4--wire-up-environment-variables) via:

```powershell
vercel env add EDITOR_SHARED_TOKEN production
vercel env add GITHUB_PAT production
vercel env add GITHUB_REPO production  # value: Woollbert/AviaraDesignCo
vercel env add GITHUB_BRANCH production  # value: main
vercel env add DECAP_BRIDGE_SITE_UUID production
```

Then redeploy: `vercel --prod`.

### Step 6 — Invite Aviara's owner

In https://github.com/Woollbert/AviaraDesignCo/settings/access:
1. Invite collaborator → enter Aviara owner's email
2. They accept via email
3. Send them: `https://aviaradesignco.com/admin/`
4. They click "Login with GitHub" → DecapBridge sends a magic link to their email → they're in

---

## Likely customizations after first install

Things Aviara's owner will probably ask for in the first month:

- **Tighter typography control on the Hero block.** Add a `headingSize` prop with options `small | medium | large` if they ask.
- **More portfolio layout variants.** The `ImageGallery` block has 3 column options; they may want masonry or carousel.
- **Featured-project block on the homepage.** Build `ProjectShowcase` with a `projectSlug` field that pulls from `src/content/projects/<slug>.json`.
- **Inquiry form.** Out of scope for the visual editor — wire as a separate Next.js form action.

Don't pre-build these. Wait for the actual ask. The kit's whole point is "ship small, extend on demand."

---

## Open questions for DJ before the install

- Does Aviara have a brand style guide that defines the color tokens? If yes, paste here so the CSS variables can be set correctly upfront.
- Is there an existing photo library to migrate, or does the owner start from a blank slate?
- Does Aviara's site have any pages currently that should become Puck-managed, or do we leave existing pages code-managed and only enable Puck for new pages?
- What email should DecapBridge invite the owner from? (Sometimes companies block magic-link emails from unknown senders.)
- Is the live domain `aviaradesignco.com` already pointed at the Vercel deployment, or is the kit going to a staging URL first?
