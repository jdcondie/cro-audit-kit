# CRO Audit Kit

One slash command (`/cro`) that routes any CRO audit request to the right deliverable. Built for ecommerce operators who want a polished client-facing audit, an encouraging follow-up memo, or a quick internal teardown without remembering which skill does which.

## What's inside

- **`/cro` slash command** — asks 4 routing + context questions, then dispatches to the right downstream skill
- **`cro-site-audit` skill** — produces a polished landscape PDF report with severity-triaged findings. For cold leads and advanced operators.
- **`cro-opportunities-memo` skill** — produces a navy/orange DOCX framed as wins instead of problems. For beginner/intermediate clients who need encouragement plus direction.
- **`cro-audit` skill** — produces a quick markdown teardown in chat. For internal review with no client deliverable.

All three skills share one voice reference (`skills/cro-audit/references/voice.md`), apply a verification protocol (no claims about inventory, popups, promo codes, or dynamic modules without browser confirmation), include a mobile audit lens, and end with a structured A/B test handoff (3 hypotheses with KPI + expected lift + confidence).

## Install

Two commands inside Claude Code:

```
/plugin marketplace add jdcondie/cro-audit-kit
/plugin install cro-audit-kit
```

Replace `jdcondie/cro-audit-kit` with the actual git path once you've pushed this folder to a repo.

For local install without a git repo:

```
/plugin marketplace add /path/to/cro-audit-kit
/plugin install cro-audit-kit
```

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

## Customizing

- **Voice rules:** edit `skills/cro-audit/references/voice.md` — all three skills inherit from this single source.
- **Sender / agency identity:** the PDF skill defaults to "Matix Labs" and email sign-offs use "Jason Condie." Search for these strings in `skills/cro-site-audit/SKILL.md` and replace with your own.

## Requirements

- Claude Code (the CLI). Skills don't run in the Claude Desktop app or Claude.ai web.
- `reportlab` for the PDF (`pip install reportlab --break-system-packages`)
- `docx` npm package for the DOCX (`npm install docx`)
- Optional: Chrome MCP for live-state verification of Tier B/C findings

## Version

1.0.0
