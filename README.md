# CRO Audit Kit

> **Maintenance note (2026-08-10):** This kit is an export artifact of the live skills at `~/.claude/skills/`. The live `cro-site-audit` and `cro-opportunities-memo` migrated to the house deliverable system (white page, Helvetica/Arial, ink titles, impact ordering + Easy/Medium/Hard effort tags — no severity traffic lights, no DM Sans, no cream). The skill copies in here predate that migration. Regenerate from live before any release; don't hand-edit the copies here.

One slash command (`/cro`) that routes any CRO audit request to the right deliverable. Built for ecommerce operators who want a polished client-facing audit, an encouraging follow-up memo, or a quick internal teardown without remembering which skill does which.

## What's inside

- **`/cro` slash command** — asks 4 routing + context questions, then dispatches to the right downstream skill
- **`cro-site-audit` skill** — produces a polished landscape PDF report with severity-triaged findings. For cold leads and advanced operators.
- **`cro-opportunities-memo` skill** — produces a navy/orange DOCX framed as wins instead of problems. For beginner/intermediate clients who need encouragement plus direction.
- **`cro-audit` skill** — produces a quick markdown teardown in chat. For internal review with no client deliverable.

All three skills share one voice reference (`skills/cro-audit/references/voice.md`), apply a verification protocol (no claims about inventory, popups, promo codes, or dynamic modules without browser confirmation), include a mobile audit lens, and end with a structured A/B test handoff (3 hypotheses with KPI + expected lift + confidence).

## Install

**Claude Code**, two commands:

```
/plugin marketplace add jdcondie/cro-audit-kit
/plugin install cro-audit-kit
```

**Claude Cowork (Desktop):** Settings → Customize → + → Add Marketplace, paste
`https://github.com/jdcondie/cro-audit-kit`, then install `cro-audit-kit`.

For a local install without going through GitHub:

```
/plugin marketplace add /path/to/cro-audit-kit
/plugin install cro-audit-kit
```

## Going further

This kit is the free tier: 3 skills and the `/cro` command, enough to run a real
audit end to end.

The paid **CRO Pack** ($97) is the same workflow with 15 skills: PDP teardown,
mobile friction diagnostic, funnel leak hunt, CVR drop diagnosis, A/B result
interpretation, test prioritization, competitor conversion teardown, and a
client-ready opportunities memo. One `/cro` router across all of it.

Details at [jaycondie.com](https://jaycondie.com).

## Usage

```
/cro
/cro https://example.com
/cro https://example.com pdf
/cro https://example.com memo
/cro https://example.com quick
```

If you pass a URL alone, the command asks 4 questions before dispatching:

1. Client experience level (beginner / intermediate / advanced)
2. Relationship context (cold lead / existing client follow-up)
3. Business model + primary goal + prior tests
4. URL (if not already provided) or screenshot path

If you pass a deliverable hint (`pdf`, `memo`, `quick`), it skips intake and dispatches immediately.

## Updating across Claude Code, Claude Desktop, and Claude.ai

Filesystem skills + slash commands only work in Claude Code. Claude Desktop and Claude.ai have their own upload-based skills system. To keep all three in sync:

1. **Edit once.** Update `skills/cro-audit/references/voice.md` (the voice file is canonical) or any SKILL.md in the local clone.
2. **Build the zips.** Run `./build-zips.sh`. Produces three zips in `dist/`, one per skill, each self-contained (voice.md is propagated into the two non-source skills automatically).
3. **Push to git.** `git add . && git commit -m "..." && git push`.
4. **Per surface:**
   - **Claude Code** (each machine): `/plugin update cro-audit-kit`
   - **Claude Desktop**: Settings → Skills → Upload, drag in the relevant zip from `dist/`
   - **Claude.ai**: Settings → Capabilities → Skills → Upload, drag in the relevant zip

The `/cro` slash command only runs in Claude Code. In Claude Desktop and Claude.ai, trigger the skill by description: "Run a CRO audit on https://...". The description-matching layer routes to the right skill.

---

## Customizing

- **Voice rules:** edit `skills/cro-audit/references/voice.md` — all three skills inherit from this single source.
- **Sender / agency identity:** the PDF skill defaults to the placeholder "[YOUR AGENCY]" and email sign-offs use "Jason Condie." Search for these strings in `skills/cro-site-audit/SKILL.md` and replace with your own.

## Requirements

- Claude Code (the CLI). Skills don't run in the Claude Desktop app or Claude.ai web.
- `reportlab` for the PDF (`pip install reportlab --break-system-packages`)
- `docx` npm package for the DOCX (`npm install docx`)
- Optional: Chrome MCP for live-state verification of Tier B/C findings

## Version

1.0.0
