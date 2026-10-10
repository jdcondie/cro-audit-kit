---
description: Run a CRO audit. Asks routing + context questions (audience, relationship, business model, primary goal, prior tests), then dispatches to the right deliverable (PDF audit, DOCX opportunities memo, or quick markdown teardown).
---

# /cro — CRO Audit Router

You are running the CRO audit router. The user typed `/cro` because they want a CRO audit but don't want to remember which downstream skill to invoke. Your job is to ask the routing questions, then run the right skill.

## What the user passed in

`$ARGUMENTS`

If the arguments contain a URL, capture it. If they don't, ask for one as part of the intake.

## Step 1 — Check for explicit deliverable hints

Scan `$ARGUMENTS` for explicit deliverable keywords. If found, skip intake and dispatch directly:

| Keyword in arguments | Route to |
|---|---|
| "pdf," "polished," "client-ready," "report" | invoke `cro-site-audit` skill |
| "memo," "wins," "encouraging," "friendly," "beginner" | invoke `cro-opportunities-memo` skill |
| "quick," "internal," "markdown," "teardown" | invoke `cro-audit` skill (Step 4 markdown mode) |

Otherwise, run intake.

## Step 2 — Intake (ask in one message)

Ask the user, in a single message:

1. **Client experience level?** Beginner / intermediate / advanced ecom operator
2. **Relationship context?** Cold lead / first-impression, or existing client / follow-up
3. **Business model + primary goal + prior tests?** One combined question. Examples to suggest in the prompt:
   - "DTC ecom, want to lift CVR on mobile, already shipped a new hero last month"
   - "Local service, primary goal is more booked calls, no prior testing"
   - "SaaS pricing page, want to lift trial conversion, tried 2 variants on the headline already"
4. **URL** (if not provided in arguments). Or a screenshot path if the site is JS-heavy or login-gated.

Wait for the answer. Do not fetch anything yet.

Capture all of this context. Pass it to the downstream skill as part of dispatch so the audit runs with the right business model, goal lens, and awareness of what's already been tested.

## Step 3 — Route

Apply this decision matrix:

| Experience | Context | Skill to invoke |
|---|---|---|
| Advanced | Any | `cro-site-audit` (PDF) |
| Any | Cold lead / first-impression | `cro-site-audit` (PDF) |
| Beginner / intermediate | Existing client / follow-up | `cro-opportunities-memo` (DOCX) |
| Any | Internal use, no client | `cro-audit` (markdown mode) |

**Tie-breakers:**
- Intermediate + cold lead → `cro-site-audit`. Polished beats encouraging when there's no relationship yet.
- Advanced + follow-up → `cro-site-audit`. Advanced operators want sparring partner energy.
- Ambiguous → default to `cro-site-audit`.

## Step 4 — Dispatch

Confirm the route in one sentence: "Running [skill name] — [deliverable format]."

Then invoke the chosen skill via the Skill tool. Pass along:
- URL or screenshot path
- Client experience level (beginner / intermediate / advanced)
- Relationship context (cold lead / follow-up)
- Business model (DTC ecom / local service / SaaS / info product)
- Primary goal (CVR / AOV / mobile / checkout / first-purchase / booked calls / trial conversion / etc.)
- Prior tests / what's already shipped

Follow the downstream skill's instructions exactly. Do not duplicate its diagnostic work here. All three downstream skills read voice rules from `references/voice.md` — they do not need to be re-explained.

## Shared core + kit

Before dispatching, load `${CLAUDE_PLUGIN_ROOT}/skills/cro-audit/references/core.md`. It carries the CRO diagnosis stance, the standard findings, the shared guardrails (`skills/cro-audit/references/guardrails.md`), and the **deep-dive handoff table** (5-second-cro (not included in this kit), pdp-teardown (not included in this kit), mobile-friction-diagnostic (not included in this kit), checkout-dropoff-analysis (not included in this kit), funnel-leak-detection (not included in this kit), heatmap-pattern-decoder (not included in this kit), session-recording-analyzer (not included in this kit), pricing-psychology-scanner (not included in this kit), urgency-scarcity-audit (not included in this kit), competitor-conversion-teardown (not included in this kit), and more). On a deep audit, or when the user wants more on one area, hand that section to its specialist instead of going deeper inline.


**Length:** if the user hasn't said, ask tight (the highest-leverage findings only) vs full (every section + the relevant deep-dives). Default tight for a quick check, full for a client deliverable.
