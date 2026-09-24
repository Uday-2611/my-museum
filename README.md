# My Museum

A personal, image-first museum. Public visitors enter rooms and browse objects; one administrator maintains the collection in `/studio`.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Neon PostgreSQL, Drizzle ORM, Better Auth email OTP, Vercel Blob and Resend.

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local`. Set a Neon `DATABASE_URL`, a random `BETTER_AUTH_SECRET` of at least 32 characters, `BETTER_AUTH_URL` to your local origin, a Vercel `BLOB_READ_WRITE_TOKEN`, and `RESEND_API_KEY`. The default sender `onboarding@resend.dev` is for Resend's testing restrictions; use `OTP_FROM_EMAIL` with a verified domain for broader production delivery.
3. Run `npm run db:migrate`.
4. Run `npm run db:seed` for the three removable demo rooms.
5. Run `npm run admin:create` to create the single authorized account, `udayagarwal234@gmail.com`.
6. Run `npm run dev` and visit `/studio/login`.

Without `DATABASE_URL`, the public site displays local demo data. Studio sign-in is unavailable until the database and Resend credentials are configured.

## Deployment

Provision Neon, Vercel Blob, and Resend for the deployment, set the variables from `.env.example`, and set `BETTER_AUTH_URL` to the production origin (or let the app derive it from `VERCEL_URL`). Run the Drizzle migration before opening Studio. Seed is optional in production. Create the administrator once with `npm run admin:create` against the same database.

The schema contains only `rooms`, `artworks`, and the four Better Auth tables. Objects use a fixed small / medium / large / full size system. Uploaded images are stored in Vercel Blob; the database stores their public URL and intrinsic dimensions. Public reads happen server side. Every Studio mutation and upload token request checks the signed-in account against the sole authorized email. Other email addresses are rejected before an OTP can be sent. Codes are six digits, expire in five minutes, and are stored hashed with attempt and request limits.

## Notes

- The seed artwork is self-contained SVG placeholder art in `public/demo`. Delete the demo rooms in Studio when your own collection is ready.
- Rooms and objects can be dragged with a pointer or reordered with a keyboard on a focused drag handle.
- Deleting a room also deletes its database objects and uploaded Blob images.
