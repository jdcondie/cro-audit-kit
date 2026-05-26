---
name: cro-site-audit
description: >
  Produces a polished, client-facing CRO site audit PDF from any URL. Use this skill
  ONLY when the user explicitly wants a PDF deliverable or names the format directly:
  "PDF audit," "client-ready audit," "polished teardown," "site audit report,"
  "build an audit PDF," "audit report for [brand]," or when the cro-audit router
  has dispatched here. For generic requests like "CRO audit" or "audit this site"
  without a named deliverable, use cro-audit (router) instead so the right
  deliverable is chosen. Output is a downloadable, landscape PDF report formatted
  as a client-ready deliverable, not a text summary or bullet list in chat.
---

# CRO Site Audit Skill

Fetch. Diagnose. Triage. Build. One URL in, one polished client deliverable out.

---

## Inputs

```
url: [PASTE URL]                  — OR provide a screenshot path if the site is JS-heavy, login-gated, or otherwise hard to fetch
screenshot_path: [optional]       — fallback when URL fetch is unreliable
brand_name: [optional — auto-detected from site if not provided]
agency_name: [optional — defaults to "Matix Labs"]
context: [optional — from /cro intake: business model, primary goal, prior tests, experience level]
```

If only a screenshot is provided, skip `web_fetch` in Step 1 and run the diagnostic from the image. Tier C findings still need browser confirmation from the user.

---

## Voice

All voice and writing rules live in `references/voice.md` in the cro-audit skill. Read that file before writing any audit content. Apply universal rules + tone calibration matched to the client's experience level (passed in via `context`).

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

---

## Step 1 — Fetch and Diagnose (silent, do not print)

Apply the Step 0 tier system. Do not generate any Tier C finding from web_fetch alone. Escalate Tier B findings for live verification.

Use `web_fetch` to pull the live page at the provided URL.

Evaluate the page across these 6 dimensions. For each, write:
- A current state observation (what's actually broken and why it costs conversions)
- 3 specific, actionable opportunities (not generic best practices)

### Audit Dimensions

**1. Hero Clarity**
Does a cold visitor instantly understand: what this is, who it's for, what's included, and what to do next? Is the headline outcome-led or product-led? Is there an audience qualifier? Is the CTA specific or generic?

**2. Navigation and Site Structure**
Are there conflicting paths, duplicate buttons, or inconsistent product sets across nav entries? Does the structure help shoppers find the right product or create confusion before they reach a PDP?

**3. Trust and Proof Near the CTA**
Are reviews, guarantees, shipping policies, and risk reversers merchandised near the buy decision, or buried below the fold or in the footer? Does the visitor feel safe clicking before they scroll?

**4. Complexity and DIY Friction**
Does the product require setup, measurement, or assembly? Does the page reduce how intimidating that feels, or does it leave cold visitors to assume the worst? Look for missing step-by-step visuals, tool/requirement summaries, and install confidence modules.

**5. Urgency and Reason to Act Now**
Is there a believable, specific reason to buy today vs. save for later? Is a sale price shown with actual dollar savings? Is urgency tied to a real operational or seasonal reason?

**6. Email Capture and Re-engagement**
Is there a PDP-specific or intent-matched capture mechanism for undecided visitors? Is the offer tied to the real objection (fit, setup, compatibility) or is it a generic "subscribe" ask?

**7. Mobile Experience**
Most ecom traffic is mobile. Check: is the primary CTA reachable with one thumb? Is there a sticky add-to-cart on PDPs? How long is the mobile homepage scroll vs. desktop? Is the mobile menu logical or buried in a hamburger that hides everything? Does the hero image crop badly on portrait? Are trust elements visible above the mobile fold? Is checkout single-page or multi-step on mobile?

The audit weighs mobile against desktop. If the site is broken on mobile but fine on desktop, that's a CRITICAL finding regardless of how clean the desktop hero looks.

---

## Step 2 — Severity Triage (silent)

Assign each finding one of three severity levels:

| Level | Label | Dot Color | Meaning |
|---|---|---|---|
| 1 | CRITICAL | Red `#E53E3E` | Directly blocks purchase or destroys trust |
| 2 | HIGH | Orange `#DD9B20` | Increases friction or reduces confidence |
| 3 | MEDIUM | Gold `#D6B82E` | Missed opportunity, lower conversion impact |

Aim for 1 CRITICAL, 3 HIGH, and 2 MEDIUM findings. Adjust if the site genuinely warrants more or fewer at any level.

---

## Step 2.5 — Live-State Verification Pass (mandatory)

After triage, before building any output:

1. List every finding internally. Classify each as Tier A, B, or C per Step 0.
2. For Tier B and C findings, emit a single message to the user with a numbered verification checklist of up to 5 specific things to confirm in one round-trip. Use this exact format:

```
Before I finalize the audit, can you confirm these in your browser (takes ~60 seconds):

1. [Specific thing to check, e.g. "Does the exit-intent popup actually fire when you move your cursor off the page?"]
2. [e.g. "Is the announcement bar still showing EARTH25 today, or has the promo ended?"]
3. [e.g. "On a PDP, does the upsell drawer show a recommended product or is it empty?"]
4. [e.g. "On mobile, is the add-to-cart sticky as you scroll, or does it disappear?"]
5. [e.g. "Are the press logos in the trust strip clickable, or just decorative?"]

Reply with yes/no/notes for each. I'll fold the answers in before building the PDF.
```

3. Wait for the user's response. If the user is unavailable or says "skip verification," ship Tier A findings only and flag in the PDF that promo, inventory, popup, and dynamic module findings were not verified.
4. If Chrome MCP is available and the user prefers self-serve, run the checks via `mcp__claude-in-chrome__*` instead.
5. After verification: drop any Tier C finding that didn't get confirmed. Tag each surviving finding internally with its verification source (web_fetch / user-confirmed / Chrome MCP).

---

## Step 3 — Build the PDF Report

Use `reportlab` to produce a polished, multi-page landscape PDF.

Install if needed: `pip install reportlab --break-system-packages`

### PDF Construction Approach

Use `reportlab.platypus` (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Flowable, HRFlowable) for layout. Build a `story` list and call `doc.build(story, onFirstPage=bg_canvas, onLaterPages=bg_canvas)`.

### Fonts

Download DM Sans from the jsdelivr CDN and register with reportlab:

```python
import os, urllib.request
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

FONT_DIR = "/tmp/fonts"
os.makedirs(FONT_DIR, exist_ok=True)

font_urls = {
    "DMSans": "https://cdn.jsdelivr.net/fontsource/fonts/dm-sans@latest/latin-400-normal.ttf",
    "DMSans-Bold": "https://cdn.jsdelivr.net/fontsource/fonts/dm-sans@latest/latin-700-normal.ttf",
    "DMSans-Medium": "https://cdn.jsdelivr.net/fontsource/fonts/dm-sans@latest/latin-500-normal.ttf",
    "DMSans-Italic": "https://cdn.jsdelivr.net/fontsource/fonts/dm-sans@latest/latin-400-italic.ttf",
}
for name, url in font_urls.items():
    path = os.path.join(FONT_DIR, f"{name}.ttf")
    if not os.path.exists(path):
        urllib.request.urlretrieve(url, path)
    pdfmetrics.registerFont(TTFont(name, path))

# CRITICAL: register the font family so <b> and <i> tags work inside Paragraphs
registerFontFamily("DMSans",
    normal="DMSans",
    bold="DMSans-Bold",
    italic="DMSans-Italic",
    boldItalic="DMSans-Bold",
)
```

Fallback to Helvetica/Helvetica-Bold/Helvetica-Oblique if font download fails.

### Color System

```python
from reportlab.lib.colors import HexColor, white

BG            = HexColor("#f0efeb")   # page background (cream)
SLATE         = HexColor("#5f7285")   # titles, heading text
SLATE_DARK    = HexColor("#4a5d6e")
TEXT_DARK     = HexColor("#2d3748")   # body text
TEXT_MED      = HexColor("#4a5568")   # secondary text
TEXT_LIGHT    = HexColor("#8a9ab0")   # footer text
BORDER_LIGHT  = HexColor("#d6d3cb")   # dividers, card borders
CRITICAL_DOT  = HexColor("#E53E3E")
HIGH_DOT      = HexColor("#DD9B20")
MEDIUM_DOT    = HexColor("#D6B82E")
OPP_BG        = HexColor("#5a6978")   # dark opportunity box background
CARD_BG_LIGHT = HexColor("#f7f6f3")   # priority grid content rows
NUM_ROW_BG    = HexColor("#edecea")   # priority grid number rows (slightly darker)
```

### Layout

```python
from reportlab.lib.pagesizes import letter, landscape

PAGE_W, PAGE_H = landscape(letter)
MARGIN_LR = 72
MARGIN_TB = 56
CONTENT_W = PAGE_W - 2 * MARGIN_LR
COL_GAP = 24
LEFT_COL_W = (CONTENT_W - COL_GAP) / 2
RIGHT_COL_W = (CONTENT_W - COL_GAP) / 2
```

### Page Background and Footer

Create a `bg_canvas` callback that:
1. Fills the entire page with the cream background `BG`
2. Draws a branded accent bar at the very top of the page: full width, 3.5pt tall, `SLATE` color
3. Draws a thin divider line (0.5pt, `BORDER_LIGHT`) at y=44
4. Draws page number right-aligned at y=32, `TEXT_LIGHT` color, 7.5pt body font

Track page count with `page_count = [0]` incremented in the callback.

```python
page_count = [0]

def bg_canvas(canvas, doc):
    page_count[0] += 1
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    footer_y = 32
    canvas.setStrokeColor(BORDER_LIGHT)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_LR, footer_y + 12, PAGE_W - MARGIN_LR, footer_y + 12)

    # Top accent bar
    canvas.setFillColor(SLATE)
    canvas.rect(0, PAGE_H - 3.5, PAGE_W, 3.5, fill=1, stroke=0)

    canvas.setFont(BODY, 7.5)
    canvas.setFillColor(TEXT_LIGHT)
    canvas.drawRightString(PAGE_W - MARGIN_LR, footer_y, str(page_count[0]))

    canvas.restoreState()
```

### BadgeDot Flowable

Severity badges use a custom `BadgeDot` Flowable: a pill-shaped rounded rect (`#e8e6e0`) with a colored dot (4.5r circle) on the left and bold uppercase label text on the right. Width 110, height 24.

```python
class BadgeDot(Flowable):
    def __init__(self, label, dot_color, width=110, height=24):
        Flowable.__init__(self)
        self.label = label.upper()
        self.dot_color = dot_color
        self.width = width
        self.height = height

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        c.setFillColor(HexColor("#e8e6e0"))
        c.roundRect(0, 0, self.width, self.height, self.height / 2, fill=1, stroke=0)
        c.setFillColor(self.dot_color)
        c.circle(16, self.height / 2, 4.5, fill=1, stroke=0)
        c.setFillColor(TEXT_DARK)
        c.setFont(BODY_B, 8.5)
        c.drawString(28, (self.height - 8.5) / 2 + 1, self.label)
        c.restoreState()
```

### Page Structure

**1. Cover Page**
- `Spacer(1, 80)` top padding
- Prepared by line: bold 11pt, SLATE color, spaceAfter 14
- Title: `SITE AUDIT: [BRAND NAME]` in bold 48pt, SLATE, leading 54, spaceAfter 16
- `Spacer(1, 6)`
- Horizontal rule: `HRFlowable(width="100%", thickness=1.5, color=SLATE, spaceAfter=20)`
- Italic framing quote: 15pt italic, TEXT_MED, leading 24
  > "When a new person lands on your site, we want them to instantly be able to answer four key questions: What do you sell? Who is it for? Why should I care? and What do I do now?"
- `PageBreak()`

**2. Finding Pages (one per finding, except MEDIUM findings share a page)**

Each finding page uses a `finding_page()` function that returns a list of flowables:
1. `BadgeDot(level_label, dot_color)`
2. `Spacer(1, 12)`
3. Section title with number prefix: `"01   HERO SECTION"` in bold 28pt uppercase, SLATE, leading 34. Use `section_num` parameter formatted as `f"{section_num:02d}"`.
4. Optional subtitle: italic 21pt, SLATE, leading 28
5. `Spacer(1, 24)` breathing room before columns

6. Two-column Table layout:
   - **Left column** (50% minus half gap): Light background card (`CS_BG = #e8e6e2`) with a 2.5pt `SLATE` accent line on the left edge. The accent line is a separate thin Table cell placed left of the card. Card has rounded corners `[0, 8, 8, 0]` (flat on left where accent meets it), padding 24pt LR / 22pt TB. "CURRENT STATE:" label at bold 16pt. Body paragraphs 12pt, leading 19, spaceAfter 20. Use `<b>` tags for emphasis.
   - **Right column** (50% minus half gap): Dark box with `OPP_BG` background, 8px rounded corners, 24pt left/right padding, 22pt top/bottom padding. Contains "OPPORTUNITIES:" label (bold 16pt white) and 3 bullet points (12pt white, leading 19, spaceAfter 20, leftIndent 18). Bullets use `\u2022` character.
   - Use a 3-column Table `[LEFT_COL_W, COL_GAP, RIGHT_COL_W]` with an empty middle cell for the gap between columns.
   - **Alignment rule**: Both columns must use identical top padding so "CURRENT STATE:" and "OPPORTUNITIES:" labels start at the same Y position.

Finding order: CRITICAL first, then HIGH, then MEDIUM.

CRITICAL and HIGH findings each get their own page with `PageBreak()` after.

MEDIUM findings share a single page. Use `compact=True` in the finding_page() call which applies these reductions: titles shrink to 22pt, badge gap 6pt, pre-column spacer 10pt, body text 11pt/leading 17/spaceAfter 10, opportunity bullets 11pt/leading 17/spaceAfter 10, box padding 20pt LR / 16pt TB. Separate the two MEDIUM findings with `Spacer(1, 16)` and wrap both in a single `KeepTogether` block.

**3. Prioritized Opportunities Page (final page)**

`PageBreak()` before. Header: "PRIORITIZED OPPORTUNITIES:" in bold 28pt, SLATE, spaceAfter 20.

A 2x3 grid Table with alternating number/content row pairs:
- Number rows: centered 18pt SLATE text, `NUM_ROW_BG` background
- Content rows: left-aligned bold uppercase 11pt title + 10.5pt description, `CARD_BG_LIGHT` background
- Each card pair boxed with 0.5pt `BORDER_LIGHT` border
- 0.5pt horizontal divider between number and content rows
- 14pt left/right padding, 12pt top/bottom padding

Row 1: top 3 structural/conversion fixes
Row 2: next 3 supporting improvements

---

## Typography Reference

| Element | Font | Size | Leading | Color |
|---|---|---|---|---|
| Cover prepared line | DMSans-Bold | 11pt | 14 | SLATE |
| Cover title | DMSans-Bold | 48pt | 54 | SLATE |
| Cover quote | DMSans-Italic | 15pt | 24 | TEXT_MED |
| Finding title | DMSans-Bold | 28pt | 34 | SLATE |
| Finding subtitle | DMSans-Italic | 21pt | 28 | SLATE |
| Current State label | DMSans-Bold | 16pt | 22 | TEXT_DARK |
| Current State body | DMSans | 12pt (11pt compact) | 19 (17 compact), spaceAfter 20 (10 compact) | TEXT_DARK |
| Opportunities label | DMSans-Bold | 16pt | 22 | white |
| Opportunity bullets | DMSans | 12pt (11pt compact) | 19 (17 compact), spaceAfter 20 (10 compact) | white |
| Priority grid number | DMSans | 18pt | 22 | SLATE |
| Priority grid title | DMSans-Bold | 11pt | 15 | SLATE |
| Priority grid desc | DMSans | 10.5pt | 16 | TEXT_DARK |
| Footer | DMSans | 7.5pt | — | TEXT_LIGHT |

---

## Writing Rules

All voice rules, banned patterns, banned words, and tone calibration live in `references/voice.md`. Read it before writing any audit content. Apply universal rules + tone matched to the client's experience level (from `context`).

### Audit-specific structural rules (on top of shared voice)

- **Severity badges first, bold labels second, bullets third.** A reader skimming for 10 seconds finds the 3 biggest problems through these layers.
- **Current State:** 2-3 short paragraphs, each naming a specific problem with its conversion cost.
- **Opportunities:** exactly 3 per finding. Each a concrete action with bold example copy. Use `<b>` tags in Paragraph text for emphasis.
- If a finding can't be understood in under 5 seconds of reading, rewrite it shorter.

---

## Step 3.5 — Test-First Handoff (silent, then included in chat output)

Before saving the PDF, generate a structured A/B test handoff. This appears in chat after the PDF is delivered, not inside the PDF itself.

Pick the 3 highest-leverage findings (typically the CRITICAL + top 2 HIGH). For each, write:

```
TEST 1
Hypothesis: [If we change X to Y, then Z metric will improve because reason]
Variant: [Specific change to ship]
Primary KPI: [CVR / AOV / add-to-cart rate / scroll depth / etc.]
Expected lift: [Range, e.g. "8-15%"]
Confidence: [High / Medium / Low based on how directly the finding maps to the KPI]
```

Three tests max. These hand off to `test-prioritization-matrix` if the user wants to sequence and resource them.

---

## Step 4 — Output

1. Save the PDF file to `/mnt/user-data/outputs/[brand-name]-site-audit.pdf`
2. Call `present_files` with the file path
3. Follow with one short sentence in chat: the single highest-leverage fix from the audit

---

## Step 5 — Delivery Email (always include in chat)

After presenting the PDF, always print **two delivery emails** in the chat: a **Short Version** and a **Detailed Version**. Both are non-negotiable. Every audit run produces a PDF and both email versions.

---

### Context Check (run silently before drafting)

Before drafting either version, decide:

1. **Recipient name**
   - If a contact name is provided or known from context, use the first name (e.g. "Hey Cathy,")
   - If no contact name, use the brand team format (e.g. "Hey Larder & Vine team,")

2. **Warm or cold delivery**
   - **Warm** (just had a call, meeting, intro, or active conversation): open with the connection. Examples: "Great connecting today." / "Great chat earlier." / "Thanks for jumping on yesterday."
   - **Cold** (sending without a recent touchpoint): open with status. Example: "Hope things are going well on your end."
   - If unclear, default to **cold**.

3. **Sign-off**
   - **Warm**: "Best, Jason"
   - **Cold or first-touch**: "Best, Jason Condie"

---

### Version 1 — Short Version

Tight 4-priority email. Use when the recipient wants a quick read or the audit is being delivered alongside a longer call.


```

Hey [Name or Brand team],
[Warm or cold opener]
Took a close look at the site and put together a CRO audit (attached below). It's a collection of the highest-impact opportunities we see to improve conversion rate, primarily around [2-3 themes].
The main priorities:

* [Priority 1 framed as outcome]
* [Priority 2 framed as friction removal]
* [Priority 3 framed as trust / conversion lift]
* [Optional Priority 4 if needed]
The product is strong. The opportunity is making the experience easier to understand and faster to act on.
Let me know if you have any questions or need anything.
Best, [Jason or Jason Condie based on warm/cold]

```

**Filling it in:**

- **2-3 themes**: Pull from the audit dimensions where findings clustered. Pick from: clarity, trust, UX, offer, friction, urgency, navigation, proof, email capture.
- **Priority 1 (outcome)**: Frame as business result. Bad: "Rewrite the hero." Good: "Make it instantly clear what the product does and who it's for."
- **Priority 2 (friction removal)**: Frame around what gets easier. Bad: "Add a quiz." Good: "Cut the guesswork on which product fits their setup."
- **Priority 3 (trust / conversion lift)**: Frame around buying confidence. Bad: "Add reviews near CTA." Good: "Put proof and guarantees within eyeshot of the buy button."
- **Optional Priority 4**: Only if a 4th finding genuinely matters. Default to 3.

---

### Version 2 — Detailed Version

Full 6-finding email with nested bullets. Use when the recipient wants the substance in writing without opening the PDF, or when the audit is being sent cold.

This is the canonical shape. Match it.


```

Hey [Name or Brand team],
[Warm or cold opener]
Took a close look at the site and wanted to share a few initial thoughts when first landing on the homepage:

1. Hero: [One short framing sentence about what's competing or unclear]:

* [Specific item 1]
* [Specific item 2]
* [Specific item 3]
* [Specific item 4 if relevant]
[Recommendation line using softening voice. Examples: "I'd suggest adding..." / "My lean is..." / "One move:..."]

1. Navigation: [One short framing sentence]. [Recommendation softener]:

* [Sub-item 1]
* [Sub-item 2]
* [Sub-item 3]
* [Sub-item 4]

1. Trust and proof: [Framing sentence about where proof lives now]. [Recommendation softener]:

* [Move 1]
* [Move 2]

1. [Offer or urgency finding]: [Framing sentence]. [Listing softener like "A few things working against it:"]

* [Specific absence or symptom]
* [Specific absence or symptom]
* [Specific absence or symptom]
[Single recommendation sentence.]

1. [Email capture or related finding]: [Framing sentence about what's missing]. [Recommendation softener like "Three adds:"]

* [Recommendation 1]
* [Recommendation 2]
* [Recommendation 3]

1. [Section density or final finding]: [Framing sentence]. [Softener like "My lean:"]

* [Recommendation 1]
* [Recommendation 2]
* [Recommendation 3]
The product is strong. There's an opportunity to make the experience easier to understand and faster to act on.
Let me know if you have any questions or need anything.
Best, [Jason or Jason Condie]

```

**Filling it in:**

- **Number 6 findings, ordered by severity** (CRITICAL first, then HIGH, then MEDIUM). Each numbered finding maps directly to one PDF finding.
- **Framing sentences**: One short sentence per finding. State the observation, not the critique. Bad: "BOGO is announced but never made urgent." Good: "A few things working against it." or "It's mentioned at the top of the page but there's no popup, no inline form, no footer newsletter."
- **Sub-bullets**: Use when listing 3+ parallel items inside a finding (absences, sub-recommendations, or symptoms). 2-item lists can stay inline.
- **Softening voice on recommendations**: Use one of these patterns to introduce the fix:
  - "I'd suggest..."
  - "My lean is..."
  - "One move:" / "Two moves:" / "Three adds:"
  - "A few things working against it:" (when listing absences)
  - "Add a..." (direct, when context calls for it)
- **Closing line**: "The product is strong. There's an opportunity to make the experience easier to understand and faster to act on." Keep this exact wording.
- **Final line**: "Let me know if you have any questions or need anything." Keep this wording.

---

### Canonical Example (Detailed Version, Larder & Vine)

This is the exact shape and voice to match. Use this as the reference for tone, bullet structure, and softener placement.


```

Hey Cathy,
Great connecting today.
Took a close look at the site and wanted to share a few initial thoughts when first landing on the homepage:

1. Hero: Multiple messages compete for attention up top:

* Cook Cleaner
* 15% off
* BOGO Patio
* Culinary Creativity
A first-time visitor can't tell what the brand sells. I'd suggest adding a one outcome-led headline, one bestseller image, one primary CTA.

1. Navigation: Eight top-level menus with heavy overlap. My lean is to simplify these into four primary categories:

* Cookware
* Bakeware
* Tableware
* Bundles & Gifts

1. Trust and proof: Reviews, lifetime warranty, press mentions (PureWow, The Kitchn, Southern Living), and the shipping promise all sit way below the fold. Two moves:

* Add a 4-icon trust strip directly under the hero CTA
* Render press logos as actual brand marks, not text links

1. The BOGO offer: A few things working against it:

* No deadline
* No dollar savings shown
* No countdown
* Most products show identical "Regular" and "Sale" prices, which signals nothing is actually discounted
Add a sitewide promo bar with real savings and a real end date.

1. The 15% sign-up offer: It's mentioned at the top of the page but there's no popup, no inline form, no footer newsletter. Cold traffic that doesn't buy on the first visit leaves with no remarketing handle. Three adds:

* Exit-intent popup
* Footer form with a recipe hook
* 3-question cookware quiz

1. The homepage: 11+ sections with three different "Why Larder & Vine" panels saying overlapping things. My lean:

* Cut to six sections
* Consolidate the why-us copy into one 4-pillar strip
* Move Cathrineholm and Chef Series to dedicated pages
The product is strong. There's an opportunity to make the experience easier to understand and faster to act on.
Let me know if you have any questions or need anything.
Best, Jason

```

---

### Voice Rules for Both Versions

- Match Jay's voice: warm, direct, professional-casual.
- Recommendations soften with "I'd suggest" / "My lean is" / "Two moves" / "Three adds" / "A few things working against it." Not every recommendation needs a softener, but the overall feel should be peer-to-peer, not directive.
- Use sub-bullets when listing 3+ parallel items inside a finding.
- Never write critique-as-headline (e.g. "BOGO is announced but never made urgent"). State the observation conversationally, then bullet the specifics.
- No staccato "No X. No Y. No Z." patterns. Same prose-flow rule as the PDF, EXCEPT inside sub-bullets where each bullet is one absence on its own line (this is structural, not staccato prose).
- No banned words from the global preferences (delve, leverage, robust, seamless, etc.).
- No em dashes anywhere. Replace with periods or commas.
- Keep the closing two lines exact: "The product is strong. There's an opportunity to make the experience easier to understand and faster to act on." followed by "Let me know if you have any questions or need anything."

---

### Output Format in Chat

Print both versions as plain code blocks (```) so the client can copy-paste cleanly. Label each version with a short header.

Order:
1. One-sentence highest-leverage fix from Step 4 (already required)
2. **Short Version** label, then code block
3. **Detailed Version** label, then code block
4. **Test-First Handoff** label, then the 3 test blocks from Step 3.5 (these go to the user, not the client)

No commentary between or after the blocks. The user picks which email to send and uses the test handoff to plan implementation.

---

## Quality Check Before Saving

Before saving the file, verify:
- [ ] No finding claims inventory or stock state without browser confirmation
- [ ] No finding references a specific promo code without browser confirmation
- [ ] No finding describes popup behavior without browser confirmation
- [ ] No finding describes dynamic upsell module contents without browser confirmation
- [ ] Each finding has been internally classified Tier A, B, or C
- [ ] All Tier B findings have been spot-verified by the user or via Chrome MCP
- [ ] All Tier C findings have been browser-verified or dropped
- [ ] Landscape orientation, letter size
- [ ] Cover page includes brand name, agency name, date, and framing statement
- [ ] Each finding has a section number (01-06), BadgeDot severity badge, Current State card with accent line, and Opportunity box with exactly 3 bullets
- [ ] Findings are ordered CRITICAL, HIGH, MEDIUM
- [ ] MEDIUM findings share a page when they fit
- [ ] Final page has a 6-card prioritized grid (2 rows of 3)
- [ ] Branded accent bar at top of every page (full width, 3.5pt, SLATE)
- [ ] Footer on every page: page number right-aligned, thin divider above
- [ ] All copy is site-specific, not generic
- [ ] No finding uses "consider," "might," "could potentially," "it depends," "furthermore," or "additionally"
- [ ] No staccato "No X. No Y. No Z." triples anywhere in the copy. Triple-absences must be written as one flowing sentence.
- [ ] **Both delivery emails** are printed in chat after the PDF: Short Version and Detailed Version, each in its own code block, each labeled with a header
- [ ] Context check ran: recipient name resolved (first name or "Brand team"), warm/cold opener chosen, sign-off matches (Jason for warm, Jason Condie for cold)
- [ ] Detailed Version uses numbered findings (1-6) with sub-bullets when listing 3+ parallel items
- [ ] Detailed Version uses softening voice on recommendations ("I'd suggest" / "My lean is" / "Two moves" / "Three adds" / "A few things working against it")
- [ ] Closing lines are preserved exactly: "The product is strong. There's an opportunity to make the experience easier to understand and faster to act on." and "Let me know if you have any questions or need anything."
- [ ] No critique-as-headline phrasing (e.g. "BOGO is announced but never made urgent")
- [ ] Bold is used on key terms and problem labels via `<b>` tags, not sprayed everywhere
- [ ] No paragraph exceeds 3 sentences
- [ ] Every bullet contains exactly one idea
- [ ] A 10-second skim surfaces the top 3 problems without reading full paragraphs
- [ ] PDF renders cleanly with no missing fonts or broken layouts
- [ ] registerFontFamily() is called so `<b>` and `<i>` tags render correctly
- [ ] No Unicode subscript/superscript characters (use reportlab `<sub>` / `<super>` tags if needed)
- [ ] Page breaks land cleanly. No finding splits across two pages.
