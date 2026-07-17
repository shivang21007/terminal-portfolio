# AGENTS.md — Terminal Portfolio

Context for AI agents and future contributors. Read this before making changes.

## What this project is

A **static, terminal-themed developer portfolio** for **Shivang Gupta** (DevOps & Site Reliability Engineer). Visitors interact via a fake Linux terminal in the browser — typing commands to view about, skills, projects, and contact info.

**Live deploy:** Cloudflare Pages → `https://shivanggupta.in`  
**Repo:** `terminal-portfolio` (GitHub: `shivang21007`)

**End goal:** A memorable, on-brand portfolio that feels like a real shell for technical visitors, while staying fast, mobile-friendly, and easy to update from resume data.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Font | IBM Plex Mono |
| Build | Static export (`output: "export"`, `distDir: "dist"`) |
| Deploy | **Cloudflare Pages** (active) via GitHub Actions + Wrangler |
| Alt deploy | GitHub Pages workflow exists but **disabled** (`if: false`) |

No backend, database, or API routes. Everything runs client-side.

---

## Repository map

```
src/
  app/
    layout.tsx          # Metadata, IBM Plex Mono font
    page.tsx            # Renders <Terminal />
    globals.css         # Base styles, overflow-x fix for mobile
  components/terminal/
    Terminal.tsx        # Main UI: history, input, rich command outputs
    CommandParser.ts    # Sync switch-based command execution (to be hybridized)
    BootSequence.tsx    # Fake boot logs on first load
    WelcomeMessage.tsx  # ASCII name art + intro text
    ProcessSimulator.ts # Fake `ps` output
  lib/
    constants.ts        # SINGLE SOURCE OF TRUTH: profile, files, projects, URLs
docs/
  prd/
    just-bash-integration.md   # PRD for planned shell upgrade (not implemented yet)
.github/workflows/
  deploy-cloudflare-pages.yml    # Active: push to main when src/** changes
  deploy-github-pages.yml        # Disabled
next.config.ts          # basePath for gh-pages; empty for Cloudflare
```

---

## How the terminal works today

### Flow

1. `BootSequence` plays ~3s of fake kernel logs → sets `booted=true`
2. `WelcomeMessage` shows ASCII “Shivang” art + “type help” hint
3. User types in `<input>`; `Terminal.tsx` dispatches to:
   - **Rich React outputs** for `about`, `contact`, `projects` (and `cat about.txt`)
   - **`executeCommand()`** in `CommandParser.ts` for everything else

### Prompt

`shivang@shivanggupta.in:~$` — colors: user=yellow, host=green

### Commands (current)

| Command | Implementation |
|---------|----------------|
| `help` | Static string in CommandParser |
| `about`, `skills`, `projects`, `contact` | `files` in constants.ts |
| `ls` | `Object.keys(files)` |
| `cat <file>` | Lookup in `files` |
| `whoami`, `hostname` | `USER`, `HOSTNAME` from constants |
| `ps` | `ProcessSimulator.generateProcesses()` |
| `df`, `ifconfig` | Hardcoded strings |
| `clear` | Clears React history state |
| `reset` | `window.location.reload()` |
| `pwd`, `uname`, `id` | Hardcoded Linux-flavored strings |

### Rich outputs (important — do not break)

- **`AboutOutput`** — ASCII art + `about.txt` text
- **`ContactOutput`** — clickable `mailto:`, `tel:`, website, LinkedIn, GitHub
- **`ProjectsOutput`** — project titles + clickable **Live** links

These use React `<a>` tags. Plain stdout from a shell cannot replicate this without keeping the hybrid routing.

---

## Content model

All portfolio text lives in **`src/lib/constants.ts`**:

- `files` — `about.txt`, `skills.txt`, `projects.txt`, `contact.txt`
- `projects` — structured array (title, liveUrl, bullets) for `ProjectsOutput`
- Contact URLs: `LinkedIn`, `GitHub`, `Email`, `Phone`, `Website`, `LiveDemoUrl`
- Identity: `USER`, `HOSTNAME`, `ROLE`, `COMPANY`, `LOCATION`

**To update resume info:** edit `constants.ts` only. Do not duplicate content in components.

---

## Deployment

### Cloudflare Pages (production)

- Workflow: `.github/workflows/deploy-cloudflare-pages.yml`
- Triggers: push to `main` when `src/**` changes
- `DEPLOY_TARGET=cloudflare-pages` → no `basePath`
- Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Concurrency: `cancel-in-progress: true` per workflow+branch

### GitHub Pages (disabled)

- File kept at `.github/workflows/deploy-github-pages.yml`
- `if: false` on job; push trigger commented out
- Re-enable only if needed later

### Local dev

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # outputs to dist/
```

---

## Mobile / UX constraints

Recent fixes (preserve when changing Terminal):

- `globals.css`: no universal `* { margin: 2 }` — breaks Tailwind padding
- Responsive text: `text-xs sm:text-sm md:text-base`
- ASCII art scales down on small screens (`text-[10px]` on mobile)
- `flex-wrap`, `break-all` / `break-words` on long URLs
- `scrollIntoView({ inline: "nearest" })` — prevents horizontal scroll jump
- `min-h-dvh` / `h-dvh` for mobile viewport height

Test at **375px width** after UI changes.

---

## Coding conventions

- **Client components** for terminal (`"use client"`)
- **Minimal scope** — small diffs, match existing style
- **No commits** unless user explicitly asks
- **No new markdown docs** unless requested (PRD/AGENTS were explicitly requested)
- Static export: avoid Node-only APIs in client code; no `getServerSideProps`

---

## Planned feature: just-bash integration

**Status:** PRD only — **not implemented on `main`**

See **`docs/prd/just-bash-integration.md`** for full spec.

Summary:

- Add [just-bash](https://github.com/vercel-labs/just-bash) (`just-bash/browser`) for real `ls`, `cat`, `grep`, pipes
- Lazy-load after boot; mount `constants.ts` files into virtual FS at `/home/shivang/`
- **Keep** React rich outputs for `about`, `contact`, `projects`
- Implement on branch `feature/just-bash-integration` after PRD approval

---

## Common tasks

| Task | Where to change |
|------|-----------------|
| Update resume / contact | `src/lib/constants.ts` |
| Add a fake command | `CommandParser.ts` + `help` text |
| Change welcome / ASCII art | `WelcomeMessage.tsx` |
| Change page title/SEO | `src/app/layout.tsx` |
| Fix mobile layout | `Terminal.tsx`, `globals.css`, `WelcomeMessage.tsx` |
| Deploy config | `.github/workflows/deploy-cloudflare-pages.yml`, `next.config.ts` |

---

## What not to do

- Do not enable GitHub Pages workflow without explicit request
- Do not add a backend or API routes (static export project)
- Do not remove clickable links from `contact` / `projects` without replacement
- Do not commit `.wrangler/` cache (gitignored)
- Do not force-push `main`
