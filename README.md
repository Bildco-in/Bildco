# Bildco landing page

Next.js 15 + Tailwind v4. Single page at `app/page.tsx`.

- Business values (phones, price, booking link, widget): `lib/site.ts`. Blank values hide or fall back to email.
- Values still needed: `placeholders.txt`.
- Language sample audio: `public/audio/{telugu,hindi,english,hinglish}.mp3` (picked up at build time).

```
pnpm dev        # http://localhost:3000
pnpm build
pnpm typecheck && pnpm lint && pnpm test
```
