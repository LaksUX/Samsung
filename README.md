# Sales Board — Samsung Karnataka Dashboard

A Next.js dashboard (light theme), currently running on deterministic dummy data
matching the real "Model Wise Dash Board" sheet structure. Built with real
shadcn/ui components (Card, Tabs, Badge, Sheet, Separator) on Radix primitives,
plus an AI chat panel grounded in the dashboard's own data.

**Note on shadcn/ui**: these components were hand-assembled from the same
Radix primitives + Tailwind patterns the shadcn CLI generates, since the CLI's
registry (ui.shadcn.com) wasn't reachable from the build environment. The
result is functionally identical — real Radix-based Tabs/Sheet/etc., not a
visual mockup. `components/ui/*` is yours to edit or replace directly if you
ever do run the CLI yourself.

## Setting up the AI chat
The chat (bottom-right sparkle button) calls `/api/chat`, which uses the
Anthropic API. It needs one environment variable:

1. Get an API key at **console.anthropic.com**
2. In your Vercel project → Settings → Environment Variables, add:
   `ANTHROPIC_API_KEY = <your key>`
3. Redeploy (Vercel → Deployments → ⋯ → Redeploy)

Without this variable, the dashboard itself works fine — only the chat panel
will show a setup message instead of answering.

## Deploy — GitHub + Vercel (about 5 minutes)

### 1. Push this to a new GitHub repo
```bash
cd sales-board-vercel
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/sales-board.git
git push -u origin main
```
(Create the empty repo first at github.com/new — don't initialize it with a README, so the push doesn't conflict.)

### 2. Import into Vercel
1. Go to vercel.com/new
2. Click "Import" next to your `sales-board` repo (Vercel auto-detects Next.js)
3. Leave all settings as default and click **Deploy**
4. In ~60 seconds you'll get a live URL like `sales-board-yourname.vercel.app`

That's it — no environment variables or config needed for this dummy-data version.

## Local development
```bash
npm install
npm run dev
```
Then open http://localhost:3000

## Project structure
- `app/page.js` — the entire dashboard (data + UI in one file for easy handoff)
- `app/layout.js` — root layout, fonts, page metadata
- `app/globals.css` — Tailwind + font imports
- `tailwind.config.js` — the light-theme color tokens (ink, accent, good, bad, etc.)

## Next steps when you're ready for real data
Replace the `DATA` array generation (top of `app/page.js`) with a real fetch —
either a Google Sheets API call in a server component, or an API route under
`app/api/`. Everything downstream (charts, toggles, formatting) is already
wired to read from that same `DATA` array, so the UI won't need to change.
