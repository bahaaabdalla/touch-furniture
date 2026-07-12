# Touch Furniture Catalog

Lightweight Arabic RTL furniture catalog with an invite-only admin panel, Supabase data/storage/auth, a Sharp image pipeline, and a self-contained sales demo.

## Requirements

- Node.js 22
- npm
- Docker only if you want the optional local Supabase stack
- A Supabase project for the real catalog

## Quick start — standalone demo

```bash
npm install
copy .env.example .env.local
npm run dev
```

Keep `CATALOG_MODE=demo`. The public catalog uses bundled fixtures and images and all `/admin` URLs return 404. No Supabase credentials are required.

Production checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build:demo
```

## Supabase setup

1. Create a new, isolated Supabase project. Do not point this repository at a database used by another application.
2. Copy `.env.example` to `.env.local` and set the project URL, publishable key, secret key, `SITE_URL`, and the future administrator's email.
3. Apply the migration and seed with the current Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

The migration creates the four catalog tables, RLS policies, explicit Data API grants, indexes, and both Storage buckets. The configured seed adds Touch Furniture and the six collections with twelve rooms.

4. Set `CATALOG_MODE=supabase` and run the asset/admin provisioning step:

```bash
npm run seed
```

This uploads the bundled WebP assets, rewrites seed image URLs to Supabase Storage, invites `ADMIN_EMAIL` if needed, and sets `app_metadata.role=admin`. The invite recipient chooses their password through Supabase's email flow. There is no public sign-up page.

5. In Supabase Authentication URL Configuration, set the production `SITE_URL` and add the preview URL when testing invitations.

## Image workflow

Admin uploads never pass through a large Vercel request body:

1. The browser validates JPEG/PNG/WebP and a 15MB maximum, then uploads to the private `catalog-raw` bucket under the current user's ID.
2. An authenticated Server Action verifies the admin claim and downloads the private object.
3. Sharp auto-rotates, smart-crops to 1600×1200, strips metadata, applies the active logo watermark, and exports WebP quality 82.
4. The processed immutable object is written to the public `catalog-images` bucket and the raw file is deleted.

Replacement logos accept PNG/WebP only and are normalized to a transparent 1024×1024 PNG. The original deterministic logo files are under `public/brand` in SVG and PNG formats.

## Vercel deployments

Use two Vercel projects connected to the same private GitHub repository:

### Demo project

Set:

```text
CATALOG_MODE=demo
SITE_URL=https://your-demo.vercel.app
```

No Supabase variables are needed. Build command: `npm run build:demo`.

### Real catalog project

Set `CATALOG_MODE=supabase`, `SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The secret key is not needed by the deployed runtime; keep it local for provisioning.

Use a preview deployment first, run the complete browser checks, then promote the exact verified artifact. Vercel Hobby is restricted to personal, non-commercial use, so a live showroom catalog requires a commercial-compatible Vercel plan. Never commit `.env.local` or place the Supabase secret key in a `NEXT_PUBLIC_*` variable.

## Data and security model

- Anonymous users can select only fully published activities, settings, collections, and rooms.
- Authenticated users receive no extra write ability unless their signed JWT contains `app_metadata.role=admin`.
- Proxy performs an early route redirect, but every protected layout/action verifies claims again and RLS remains authoritative.
- Descriptions are plain text; React escapes them. Admin fields and uploads have server validation.
- See [SECURITY.md](./SECURITY.md) for the concise review checklist.

## Receiving real showroom assets

Upload the real logo first, then add room images through Admin → Rooms. Every photo will pass through the same 1600×1200 watermarked template before it becomes public.
