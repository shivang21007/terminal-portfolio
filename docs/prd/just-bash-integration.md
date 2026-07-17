# PRD: just-bash Hybrid Terminal Integration

| Field | Value |
|-------|-------|
| **Status** | Draft — review before implementation |
| **Author** | Shivang Gupta / AI-assisted |
| **Created** | 2026-06-08 |
| **Target branch** | `feature/just-bash-integration` (create after PRD approval) |
| **Primary deploy** | Cloudflare Pages (`shivanggupta.in`) |

---

## 1. Executive Summary

Upgrade the terminal portfolio from a **hand-coded command switch** to a **hybrid shell** powered by [just-bash](https://github.com/vercel-labs/just-bash): a client-side bash interpreter with a virtual filesystem. Visitors get a more authentic terminal experience (`grep`, pipes, `ls -la`, etc.) while portfolio highlights (`about`, `contact`, `projects`) keep their current rich React UI (ASCII art, clickable links).

The integration will be **lazy-loaded** after the boot sequence to limit impact on first paint. Implementation happens on a **separate feature branch** only after this PRD is approved.

---

## 2. Problem Statement

### Current state

Command handling lives in `src/components/terminal/CommandParser.ts` as a `switch` statement. Each command is faked:

- `ls` returns hardcoded filenames, not a real directory listing
- `cat` does a string lookup in `files` — no paths, globs, or pipes
- No support for `grep skills.txt`, `cat about.txt | head`, redirects, or env vars
- Maintaining shell-like behavior means manually implementing every command variant

### User pain

- Technical visitors (recruiters, DevOps peers) expect a terminal that *behaves* like bash
- The portfolio brand is “DevOps/SRE engineer” — a shallow fake shell undermines that story
- Expanding commands (e.g. `grep`, `find`, `history`) does not scale with a switch statement

### Opportunity

just-bash runs entirely in the browser (`just-bash/browser`), ships a virtual FS, and is used in production at [justbash.dev](https://justbash.dev). It fits a static Next.js export with no backend.

---

## 3. Goals

| # | Goal | Measurable outcome |
|---|------|-------------------|
| G1 | Real shell semantics for exploration commands | `ls`, `cat`, `grep`, `pwd`, `cd`, `echo`, pipes work via `bash.exec()` |
| G2 | Preserve portfolio UX for hero commands | `about`, `contact`, `projects` keep React components with links & ASCII art |
| G3 | Lazy-load shell runtime | just-bash not in critical path of initial JS bundle; load during/after boot |
| G4 | Single source of truth for content | Portfolio text still defined in `src/lib/constants.ts`, mounted into virtual FS |
| G5 | Static export compatibility | `npm run build` succeeds; deploys to Cloudflare Pages unchanged |
| G6 | Mobile layout preserved | No regression on 375px viewport (overflow/clipping fixes stay intact) |

---

## 4. Non-Goals (v1)

- **No AI agent command** (unlike justbash.dev’s `agent` + server SSE)
- **No network/curl** in the sandbox (no `network` config on `Bash`)
- **No Python / sqlite / js-exec** (browser-incompatible in just-bash)
- **No xterm.js** — keep existing custom React terminal UI
- **No server-side shell** — 100% client-side
- **No removal** of boot sequence or welcome ASCII art
- **No GitHub Pages re-enable** — Cloudflare Pages remains primary deploy

---

## 5. User Stories

### Visitor (recruiter / engineer)

1. As a visitor, I want to type `ls -la` and see a realistic directory listing so the portfolio feels like a real environment.
2. As a visitor, I want to run `grep Kubernetes skills.txt` to discover skills interactively.
3. As a visitor, I want `contact` to show clickable email/phone/LinkedIn links on mobile and desktop.
4. As a visitor, I want `projects` to show Live demo links I can tap without copying URLs.
5. As a visitor, I want the site to load quickly on mobile even with the shell engine added.

### Owner (Shivang)

1. As the owner, I want to update resume content in one place (`constants.ts`) and have both virtual files and custom commands reflect it.
2. As the owner, I want the feature isolated on a branch until I’m satisfied with behavior and bundle size.
3. As the owner, I want deploy workflows to keep working without new secrets or infra.

---

## 6. Proposed Solution: Hybrid Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (Next.js static export, client components)        │
├─────────────────────────────────────────────────────────────┤
│  BootSequence → WelcomeMessage → Terminal (React UI)         │
│       │                                                      │
│       └── lazy import("just-bash/browser")                   │
│                    │                                         │
│                    ▼                                         │
│            Bash instance                                     │
│            ├── InMemoryFs (from constants.ts files)          │
│            ├── env: USER, HOSTNAME, HOME                     │
│            ├── cwd: /home/shivang                            │
│            └── customCommands: [help, reset?] (optional)     │
│                                                              │
│  Command routing in Terminal.tsx:                            │
│    about | contact | projects  →  React rich components      │
│    clear | reset               →  existing handlers          │
│    everything else             →  await bash.exec(input)     │
└─────────────────────────────────────────────────────────────┘
```

### Command routing matrix

| Input pattern | Handler | Output type |
|---------------|---------|-------------|
| `about`, `cat about.txt` | `AboutOutput` (React) | ASCII art + text |
| `contact`, `cat contact.txt` | `ContactOutput` (React) | Clickable links |
| `projects`, `cat projects.txt` | `ProjectsOutput` (React) | Live demo links |
| `clear` | Local state | Clears history |
| `reset` | `window.location.reload()` | Full reload |
| `help` | Custom or `bash.exec` | Text menu (update for new capabilities) |
| `ls`, `cat`, `grep`, `pwd`, `cd`, pipes, etc. | `bash.exec()` | stdout/stderr strings |
| Unknown (post just-bash) | `bash.exec()` | Real `command not found` from shell |

### Virtual filesystem layout

```
/home/shivang/
  about.txt      ← files["about.txt"] from constants.ts
  skills.txt
  projects.txt
  contact.txt
```

Environment:

```typescript
env: {
  USER: "shivang",
  HOSTNAME: "shivanggupta.in",
  HOME: "/home/shivang",
}
cwd: "/home/shivang"
```

---

## 7. Technical Design

### 7.1 New / modified files (planned)

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Add dep | `just-bash@^3.0.1` |
| `src/lib/bash.ts` | **New** | Factory: build `Bash` from `constants.ts`, lazy singleton |
| `src/components/terminal/CommandParser.ts` | Modify or slim | Fallback / sync helpers; rich-command detection |
| `src/components/terminal/Terminal.tsx` | Modify | Async exec, loading state, route rich vs bash commands |
| `src/components/terminal/BootSequence.tsx` | Optional | Trigger preload of just-bash during boot animation |
| `next.config.ts` | Review | May need `transpilePackages` or webpack tweaks for browser bundle |
| `docs/prd/just-bash-integration.md` | This file | PRD |
| `AGENTS.md` | **New** | Project context for agents |

### 7.2 Lazy load strategy

```typescript
// Pseudocode — not implemented yet
let bashPromise: Promise<Bash> | null = null;

export function getBash() {
  if (!bashPromise) {
    bashPromise = import("just-bash/browser").then(({ Bash }) =>
      new Bash({ files: buildVirtualFiles(), env: {...}, cwd: "/home/shivang" })
    );
  }
  return bashPromise;
}
```

- Start loading when `Terminal` mounts or during `BootSequence`
- Show subtle status if user submits before ready: `Loading shell...`
- Do **not** block boot animation on download completion

### 7.3 Async command execution

`bash.exec()` returns `Promise<{ stdout, stderr, exitCode }>`. `Terminal.tsx` today is synchronous. Changes needed:

- `handleCommand` becomes `async`
- History items may show a brief pending state (optional)
- Preserve arrow-up/down history behavior
- `scrollIntoView({ inline: "nearest" })` — keep mobile fix

### 7.4 Help text update

`help` should document both:

- Portfolio shortcuts: `about`, `skills`, `projects`, `contact`
- Shell exploration: `ls`, `cat`, `grep`, `pwd`, `cd`, pipes

Example addition:

```
  grep <pattern> <file>  → Search file contents
  cat <file> | head      → Pipe output
```

### 7.5 Deprecations / removals

Commands currently faked in `CommandParser.ts` that **just-bash provides natively** (can delegate):

- `ls`, `cat`, `pwd`, `whoami`, `hostname`, `echo` (if not overridden)

Commands to **keep custom** or **drop**:

| Command | Decision |
|---------|----------|
| `ps`, `df`, `ifconfig` | v1: keep fake via custom command OR drop if not needed |
| `top`, `htop` | Keep easter-egg message or remove |
| `uname`, `id` | Optional custom command for branded output |

*Open for review in §12.*

---

## 8. Dependencies & Bundle Impact

| Package | Size (approx.) | Notes |
|---------|----------------|-------|
| `just-bash` browser bundle | ~500KB–1MB+ gzipped (estimate) | Pre-bundled `dist/bundle/browser.js` |
| Current app | Small (Next + React only) | Baseline is very lean |

### Mitigations

1. Dynamic `import()` — separate chunk
2. Measure with `npm run build` + analyze bundle (Next experimental or `@next/bundle-analyzer`)
3. Accept tradeoff: authenticity vs. bundle size for a DevOps portfolio
4. Set performance budget: e.g. LCP < 2.5s on 4G after lazy load

### Browser support

- Target: same as Next.js 16 defaults (modern evergreen browsers)
- just-bash core shell works in browser; no WASM runtimes needed for base commands

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Bundle too large for mobile | Medium | High | Lazy load; measure before merge; show load indicator |
| Next static export breaks on just-bash import | Low | High | Test build early on feature branch |
| Rich commands bypassed via `cat contact.txt` | Medium | Low | Route `cat contact.txt` to `ContactOutput` (already partially done for about) |
| `bash.exec` errors confuse users | Low | Medium | Surface `stderr` in red; keep friendly `help` |
| just-bash beta bugs | Medium | Medium | Pin version; test command matrix; fallback to CommandParser |
| Session state (`cd`) confuses visitors | Low | Low | Document in `help`; optional `reset` clears shell state |

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Build passes | `npm run build` green on feature branch |
| Core commands work | `ls`, `cat skills.txt`, `grep K8s skills.txt`, `pwd`, `echo $USER` |
| Rich commands unchanged | `contact` / `projects` links clickable |
| Mobile 375px | No horizontal overflow (manual + browser test) |
| Bundle chunk | Document actual just-bash chunk size in PR description |
| Lighthouse performance | No more than 10-point drop vs. main (optional) |

---

## 11. Implementation Phases

### Phase 0 — Planning (current)

- [x] PRD written
- [x] `AGENTS.md` project context
- [ ] PRD reviewed and approved by Shivang

### Phase 1 — Branch & scaffold

- [ ] Create `feature/just-bash-integration`
- [ ] Add `just-bash` dependency
- [ ] Add `src/lib/bash.ts` factory
- [ ] Verify `npm run build`

### Phase 2 — Core integration

- [ ] Lazy load in `Terminal.tsx`
- [ ] Wire `bash.exec` for generic commands
- [ ] Mount virtual FS from `constants.ts`
- [ ] Update `help` text

### Phase 3 — Polish

- [ ] Loading state during shell init
- [ ] Command matrix manual testing
- [ ] Mobile regression pass
- [ ] Bundle size report in PR

### Phase 4 — Review & merge

- [ ] PR to `main`
- [ ] Deploy to Cloudflare Pages
- [ ] Smoke test production URL

---

## 12. Open Questions (for PRD review)

1. **`ps` / `df` / `ifconfig` / `uname` / `id`** — keep branded fake output via `defineCommand`, or remove and rely only on real bash builtins?
2. **`skills` command** — keep as shortcut to print file, or only `cat skills.txt`?
3. **Shell persistence** — should `cd` and env changes persist across commands? (just-bash: FS shared, per-exec env/cwd reset by default — may need config review)
4. **Fallback** — if just-bash fails to load, fall back to `CommandParser.ts` or show error?
5. **Analytics** — track which commands visitors run? (out of scope unless requested)
6. **Performance budget** — acceptable max download size for shell chunk?

---

## 13. References

- [just-bash repo](https://github.com/vercel-labs/just-bash)
- [just-bash package README](https://github.com/vercel-labs/just-bash/tree/main/packages/just-bash)
- [justbash.dev example website](https://github.com/vercel-labs/just-bash/tree/main/examples/website)
- Project context: `AGENTS.md`
- Content source: `src/lib/constants.ts`

---

## 14. Approval

| Reviewer | Decision | Date |
|----------|----------|------|
| Shivang Gupta | ☐ Approved  ☐ Changes requested | |

**After approval:** create branch `feature/just-bash-integration` and begin Phase 1.
