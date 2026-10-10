---
name: cro-opportunities-memo
description: >
  Produces a polished, client-facing opportunities memo (DOCX) for ecommerce brands
  that want CRO guidance framed as wins, not problems. Use this skill ONLY when the
  user explicitly names the deliverable or the cro-audit router has dispatched here.
  Trigger phrases: "opportunities memo," "ranked wins," "encouraging audit," "friendly
  memo," "build a beginner-friendly audit," "what to tackle next memo." Also trigger
  when an existing client has shipped changes and needs a "what's next" doc framed
  positively. For generic CRO audit requests without a named deliverable, use
  cro-audit (router) instead so the right format is chosen. Do NOT use for advanced
  operators or severity-triaged teardowns; use cro-site-audit instead. Output is a
  downloadable DOCX deliverable, not a text summary or chat response.
---

# CRO Opportunities Memo Skill

Look at the site. Rank the wins. Ship a polished opportunity-framed DOCX.

This is NOT a teardown. It's a strategic friend pointing at wins waiting to happen. The tone, the format, and the structure are all designed to make clients feel progress is possible and the path is clear.

---

## STEP 0: LOAD VOICE FIRST

Before producing this deliverable, load `references/voice.md` (CRO voice) and `references/audit-voice.md` (client register). If you keep your own writing voice guide, load it too.

**The voice files are canonical for VOICE. This skill is canonical for DELIVERABLE FORMAT.** They coordinate. Voice rules apply inside the DOCX copy — no em dashes, no banned words, no fabricated quotes, no negation flips, no AI tells. The skill's structure stays as defined below.

**Route for opportunities memo (encouraging client memo for beginner/intermediate audience):**
- Register: warmer than CRO audit, still operator mode (peer who's optimistic + has done the work)
- Audience: client-facing, beginner-to-intermediate operator (encouraging tone)
- Apply: Specific numbers, named examples, real outcomes — every claim concrete
- Apply: All universal rules from 10 Router
- Skip: profanity, harsh language, problem-framing (this is wins-framed by design)
- Skip: Realism Technique (this is strategic memo, not narrative)

---

---

## Theme

This skill outputs in the **client** theme (sub-brand `jcm`, density `airy`).

The kit lives in this skill's `references/` folder (`client-theme.js` + `tokens.js`; run `npm install docx` once). Require the theme directly from there: `const { createClientTheme } = require("<this skill folder>/references/client-theme");` then `const C = createClientTheme({ subBrand: 'jcm', density: 'airy' });`. Use its builders (`coverStacked`, `kicker`, `h1`, `h2`, `body`, `bullet`, `dataTable`, `cardTable`, `finding`, `soWhat`, `sectionRule`, `pageBreak`). Do not hardcode fonts, colors, margins, or metric formats. They live in `references/tokens.js`.

**Mapping the memo's bespoke elements to kit builders:**
- Cover → `coverStacked({ kicker: "<Month YYYY>", title: "<plain deliverable name>", subtitle: "<Brand>", preparedBy: C.ctx.S.brand.agency })`. Title the document by what it is (Landing Page Audit, Meta Ads Audit), brand as subtitle, prepared by the agency.
- "WHAT TO CHANGE" calloutBox → `finding("What to change", text)`. Same accent left-bar + tint fill.
- Decisive move → stated once, in prose, inside the section that owns it (usually the first). No closing callout restating it; see "Say it once" in `references/audit-voice.md`.
- Per-finding section → `h1("<plain subject noun>")` followed by a `body()` whose first sentence is the bolded insight. No `kicker()` label, no `Win N` numbering, no difficulty tag in the header.
- Closing section → `h1("What we'd recommend")` + `bullet()` list with bolded imperative lead-ins.
- `codeBox`, `quoteBox`, `divider`, `coverBar` from the old build script are deprecated. Codeboxes (exact suggested copy in beginner mode) render as `body({ bold: true })` lines inside the win, or as a `cardTable` row pair. Quoteboxes render as `body({ italics: true })` with a leading kicker. Dividers render as `sectionRule()`.
- Sign-off is the agency invitation line only, plain `body()`: "Questions on any of it, shoot us a message. Happy to jump on a call and go through it together." No "Talk soon," no name.

---

## When to Use This Skill vs. cro-site-audit

| Situation | Skill to use |
|---|---|
| Beginner founder, first store, needs encouragement + decoding | cro-opportunities-memo |
| Intermediate operator, knows the basics, needs ranking and tradeoffs | cro-opportunities-memo |
| Advanced DTC operator, wants sparring partner energy, diagnostic teardown | cro-site-audit |
| Client has shipped some changes already, needs "what's left" | cro-opportunities-memo |
| New relationship, first-impression deliverable for a cold lead | cro-site-audit |
| Follow-up memo after an initial audit has been sent | cro-opportunities-memo |

Default: if there's any doubt, ask once: "Is this a beginner, intermediate, or advanced ecom client?" Do not guess.

---

## Step 1 — Confirm Mode (ask before writing)

Every run of this skill starts by confirming which mode to write in. Ask one line, then wait for the answer before producing anything.

**Mode prompt:**
> "What's the client's ecom experience level — beginner, intermediate, or advanced? I'll tailor voice, vocabulary, and depth accordingly."

If context has already made it obvious (e.g., "Drew runs a BBQ rub brand, first year, $60k in revenue, no prior agency"), infer the mode and confirm in one line:
> "Reading this as beginner-level. Good to proceed?"

Never assume silently. The mode fundamentally changes the output.

---

## Step 0 — Source-of-Truth Tiers (read before fetching)

`web_fetch` returns the server-rendered HTML of a page. It does NOT see anything JavaScript renders after page load. Modern Shopify and headless storefronts use JavaScript for inventory state, popups, dynamic upsell modules, promo banners loaded via apps, A/B-tested heroes, personalization blocks, and cart widgets. Treating static HTML as live state causes client-facing misses.

This step defines what is safe to claim from `web_fetch` alone, what requires live verification, and what is forbidden without browser confirmation.

### Tier A — Safe to claim from web_fetch alone

- Hero copy, headlines, subheads, and CTAs as they appear in the HTML
- Section headings and structural layout
- Navigation labels and link destinations
- Footer copy and links
- Image alt text and meta tags
- URL structure and canonical paths
- Static text blocks (FAQ copy, mission statements, product descriptions)
- Whether a top-level page exists at a given URL
- Sitewide structural choices (free shipping threshold, currency, language)

### Tier B — Requires live verification before claiming

- Whether an element actually displays to a real user (vs. sitting in fallback markup)
- Trust strip placement and contents on the rendered page
- Whether a popup fires (exit intent, scroll, timer)
- Active promo banners and announcement-bar copy
- Whether a navigation chip or footer link is visible above the fold
- Header rotation logic and how many panels actually cycle

Before making any Tier B claim, either re-fetch and ask the user to spot-check, OR use the Chrome MCP (`mcp__claude-in-chrome__*`) to load the page in a real browser.

### Tier C — Forbidden without browser confirmation

- Inventory state (no "out of stock," "low stock," "in stock" claims)
- Specific promo codes (no references to EARTH25, WELCOME10, BOGO, etc. without visual confirmation)
- Active discount status (no claims a specific sale is currently live)
- Popup presence or behavior
- Dynamic upsell module contents (Rebuy, Bold, Recharge, ReConvert all render client-side)
- A/B test variants
- Personalization blocks
- Email capture popup behavior (only static footer form is verifiable from web_fetch)
- Cart drawer / progress bar contents

If a finding wants to include any Tier C content, drop the finding or escalate to Tier B verification.

### Mode Definitions

**BEGINNER MODE**
- Signal: founder runs Shopify themselves, no agency history, can't quote CVR off the top, doesn't know terms like AOV / PDP / CVR
- Framing: gentle, encouraging, explanatory
- Vocabulary: decoded inline on first use with a parenthetical or short definition
- Structure: numbered wins, plain-prose effort framing (no Easy/Medium/Hard labels), one decisive move at the end
- Length: longer, more context, more examples
- Voice: warm, patient, acknowledges what's working before showing gaps

**INTERMEDIATE MODE**
- Signal: quotes ROAS/CVR, has tried Klaviyo, has opinions on Shopify apps, has shipped things with mixed results
- Framing: peer-to-peer, direct, tradeoff-focused
- Vocabulary: used normally, not decoded, but clearly defined if unusual
- Structure: thematic groupings (hero / PDP / catalog / trust / capture), priority ranking, 2-3 key calls to make
- Length: medium, tighter than beginner
- Voice: peer, direct, opinionated but not abrasive

**ADVANCED MODE**
- Signal: talks funnel metrics, has a growth stack, challenges recommendations
- Framing: sharp, diagnostic, strategic
- Vocabulary: assumed shared language, no decoding
- Structure: diagnosis + strategic calls + tradeoffs + decision framing
- Length: short, dense
- Voice: sharp, opinionated, sparring-partner energy
- **If the client is advanced: stop and recommend cro-site-audit instead.** This skill is not tuned for advanced output. The severity-triaged PDF is the better deliverable.

---

## Step 2 — Fetch and Triage (silent, do not print)

Apply the Step 0 tier system. Do not generate any Tier C finding from web_fetch alone. Escalate Tier B findings for live verification.

Use `web_fetch` on the provided URL. If a screenshot is provided instead, use `view` on the image.

Evaluate against the six dimensions below. Note what's already working (this is critical — beginner mode needs to acknowledge wins) and what's missing. Do not print this analysis. It's internal scaffolding for the memo.

### Six Dimensions

1. **Hero clarity** — Does a cold visitor know what's for sale in 5 seconds? Is there a headline that names the buyer and the outcome? Is the button specific or generic?
2. **Product page depth** — Do PDPs answer the questions a hesitant buyer would actually ask? (What is it, what's it for, what's in it, how big, how fast does it ship, what's the guarantee.)
3. **Catalog hygiene** — Are food/core products mixed with merch? Is the highest-margin product buried? Are badges doing work?
4. **Trust stack near the CTA** — Are reviews, guarantees, payment icons, shipping info, and proof logos within eyeshot of the buy button?
5. **Cause / mission visibility** — If there's a brand story or cause, is it surfaced at the top or buried at the bottom?
6. **Capture for non-buyers** — Is there email + SMS capture running? Is it tied to a real offer?
7. **Mobile experience** — Is the primary CTA reachable with one thumb? Sticky add-to-cart on PDPs? Mobile homepage scroll length reasonable? Mobile menu logical? Hero image crops well portrait? Trust elements above the mobile fold? If the site is broken on mobile but clean on desktop, that's the #1 win regardless of how good the desktop hero looks.

For each dimension, silently note:
- ✓ What's working
- → What's missing or misplaced
- ! Highest-leverage fix

---

## Step 3 — Pick 5 Wins, Ranked by Impact

This is the core of the deliverable. Five wins, ranked by impact on conversion rate or first-purchase lift. Each win is a tactical, opinionated call — not a list of best practices.

### Ranking Rules
- The #1 win is always the single highest-leverage change. The thing that, if they only did one thing, would move the needle most.
- The #5 win is usually the slowest-compounding or most technical (e.g., email capture, SMS setup).
- Effort in plain prose per win ("you can do this in settings," "a designer for an hour or two"). No Easy/Medium/Hard labels (dead in client deliverables, Jay Aug 2026).
- If a win has a developer-required sub-fix, break it into two wins or note it as a "bonus" inside the win.

### The 5-Win Framework (use as a starting template, not a straitjacket)

1. **Hero + bundle positioning** — Lead the homepage with the right offer, a real headline, and the proof.
2. **Product pages as decision pages** — Add the modules that replace the in-person tasting/sizing experience.
3. **Catalog hygiene** — Separate core products from merch. Pin the highest-margin product.
4. **Guarantee + cause surfacing** — Add risk reversal. Move the story up.
5. **Capture the bouncing traffic** — Exit-intent + SMS + footer signup.

This template works for ~80% of beginner/intermediate ecom sites. For brands where one of these doesn't apply (e.g., no cause story), swap in the next-most-leveraged win from the audit notes.

---

## Step 3.5 — Live-State Verification Pass (mandatory)

After picking the 5 wins, before building any output:

1. List every win internally. Classify each as Tier A, B, or C per Step 0.
2. For Tier B and C wins, emit this exact checklist to the user in one message:

```
Before I finalize the memo, can you confirm these in your browser (takes ~60 seconds):

1. [Specific thing to check]
2. [Specific thing to check]
3. [Specific thing to check]
4. [Specific thing to check]
5. [Specific thing to check]

Reply with yes/no/notes for each. I'll fold the answers in before building the DOCX.
```

3. Wait for the user's response. If they skip verification, ship Tier A wins only and flag in chat what wasn't verified.
4. If Chrome MCP is available, run the checks via `mcp__claude-in-chrome__*` instead.
5. After verification: drop any Tier C win that didn't get confirmed. Tag each surviving win internally with its verification source.

---

## Step 3.7 — Test-First Handoff (silent, included in chat output after DOCX)

Pick the top 3 wins. For each, write a structured A/B test block:

```
TEST 1
Hypothesis: [If we change X to Y, then Z metric will improve because reason]
Variant: [Specific change to ship]
Primary KPI: [CVR / AOV / add-to-cart rate / etc.]
Expected lift: [Range]
Confidence: [High / Medium / Low]
```

These print in chat after the DOCX is delivered. They hand off to `test-prioritization-matrix` (not included in this kit) if the user wants to sequence them.

---

## Step 4 — Build the DOCX

The kit owns layout. The skill owns words. Do not redescribe colors, fonts, or spacing here. They live in `tokens.js` and resolve through `client-theme.js` per the Theme block above.

Save to `./outputs/[brand-slug]-opportunities.docx`.

### Required Document Structure

Follow this exact structure. The skill has been validated to produce clean, client-ready output when this structure is followed. Do not improvise section order.

**1. Cover** → `coverStacked({ kicker: "<Month YYYY>", title: "<plain deliverable name>", subtitle: "<Brand>", preparedBy: C.ctx.S.brand.agency })`. Title the document by what it is (Landing Page Audit, Opportunities Memo); prepared by the agency, never the personal default. **No `preparedFor`.** The memo goes to one person who already knows it's for them, and naming them on the cover reads like a certificate (Jay, Aug 2026, Client C).

**2. Opening paragraph**
- No greeting line. Open straight into the first paragraph (agency register, per `references/audit-voice.md` Branding and sign-off)
- 3-4 sentences: what you saw, what's working, where the gap is
- Beginner mode: add a "Quick translation up top" `bullet()` list decoding acronyms used later (Hero, Above the fold, CTA, PDP, CVR)
- Intermediate mode: skip the translation list

**3. Section rule** → `sectionRule()`

> **Header rule for everything below.** Every `h1()` in this document is a plain noun phrase naming its subject: `Pricing`, `Mobile`, `Product pages`, `Popups and offers`, `Proof and guarantee`, `What we'd recommend`. Never a metaphor, a slogan, a `Win N` label, or an insight sentence. The insight is the section's **first sentence, bolded** via the `**...**` markup `body()` already supports. See "Section headers" in `references/audit-voice.md`. If two sections want the same header, they're one section. Merge them.

**4. Summary**
- `h1("Summary")`
- 2-3 `body()` paragraphs: what you saw, what's working, where the gap is
- **No `kpiRow()`.** Dead in memos (Jay, Aug 2026, Client C). A memo's Summary argues in prose; a stat strip padded with whatever numbers were available reads as filler. Numbers belong inside the finding that earns them, or in a `dataTable()` that carries an argument. KPI rows stay alive in account audits, where spend and return are the subject.
- A `bullet()` list naming each section that follows, one line each, with the subject bolded (`"**Pricing.** The page and the cart disagree."`)
- `callout()` framing the effort involved

**5. Each finding section**
- `h1("<plain subject noun>")`
- Opening `body()` whose **first sentence is the insight, bolded**
- Supporting `body()` paragraphs, 2-3 sentences each
- `finding("What to change", "<directive action>")`
- `h2()` + `bullet()` blocks as needed for sub-steps
- `soWhat()` to close the section when there's a consequence worth naming
- Beginner mode: exact suggested copy as a one-column `cardTable`
- Intermediate mode: skip example copy, just name the principle

Order sections by impact, highest first. Difficulty is described in plain prose in the Summary (no Easy/Medium/Hard labels), never used as a header or a kicker label, and never with calendar language ("This week," "Next week").

**6. "What we'd recommend"**
- `h1("What we'd recommend")`
- `bullet()` list, one per section, each opening with a bolded imperative (`"**Switch the price default to one-time.** One setting in your bundle app..."`)
- Ordered the way you'd actually do them

**7. Sign-off**
- Closing `body()` reassurance paragraph (what this all adds up to, effort framing)
- `body("Questions on any of it, shoot us a message. Happy to jump on a call and go through it together.")`
- Nothing after that. No "Talk soon," no name. The decisive move was already stated once in its own section and is not restated here.

### Build script

```js
// build-memo.js
const fs = require("fs");
const path = require("path");
const { Packer } = require("docx");
const { createClientTheme } = require("./client-theme");

const C = createClientTheme({ subBrand: "jcm", density: "airy" });

const children = [
  ...C.coverStacked({
    kicker: "<Month YYYY>",
    title: "<Deliverable name, plain: Landing Page Audit / Meta Ads Audit>",
    subtitle: "<Brand>",
    preparedBy: C.ctx.S.brand.agency, // the agency name
  }),
  C.pageBreak(),

  C.h1("Summary"),
  C.body("<what you saw, on a phone, cold>"),
  C.body("**<what's already working>** <supporting detail>"),
  C.body("<where the gap is>"),

  C.body("This audit covers <N> places where there's room to get more out of the same spend:"),
  C.bullet("**<Section 1 subject>.** <one-line summary>"),
  C.bullet("**<Section 2 subject>.** <one-line summary>"),
  C.callout("<who can do what, effort framing, no calendar language>"),

  C.sectionRule(),

  // Each finding section. Header = plain subject noun. Insight = bolded first sentence.
  C.h1("Pricing"),
  C.body("**<the insight, as a full sentence>** <the rest of the setup>"),
  C.body("<supporting paragraph>"),
  C.finding("What to change", "<directive action>"),
  // Beginner mode: exact suggested copy as a one-column cardTable
  // C.cardTable({ headers: ["On the product page"], widths: [C.CW], rows: [["<exact copy>"]] }),
  C.soWhat("<the consequence worth naming>"),

  C.sectionRule(),

  // Remaining sections repeat the same shape, ordered by impact.

  C.h1("What we'd recommend"),
  C.body("In the order I'd do them."),
  C.bullet("**<Imperative for section 1>.** <why, one line>"),
  C.bullet("**<Imperative for section 2>.** <why, one line>"),
  C.body("<closing reassurance: what this adds up to, effort framing>"),
  C.body("Questions on any of it, shoot us a message. Happy to jump on a call and go through it together."),
];

const doc = C.build({ children, label: "<Deliverable name>  ·  <Brand>" });

Packer.toBuffer(doc).then((buf) => {
  const out = path.join(__dirname, "<brand-slug>-opportunities.docx");
  fs.writeFileSync(out, buf);
  console.log("wrote", out, buf.length, "bytes");
});
```

### Notes on usage

- **`finding(label, text)`** is the "WHAT TO CHANGE" and "THE BIGGEST, SIMPLEST MOVE" treatment. Same accent left-bar + tint fill as the old calloutBox. It is also how the decisive move gets carried, so it never needs its own section header.
- **`body()` supports `**inline bold**`** via `mkRuns`. That's the mechanism for the bolded insight sentence that opens every section. Use it rather than a separate bold paragraph.
- **Pin table rows** before saving so copy blocks don't tear across a page break in Word: inject `<w:cantSplit/>` into every `<w:trPr>` in `word/document.xml` after `Packer.toBuffer`.
- **`sectionRule()`** replaces the old orange `divider()`.
- The old `codeBox` (beginner mode exact-copy examples) is rendered as bolded `body()` lines or, for multi-line examples, a single-column `cardTable`.
- The old `quoteBox` (cause ribbon / guarantee text) renders as `body(text, { italics: true })` with a leading `kicker()`.
- **Metric formatting** comes from `tokens.metrics`. Format numbers before passing them in.
- **Footer label** = `<Brand>  ·  Opportunities Memo`.

---

## Step 5 — Writing Rules (Voice and Tone)

All voice rules, banned patterns, banned words, and tone calibration live in `references/voice.md`. Read that file before writing any memo content. Apply universal rules + tone calibration matched to the mode confirmed in Step 1 (beginner vs intermediate).

### Memo-specific structural rules (on top of shared voice)

- **Beginner mode adds inline decoding** of acronyms on first use (Hero, Above the fold, CTA, PDP, CVR). The voice file's beginner column already accounts for this.
- **Beginner mode includes literal suggested copy** in codeBoxes (exact headline, button text, subhead). Intermediate mode skips codeBoxes unless showing a pull-quote (guarantee, cause ribbon).
- **Beginner mode explains mechanism before tactic** ("How it works:" before "What to do:"). Intermediate mode goes principle-first, tactic-second.

---

## Step 6 — Output and Deliver

1. Save DOCX to `./outputs/[brand-slug]-opportunities.docx`
2. Validate: `python3 ~/.claude/skills/docx/scripts/office/validate.py [filepath]` (optional, needs Anthropic's docx skill)``
3. Share the file path in chat
4. Write a 2-3 sentence summary in chat that names the decisive move. No long preamble, no full recap.
5. Offer the delivery email: "Want a short email to send when you deliver this?" Do not produce the email unless asked.

---

## Quality Check Before Saving

Before saving, verify:

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
- [ ] All Tier B findings have been spot-verified by the user or via Chrome MCP
- [ ] All Tier C findings have been browser-verified or dropped
- [ ] Mode was confirmed at the start of the run
- [ ] Cover built via `C.coverStacked(...)` per the Theme block, not a custom bar
- [ ] `preparedBy` set to `S.brand.agency` (the agency name), never left to the personal default
- [ ] No `preparedFor` on the cover, and no `kpiRow()` anywhere in the memo
- [ ] No greeting line, no "Hey," — the doc opens straight into the first paragraph
- [ ] Beginner mode includes acronym translation bullets; intermediate mode does not
- [ ] **Every `h1()` is a plain noun phrase naming its subject.** Read the headers alone, top to bottom: they should work as a table of contents. Any metaphor, slogan, `Win N` label, or full-sentence insight is a fail, rewrite it
- [ ] **Every section opens with its insight as a bolded first sentence** using `**...**` markup
- [ ] No two sections share a subject. If they would, they were merged
- [ ] Sections ranked by impact, highest first
- [ ] Difficulty appears in plain prose only, with no Easy/Medium/Hard labels, never in a header or kicker
- [ ] No calendar language anywhere ("this week," "next week" are banned)
- [ ] Each section has a `C.finding("What to change", ...)` block
- [ ] Beginner mode: example copy rendered as a one-column `cardTable`
- [ ] Intermediate mode: example-copy blocks reserved for literal pull-quotes (guarantee text, cause ribbon)
- [ ] Closing section is `h1("What we'd recommend")` with bolded imperative lead-ins
- [ ] The decisive move is stated exactly once, in its own section; no closing callout or "this is the one that matters most" restating it
- [ ] Sign-off is the agency invitation line only ("shoot us a message"); no "Talk soon," no name
- [ ] Verdict words softened ("Needs work," not "Nothing"); deficits framed as goals; outcome claims hedged ("could be")
- [ ] No internal notes in the doc (verification receipts, attribution caveats, pre-publish checks); those go in the chat handoff
- [ ] Recap bullets are plain imperatives with no justification clauses
- [ ] No em dashes anywhere
- [ ] No banned words from the global list
- [ ] No staccato "No X. No Y. No Z." triples
- [ ] Every piece of advice is site-specific, not generic
- [ ] DOCX validates cleanly
- [ ] File saved to ./outputs/ with a brand-slug filename

---

## Step 7 — Optional Delivery Email

Only produce this if the user asks for it. Do not volunteer it by default — just offer at the end of Step 6.

Use the `message_compose_v1` tool. Single variant, emailformatted.

Template:
```
Hey [Client Name],

Spent some time with [brand]'s site and pulled together a short memo on the [N] highest-leverage things we'd tackle first. It's ranked by impact, plain English, and tagged for who's best to handle each piece.

The short version: [one-line diagnosis of the real gap]. [One-line framing of the fix timeline / approach].

Have a read when you get a minute. Happy to jump on a quick call to walk through it whenever works.

Talk soon,
[YOUR FIRST NAME]
```

Voice rules for the email:
- Match your own email voice
- Sign off with your first name only — this is a warmer follow-up context
- Keep it to 3-4 sentences in the body
- No em dashes
- One subject line option only, not multiple variants

---

## Changelog

- **v1.1** — Bound to the deliverable-system kit (`references/tokens.js` + `references/client-theme.js`). Removed bespoke NAVY/Calibri design system and 700-line reference build script. Cover, callouts, dividers, and tables now resolve through the kit's `coverStacked`, `finding`, `sectionRule`, `cardTable`. One source of truth for visual standards.
- **v1.0** — Initial skill. Established beginner/intermediate mode split, 5-wins framework, DOCX design system, and opportunity-framed voice rules. Reference implementation: a past client memo (April 2026).
- **v1.2** — KPI row and cover `preparedFor` retired from memos (Jay, Aug 2026, Client C). Both stay available in account audits. Build-script greeting line removed to match the existing no-greeting rule.
