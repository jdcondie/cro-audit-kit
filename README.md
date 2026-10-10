# CRO Audit Kit

One slash command (`/cro`) that routes any CRO audit request to the right deliverable. Built for ecommerce operators who want a polished client-facing audit, an encouraging follow-up memo, or a quick internal teardown without remembering which skill does which.

## What's inside

- **`/cro` slash command** — asks 4 routing + context questions, then dispatches to the right downstream skill
- **`cro-site-audit` skill** — produces a polished landscape PDF report with findings ranked by impact. For cold leads and advanced operators.
- **`cro-opportunities-memo` skill** — produces a clean white DOCX with an oxblood accent, framed as wins instead of problems. For beginner/intermediate clients who need encouragement plus direction.
- **`cro-audit` skill** — produces a quick markdown teardown in chat. For internal review with no client deliverable.

All three skills share one set of references (CRO voice, client register, guardrails, and the diagnosis core in `skills/cro-audit/references/`), apply a verification protocol (no claims about inventory, popups, promo codes, or dynamic modules without browser confirmation), include a mobile audit lens, and end with a structured A/B test handoff (3 hypotheses with KPI + expected lift + confidence).

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

The paid **DTC Growth System** ($247) includes this whole workflow plus the
deep-dive skills it hands off to: PDP teardown, mobile friction, funnel leaks,
conversion drops, checkout drop-off, A/B result interpretation, test
prioritization and competitor teardowns. It also covers paid ads, Shopify and
testing: 50 skills in one install, with `/cro` routing across all of it.

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

1. **Edit once.** Update the shared files in `skills/cro-audit/references/` (canonical) or any SKILL.md in the local clone.
2. **Build the zips.** Run `./build-zips.sh`. Produces three zips in `dist/`, one per skill, each self-contained (the shared references are copied into the other two skills automatically).
3. **Push to git.** `git add . && git commit -m "..." && git push`.
4. **Per surface:**
   - **Claude Code** (each machine): `/plugin update cro-audit-kit`
   - **Claude Desktop**: Settings → Skills → Upload, drag in the relevant zip from `dist/`
   - **Claude.ai**: Settings → Capabilities → Skills → Upload, drag in the relevant zip

The `/cro` slash command only runs in Claude Code. In Claude Desktop and Claude.ai, trigger the skill by description: "Run a CRO audit on https://...". The description-matching layer routes to the right skill.

---

## Customizing

- **Voice rules:** edit `skills/cro-audit/references/voice.md` (CRO voice) and `audit-voice.md` (client register), then run `./build-zips.sh` to copy them into the other skills.
- **Agency name:** set `brand.agency` in `skills/cro-opportunities-memo/references/tokens.js` (it defaults to "[AGENCY]"). The PDF skill takes an `agency_name` input.
- **Your name:** the delivery email templates use `[YOUR NAME]` and `[YOUR FIRST NAME]`. Replace them with your own.

## Requirements

- Claude Code (the CLI). Skills don't run in the Claude Desktop app or Claude.ai web.
- `reportlab` for the PDF (`pip install reportlab --break-system-packages`)
- `docx` npm package for the DOCX (`npm install docx`). The memo builds through the bundled `references/client-theme.js` and `tokens.js`.
- Optional: Chrome MCP for live-state verification of Tier B/C findings

## Version

1.1.0 (regenerated from the live skills, October 2026)
