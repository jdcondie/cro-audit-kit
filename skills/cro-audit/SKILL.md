---
name: cro-audit
description: >
  Router skill for CRO audits. Use whenever the user asks for a CRO audit,
  conversion audit, site audit, or page teardown without specifying the
  deliverable format. Trigger on: "CRO audit," "conversion audit," "audit
  this site," "audit this page," "site teardown," "review this site." Asks
  four intake questions to determine which downstream skill to run:
  cro-site-audit (polished PDF for cold leads + advanced operators),
  cro-opportunities-memo (DOCX win-framed for beginner/intermediate clients),
  or an inline markdown teardown (quick internal review, no client
  deliverable). If the user explicitly names the deliverable ("opportunities
  memo," "PDF audit"), route directly to that skill instead of running intake.
  Carries trust and CTA checklists (references/page-checklists.md) and a
  "what this audit can't tell you" footer for the markdown mode.
---

# CRO Audit Router

Front door for any CRO audit request. Four questions in, one of three deliverables out. The intake matches the `/cro` command.

---

## Step 1 — Decide Whether to Run Intake

**Skip intake and dispatch directly** if the user's request explicitly names the deliverable:

| Phrase the user used | Route to |
|---|---|
| "opportunities memo," "ranked wins," "encouraging audit," "friendly memo" | cro-opportunities-memo |
| "PDF audit," "client-ready audit," "polished teardown," "site audit report" | cro-site-audit |
| "quick teardown," "markdown audit," "no PDF needed," "internal review" | inline markdown (Step 4 below) |

Otherwise, run intake.

---

## Step 2 — Intake (ask all four questions in one message)

Ask the user:

1. **Client experience level** — beginner, intermediate, or advanced ecom operator?
2. **Relationship context** — cold lead / first-impression deliverable, or existing client / follow-up?
3. **Business model + primary goal + prior tests.** One combined question. Example answers to suggest: "DTC ecom, want to lift CVR on mobile, already shipped a new hero last month." "Local service, primary goal is more booked calls, no prior testing."
4. **URL**, if it wasn't already given. A screenshot path works if the site is JS-heavy or login-gated.

If the URL doesn't make it obvious, you can also ask whether scope is homepage only or the full site.

Wait for the answer before doing anything else. Do not fetch the URL yet. Pass the business model, goal, and prior tests to the downstream skill along with the route.

---

## Step 3 — Route

| Experience | Context | Skill |
|---|---|---|
| Advanced | Any | cro-site-audit (PDF) |
| Any | Cold lead / first-impression | cro-site-audit (PDF) |
| Beginner / intermediate | Existing client / follow-up | cro-opportunities-memo (DOCX) |
| Any | Internal use, no client handoff | inline markdown (Step 4 below) |

**Tie-breakers:**
- Intermediate + cold lead → cro-site-audit. Polished beats encouraging when there's no relationship yet.
- Advanced + follow-up → cro-site-audit. Advanced operators want sparring partner energy, not win-framing.
- If still ambiguous, default to cro-site-audit.

Once routed, invoke the downstream skill and follow its instructions exactly. Do not duplicate its diagnostic work here. Confirm the route in one sentence ("Running cro-site-audit — PDF deliverable.") before invoking.

---

## Step 4 — Inline Markdown Teardown (only when Step 3 routes here)

Use this output mode when the user wants a quick internal review with no client deliverable.

### Voice

All voice rules live in `references/voice.md` (this skill's own references folder). Apply universal rules. Markdown teardowns are internal-use, so default to the intermediate tone calibration. Skip the beginner decoding step.

### Source-of-Truth Tiers (read before fetching)

`web_fetch` returns the server-rendered HTML of a page. It does NOT see anything JavaScript renders after page load. Modern Shopify and headless storefronts use JavaScript for inventory state, popups, dynamic upsell modules, promo banners loaded via apps, A/B-tested heroes, personalization blocks, and cart widgets. Treating static HTML as live state causes client-facing misses.

**Tier A — Safe to claim from web_fetch alone:** hero copy, headlines, CTAs, section headings, nav labels, footer copy, image alt text, meta tags, URL structure, static text blocks, whether a page exists at a URL, sitewide structural choices.

**Tier B — Requires live verification:** whether an element actually displays to a real user, trust strip placement, whether a popup fires, active promo banners, above-the-fold visibility, header rotation logic. Before claiming, either re-fetch and ask the user to spot-check, OR use Chrome MCP.

**Tier C — Forbidden without browser confirmation:** inventory state, specific promo codes, active discount status, popup presence/behavior, dynamic upsell module contents (Rebuy, Bold, Recharge, ReConvert), A/B variants, personalization blocks, email capture popup behavior, cart drawer contents. Drop the finding or escalate to Tier B.

### Fetch and Diagnose

Use `web_fetch` on the provided URL. Apply the tier system above. Do not generate any Tier C finding from web_fetch alone.

Evaluate against 7 dimensions: Hero clarity, Product/Service pages, Catalog/Coverage, Social proof, Email capture / lead form, Trust + guarantee, and **Mobile experience** (thumb reach, sticky CTA, mobile menu, scroll length, mobile fold trust).

For the trust and CTA passes, work from the checklists in `references/page-checklists.md`.

### Verification Pass (mandatory before output)

For Tier B and C signals, emit this checklist to the user in one message:

```
Before I finalize the teardown, can you confirm these in your browser (~60 seconds):

1. [Specific thing]
2. [Specific thing]
3. [Specific thing]
4. [Specific thing]
5. [Specific thing]

Reply with yes/no/notes. I'll fold the answers in.
```

If the user skips verification, ship Tier A findings only and flag the gap.

### Output Template

Fill in the template below. Keep it tight — this is for internal use, not a client.

```
# **[Brand Name] | CRO Audit**

[1-2 sentence summary: what's working vs where conversion is leaking. Name the key friction point.]

### **The Focus**

- **[Goal 1]** — [short rationale]
- **[Goal 2]** — [short rationale]
- **[Goal 3]** — [short rationale]

## **Hero Section**

**Current State:** [Short sentence on the friction or issue.]

**Opportunities:**
- [Tactical suggestion with inline explanation]
- [Tactical suggestion]
- [Tactical suggestion]

**Why It Matters:** [What this change unlocks behaviorally or for conversion.]

## **[Product Pages / Service Pages]**

**Current State:** [Description of current setup and its limitations.]

**Opportunities:**
- [Tactic 1]
- [Tactic 2]
- [Tactic 3]

**Why It Matters:** [Trust/clarity/simplicity benefit.]

## **[Collection Pages / Service Area & Coverage]**

**Current State:** [Brief friction summary.]

**Opportunities:**
- [Tactic 1]
- [Tactic 2]
- [Tactic 3]

**Why It Matters:** [Impact on browsing/purchase flow or lead intent.]

## **Social Proof**

**Current State:** [What's missing or under-leveraged.]

**Opportunities:**
- [Tactic 1 — DTC: star ratings, UGC, review count near ATC / Local: Google reviews, named testimonials, before/after photos]
- [Tactic 2]
- [Tactic 3]

**Why It Matters:** [Trust signal impact.]

## **[Email Capture / Lead Form & Call CTA]**

**Current State:** [Brief summary of current capture method or booking friction.]

**Opportunities:**
- [Tactic 1 — DTC: popup timing, offer, value exchange / Local: form field count, phone prominence, booking speed]
- [Tactic 2]
- [Tactic 3]

**Why It Matters:** [Lead gen or conversion benefit.]

## **Key Detail Modules**

**Opportunities:**
- **What It Is:** [Plain-English summary of what's missing or under-explained]
- **[Label]:** [Supporting detail + benefit]
- **[Label]:** [Supporting detail + benefit]

**Why It Matters:** [Purchase confidence or value comprehension impact.]

## **Guarantee Callout**

**Opportunities:**
- [Tactic 1 — DTC: money-back, satisfaction, free returns / Local: satisfaction guarantee, response time SLA, free estimate]
- [Tactic 2]

**Why It Matters:** [Conversion unlock or risk-removal impact.]

## **Additional CRO Enhancements**

**Opportunities:**
- [Tactic 1]
- [Tactic 2]
- [Tactic 3]

**Why It Matters:** [Conversion behavior or UX impact.]

## **Mobile Experience**

**Current State:** [Mobile-specific friction: thumb reach, sticky CTA, scroll length, mobile menu, mobile fold trust.]

**Opportunities:**
- [Mobile tactic 1]
- [Mobile tactic 2]
- [Mobile tactic 3]

**Why It Matters:** [Mobile traffic share + conversion impact.]

## **Next Steps**

1. [Highest-leverage action — fix this first]
2. [Second action]
3. [Third action]

## **Test-First Handoff**

**TEST 1**
- Hypothesis: [If we change X to Y, then Z will improve because reason]
- Variant: [Specific change to ship]
- Primary KPI: [CVR / AOV / etc.]
- Expected lift: [Range]
- Confidence: [High / Medium / Low]

**TEST 2**
- Hypothesis: [...]
- Variant: [...]
- Primary KPI: [...]
- Expected lift: [...]
- Confidence: [...]

**TEST 3**
- Hypothesis: [...]
- Variant: [...]
- Primary KPI: [...]
- Expected lift: [...]
- Confidence: [...]

## **Decisive Move**

[One sentence naming the single variable that matters most.]

---
What this audit can't tell you:
- Which fix will move revenue most. That needs an A/B test.
- Whether this is your main bottleneck. That needs traffic and funnel data.
- How your audience responds emotionally. That needs session recordings and user research.
```

### Verification Before Sending

Before printing the markdown in chat:

- [ ] No finding claims inventory or stock state without browser confirmation
- [ ] No finding references a specific promo code without browser confirmation
- [ ] No finding describes popup behavior without browser confirmation
- [ ] **Tier D:** every claim with a trigger, delay, sequence or frequency in it carries a measured number, not a screenshot (see `references/core.md`). Tool-call order is not a clock
- [ ] **Tier D:** stateful widgets (Klaviyo, Privy, Justuno, A/B frameworks) were checked with suppression state cleared, and any self-suppressing widget is named as such in the deliverable so the client isn't confused when they can't reproduce it
- [ ] Evidence-to-claim pass run: each finding's artifact matches the kind of assertion its sentence makes
- [ ] **Tier E:** every claim about what a visitor sees on the first screen was judged from a screenshot, not a text extraction
- [ ] **Tier E:** no negative claim (no / none / nothing / not a single) rests on a DOM or text read alone
- [ ] **Tier E:** heroes that are video or full-bleed image were checked for copy baked into the media, and the finding says whether that copy is theme-editable or needs the file re-rendered
- [ ] Fold claims name the viewport and were measured at a laptop and a large monitor
- [ ] No finding describes dynamic upsell module contents without browser confirmation
- [ ] Each finding has been internally classified Tier A, B, or C
- [ ] Tier B findings have been spot-verified or flagged for verification
- [ ] Tier C findings have been dropped or browser-verified
