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
- Structure: numbered wins, ownership tags (Easy/Medium/Hard), one decisive move at the end
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
- Ownership tags: Easy / Medium / Hard. One tag per win. Don't chain them (no "Easy → Hard").
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

These print in chat after the DOCX is delivered. They hand off to `test-prioritization-matrix` if the user wants to sequence them.

---

## Step 4 — Build the DOCX

Use the `docx` npm package. Install if needed: `npm install docx`

Save to `/mnt/user-data/outputs/[brand-slug]-opportunities.docx`.

### Design System

**Colors**
```javascript
const NAVY = "1A2B4A";       // primary, headings, brand voice
const ORANGE = "E8541A";     // single accent color, callout bars, tag labels
const GREY = "555555";       // secondary body text
const LIGHT_GREY = "888888"; // meta labels, captions
const BG_TINT = "F4F1EC";    // callout box background
```

One accent color only. No rainbow palettes. Navy + orange + cream is the whole system.

**Typography**
- Body font: Calibri (universal, renders cleanly everywhere)
- Body size: 22 half-points (11pt)
- H1: 40 half-points (20pt), bold, Navy
- H2: 30 half-points (15pt), bold, Navy
- H3: 24 half-points (12pt), bold, Navy
- Tag labels: 18 half-points (9pt), bold, Orange, ALL CAPS, letter-spaced
- Line height: 320 twips (1.6x) for body

**Layout**
- Letter size (12240 x 15840 DXA)
- 0.75" top/bottom margins, 1" left/right margins
- All tables 9360 DXA wide (content width)

### Required Document Structure

Follow this exact structure. The skill has been validated to produce clean, client-ready output when this structure is followed. Do not improvise section order.

**1. Cover Bar (navy block with orange bottom border)**
- Label: "OPPORTUNITIES MEMO" in letter-spaced caps, cream color
- Title: Brand name in 56-half-point bold white
- Tagline: One-line italic summary in cream
- Bottom border: 36-thick orange line

**2. Meta Line**
- Left: "PREPARED FOR  [Client Name]"
- Right: "FROM  Jay Condie  ·  [Month Year]"

**3. Opening Paragraph**
- Greets the client by name in bold navy ("Greg,")
- 3-4 sentences: what you saw, what's working, where the gap is
- In beginner mode: add a "Quick translation up top" bullet list decoding acronyms used later in the doc (Hero, Above the fold, CTA, PDP, CVR)
- In intermediate mode: skip the translation list

**4. Divider (orange rule)**

**5. "The big idea" (H1)**
- One bolded headline insight in 24-half-point navy
- 2-3 supporting paragraphs
- Sets up the single highest-leverage observation

**6. "The [N] wins, in order" (H1)**
- Introductory line explaining ownership tags
- Bullet list defining Easy / Medium / Hard
- Numbered list of the 5 wins with their tags

**7. Each Win (H2)**
- Tag label above H2 (e.g., "WIN 1  ·  EASY  ·  SHIP THIS WEEK" — but in intermediate mode, drop the timing)
- Actually, update: **never include timing commitments**. Use "WIN 1  ·  EASY" only. Timing creates implicit promises you can't control.
- Current-state paragraph: 2-3 sentences describing what's on the page
- Callout box: "WHAT TO CHANGE" with the directive action
- H3 subsections as needed, each with specific tactical bullets
- In beginner mode: include a codeBox showing the exact suggested copy (headline, subhead, button text)
- In intermediate mode: skip the codeBox, just name the principle

**8. "A Short Recap" (H1)**
- Tag label: "SHIP EARLY"
- Bullets: the Easy wins
- Tag label: "SHIP AFTER"
- Bullets: the Medium and Hard wins
- Do NOT use calendar language like "This week" / "Next week"

**9. Decisive Move Callout**
- Labeled "THE DECISIVE MOVE"
- One-paragraph distillation of the #1 highest-leverage change

**10. Sign-off**
- "Questions on any of this? Text me anytime. Happy to jump on a call..."
- "Talk soon,"
- "Jay" in bold navy

### Visual Elements

**calloutBox(label, body)** — Cream background, orange left border (24-thick), label in orange caps. Used for "WHAT TO CHANGE" and "THE DECISIVE MOVE."

**codeBox(label, lines, accent)** — Off-white background, light grey borders, orange left border. Used to show exact suggested copy for headlines, buttons, guarantees. Beginner mode only.

**quoteBox(text)** — Off-white background, orange left border, italic navy text. Used for a single pull-quote line like a guarantee or cause ribbon.

**divider()** — Orange horizontal rule between major sections.

**tag(text, color)** — Small letter-spaced all-caps label. Used above H2s to mark difficulty.

### Build Order (avoid docx-js pitfalls)

1. Define the color constants
2. Build helper functions (p, runs, h1, h2, h3, tag, bullet, bulletBold, numbered, divider, calloutBox, codeBox, quoteBox, coverBar, metaLine)
3. Configure numbering references: "bullets" (orange •), "numbers" (navy bold)
4. Set page size explicitly: 12240 x 15840 (Letter)
5. Assemble children array in document order
6. Validate with `python3 /mnt/skills/public/docx/scripts/office/validate.py`

### Reference Build Script

A complete working build script is available at the bottom of this skill as a reference (see "Appendix: Reference Build Script"). Start from that and modify content, not structure.

---

## Step 5 — Writing Rules (Voice and Tone)

All voice rules, banned patterns, banned words, and tone calibration live in `../cro-audit/references/voice.md`. Read that file before writing any memo content. Apply universal rules + tone calibration matched to the mode confirmed in Step 1 (beginner vs intermediate).

### Memo-specific structural rules (on top of shared voice)

- **Beginner mode adds inline decoding** of acronyms on first use (Hero, Above the fold, CTA, PDP, CVR). The voice file's beginner column already accounts for this.
- **Beginner mode includes literal suggested copy** in codeBoxes (exact headline, button text, subhead). Intermediate mode skips codeBoxes unless showing a pull-quote (guarantee, cause ribbon).
- **Beginner mode explains mechanism before tactic** ("How it works:" before "What to do:"). Intermediate mode goes principle-first, tactic-second.

---

## Step 6 — Output and Deliver

1. Save DOCX to `/mnt/user-data/outputs/[brand-slug]-opportunities.docx`
2. Validate: `python3 /mnt/skills/public/docx/scripts/office/validate.py [filepath]`
3. Call `present_files` with the filepath
4. Write a 2-3 sentence summary in chat that names the decisive move. No long preamble, no full recap.
5. Offer the delivery email: "Want a short email to send when you deliver this?" Do not produce the email unless asked.

---

## Quality Check Before Saving

Before saving, verify:

- [ ] No finding claims inventory or stock state without browser confirmation
- [ ] No finding references a specific promo code without browser confirmation
- [ ] No finding describes popup behavior without browser confirmation
- [ ] No finding describes dynamic upsell module contents without browser confirmation
- [ ] Each finding has been internally classified Tier A, B, or C
- [ ] All Tier B findings have been spot-verified by the user or via Chrome MCP
- [ ] All Tier C findings have been browser-verified or dropped
- [ ] Mode was confirmed at the start of the run
- [ ] Cover bar is navy with orange bottom border
- [ ] Meta line shows "PREPARED FOR" and "FROM  Jay Condie  ·  [Month Year]"
- [ ] Opening paragraph greets client by name in bold navy
- [ ] Beginner mode includes acronym translation bullets; intermediate mode does not
- [ ] "The big idea" section has one bolded headline insight
- [ ] Exactly 5 wins, ranked by impact
- [ ] Each win has ONE ownership tag (Easy / Medium / Hard), no chained tags
- [ ] No calendar language anywhere ("this week," "next week" are banned)
- [ ] Each win has a "WHAT TO CHANGE" calloutBox
- [ ] Beginner mode: each win includes a codeBox with exact suggested copy
- [ ] Intermediate mode: codeBoxes are only used when showing a literal pull-quote (guarantee text, cause ribbon)
- [ ] "A Short Recap" uses SHIP EARLY / SHIP AFTER tags, not calendar dates
- [ ] "THE DECISIVE MOVE" callout at the end names ONE action
- [ ] Sign-off is "Talk soon, Jay" (in bold navy for the name)
- [ ] No em dashes anywhere
- [ ] No banned words from the global list
- [ ] No staccato "No X. No Y. No Z." triples
- [ ] Every piece of advice is site-specific, not generic
- [ ] DOCX validates cleanly
- [ ] File saved to /mnt/user-data/outputs/ with a brand-slug filename

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
Jay
```

Voice rules for the email:
- Match Jay's voice from jay-email-voice-guide.md
- Sign off as "Jay" (not "Jason Condie") — this is a warmer follow-up context
- Keep it to 3-4 sentences in the body
- No em dashes
- One subject line option only, not multiple variants

---

## Appendix: Reference Build Script

The following script produced the Downright Delicious opportunities memo and serves as the validated reference implementation. Start from this when building any new memo. Modify content, preserve structure.

```javascript
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType, ShadingType
} = require('docx');

const NAVY = "1A2B4A";
const ORANGE = "E8541A";
const GREY = "555555";
const LIGHT_GREY = "888888";
const BG_TINT = "F4F1EC";

// --- Helper builders ---

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 160, before: opts.before ?? 0, line: 320 },
  alignment: opts.align ?? AlignmentType.LEFT,
  children: [new TextRun({ text, font: "Calibri", size: opts.size ?? 22, color: opts.color ?? "333333", bold: opts.bold ?? false, italics: opts.italics ?? false })]
});

const runs = (parts, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 160, before: opts.before ?? 0, line: 320 },
  alignment: opts.align ?? AlignmentType.LEFT,
  children: parts.map(part => new TextRun({
    text: part.text, font: "Calibri",
    size: part.size ?? 22, color: part.color ?? "333333",
    bold: part.bold ?? false, italics: part.italics ?? false
  }))
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 360, after: 200 },
  children: [new TextRun({ text, font: "Calibri", size: 40, bold: true, color: NAVY })]
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 320, after: 160 },
  children: [new TextRun({ text, font: "Calibri", size: 30, bold: true, color: NAVY })]
});

const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({ text, font: "Calibri", size: 24, bold: true, color: NAVY })]
});

const tag = (text, color) => new Paragraph({
  spacing: { before: 120, after: 80 },
  children: [new TextRun({ text, font: "Calibri", size: 18, bold: true, color, allCaps: true, characterSpacing: 30 })]
});

const bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { after: 100, line: 300 },
  children: [new TextRun({ text, font: "Calibri", size: 22, color: "333333" })]
});

const bulletBold = (lead, rest) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { after: 100, line: 300 },
  children: [
    new TextRun({ text: lead, font: "Calibri", size: 22, color: NAVY, bold: true }),
    new TextRun({ text: rest, font: "Calibri", size: 22, color: "333333" })
  ]
});

const numbered = (text) => new Paragraph({
  numbering: { reference: "numbers", level: 0 },
  spacing: { after: 100, line: 300 },
  children: [new TextRun({ text, font: "Calibri", size: 22, color: "333333" })]
});

const divider = () => new Paragraph({
  spacing: { before: 240, after: 240 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ORANGE, space: 1 } },
  children: [new TextRun({ text: "" })]
});

const calloutBox = (label, body, accentColor = ORANGE) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [new TableRow({
    children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: BG_TINT, type: ShadingType.CLEAR },
      margins: { top: 200, bottom: 200, left: 240, right: 240 },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        left: { style: BorderStyle.SINGLE, size: 24, color: accentColor }
      },
      children: [
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: label, font: "Calibri", size: 18, bold: true, color: accentColor, allCaps: true, characterSpacing: 30 })]
        }),
        new Paragraph({
          spacing: { after: 0, line: 320 },
          children: [new TextRun({ text: body, font: "Calibri", size: 22, color: NAVY })]
        })
      ]
    })]
  })]
});

const codeBox = (label, lines, accent) => {
  const children = [
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: label, font: "Calibri", size: 18, bold: true, color: accent, allCaps: true, characterSpacing: 30 })]
    }),
    ...lines.map((l, i) => new Paragraph({
      spacing: { after: i === lines.length - 1 ? 0 : 60, line: 280 },
      children: [new TextRun({
        text: l.text, font: "Calibri",
        size: l.size ?? 22, color: l.color ?? "333333",
        italics: l.italics ?? false, bold: l.bold ?? false
      })]
    }))
  ];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: "FAFAF7", type: ShadingType.CLEAR },
        margins: { top: 180, bottom: 180, left: 220, right: 220 },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: "E0DDD6" },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: "E0DDD6" },
          right: { style: BorderStyle.SINGLE, size: 4, color: "E0DDD6" },
          left: { style: BorderStyle.SINGLE, size: 24, color: accent }
        },
        children
      })]
    })]
  });
};

const quoteBox = (text) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [new TableRow({
    children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: "FAFAF7", type: ShadingType.CLEAR },
      margins: { top: 180, bottom: 180, left: 280, right: 280 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "E0DDD6" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "E0DDD6" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "E0DDD6" },
        left: { style: BorderStyle.SINGLE, size: 24, color: ORANGE }
      },
      children: [new Paragraph({
        spacing: { after: 0, line: 320 },
        children: [new TextRun({ text, font: "Calibri", size: 24, color: NAVY, italics: true })]
      })]
    })]
  })]
});

const coverBar = (brandName, tagline) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [new TableRow({
    children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: NAVY, type: ShadingType.CLEAR },
      margins: { top: 360, bottom: 360, left: 320, right: 320 },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        bottom: { style: BorderStyle.SINGLE, size: 36, color: ORANGE },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
      },
      children: [
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: "OPPORTUNITIES MEMO", font: "Calibri", size: 20, bold: true, color: "F4F1EC", allCaps: true, characterSpacing: 60 })]
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: brandName, font: "Calibri", size: 56, bold: true, color: "FFFFFF" })]
        }),
        new Paragraph({
          spacing: { after: 0 },
          children: [new TextRun({ text: tagline, font: "Calibri", size: 24, color: "F4F1EC", italics: true })]
        })
      ]
    })]
  })]
});

const metaLine = (clientName, dateStr) => {
  const baseCell = (children) => new TableCell({
    width: { size: 4680, type: WidthType.DXA },
    margins: { top: 120, bottom: 120, left: 0, right: 0 },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
    },
    children
  });
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [new TableRow({
      children: [
        baseCell([new Paragraph({ children: [
          new TextRun({ text: "PREPARED FOR  ", font: "Calibri", size: 16, bold: true, color: LIGHT_GREY, characterSpacing: 30 }),
          new TextRun({ text: clientName, font: "Calibri", size: 20, color: NAVY, bold: true })
        ] })]),
        baseCell([new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "FROM  ", font: "Calibri", size: 16, bold: true, color: LIGHT_GREY, characterSpacing: 30 }),
            new TextRun({ text: `Jay Condie  ·  ${dateStr}`, font: "Calibri", size: 20, color: NAVY, bold: true })
          ]
        })])
      ]
    })]
  });
};

// --- Document assembly ---

const doc = new Document({
  creator: "Jay Condie",
  title: "[Brand] — Opportunities",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } }
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 240 } }, run: { color: ORANGE } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 240 } }, run: { bold: true, color: NAVY } }
        }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 }
      }
    },
    children: [
      coverBar("[BRAND NAME]", "[one-line tagline]"),
      p("", { after: 200 }),
      metaLine("[Client Name]", "[Month Year]"),
      p("", { after: 240 }),

      // OPENING
      runs([
        { text: "[Client Name], ", bold: true, color: NAVY, size: 22 },
        { text: "[opening paragraph: what you saw, what's working, where the gap is]" }
      ], { after: 160 }),

      // ... continue with the structure from Step 4 ...

      // CLOSING
      runs([{ text: "Talk soon,", color: NAVY }], { after: 60 }),
      runs([{ text: "Jay", bold: true, color: NAVY, size: 24 }], { after: 0 })
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/mnt/user-data/outputs/[brand-slug]-opportunities.docx", buf);
  console.log("Built. Size:", buf.length, "bytes");
});
```

---

## Changelog

- **v1.0** — Initial skill. Established beginner/intermediate mode split, 5-wins framework, DOCX design system, and opportunity-framed voice rules. Reference implementation: Downright Delicious memo (April 2026).
