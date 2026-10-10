# CRO Audit — Diagnosis Core

Canonical diagnosis layer for CRO / site / page audits. Templated onto the shared kit: it loads `references/guardrails.md` and the voice from `references/audit-voice.md`, then adds the CRO specifics.

CRO deliverables are page/site-oriented, not account-oriented, so the **section structure stays per the deliverable** (`cro-site-audit` PDF, `cro-opportunities-memo` DOCX, `cro-audit` markdown). What's shared from the kit: voice, guardrails, diagnose-before-prescribe, the length toggle, and the deep-dive handoff pattern.

## Data sources

Primary: a live URL (fetch) or a screenshot. Optional, and required for the data-driven deep-dives: GA4 / analytics, full-funnel data, heatmaps (Hotjar / Clarity), session recordings, form analytics, checkout-funnel data. Identify what's available first; a deep-dive that needs data it doesn't have gets flagged, not faked.

## Tier D — behavior over time (the tier the A/B/C system misses)

Tiers A/B/C sort claims by **feature** and test the **method**: was a browser used. That passes a claim that is still wrong, because a browser sighting proves a thing exists and never proves when it appeared. Tier D sorts by **what kind of assertion the sentence makes**.

A claim is Tier D if it carries a trigger, a delay, a sequence, or a frequency. Watch for: *fires on load, immediately, right away, before the visitor sees, the first thing, after scrolling, on exit intent, every visit, each time, once per session.*

**Tier D needs an instrumented number, not a screenshot.**

- Poll or observe the DOM and report elapsed time from navigation start. `performance.now()` at the moment of appearance, not wall-clock guessing.
- **Tool-call order is not a clock.** A clean page in call 2 and a widget in call 4 tells you nothing about the delay, and if the early call contradicts the claim you are about to write, the early call wins. Re-read your own earlier artifacts against the sentence before shipping it.
- Put the measured number in the finding. "Takes over the homepage about 11 seconds in" is a finding. "Loads over the homepage" is a guess wearing a finding's clothes.

**Stateful widgets need cleared state.** Klaviyo, Privy, Justuno, OptiMonk, Wisepops, and every A/B or personalization framework write a seen/dismissed key on first interaction. Once you dismiss one, every later look is a returning-visitor view.

- Read `localStorage`, `sessionStorage` and cookies for the suppression key, clear it, reload, then measure.
- Name the app and the suppression behavior **in the deliverable**. The client will go look, see nothing, and doubt the whole audit. One sentence prevents it: "The panel is a Klaviyo form and Klaviyo hides it once someone closes it, so it won't reappear on a browser that's already dismissed it."

## Tier E — what a human actually sees (the pixel tier)

Tier D catches claims about *when*. Tier E catches claims about *what's on screen*, and it is the one that breaks audits of image-heavy and video-heavy brands.

**The DOM is not the page.** Headline copy is routinely painted into hero videos, banner images, and lifestyle shots. A text extraction returns nothing for all of it. Every text tool you have (`get_page_text`, `innerText`, `web_fetch`) is blind to type that lives in a media file, and so is Google, which is itself a finding worth making.

**Rules:**

- **Any claim about what a visitor perceives is settled on a screenshot, not a text dump.** Run the 5-second test against the image. Reading `innerText` and judging the first screen from it is running the test blindfolded.
- **Never assert absence from a text tool.** "There is no headline" sourced from a DOM read is unsupported. Absence in the DOM proves only that a thing is not *text*. Either look at pixels, or narrow the sentence to what you actually checked: "no headline in the page's text," "nothing Google can read."
- **When an image you already captured disagrees with the sentence you are writing, the image wins.** Go back and re-read your own screenshots against the claim before it ships. (Client C, Aug 2026: the brand wordmark was legible in the very first screenshot, and a later DOM read that returned nothing overrode it. It took the client sending back his own screenshot to catch.)
- **Check for copy baked into media** whenever a hero is a video or a full-bleed image: sample frames across the loop, note the native resolution against its display size, and say whether the type is editable in the theme or requires re-rendering the file. That difference decides whether the fix is a settings change or a production job.

**Negative claims cost more than positive ones.** "There is an X" needs one artifact. "There is no X" needs you to have looked everywhere X could be. Before writing *no, nothing, never, none, zero, not a single*, name where you looked. If you can't, write the positive version of what you did observe.

## Fold claims are viewport-conditional

Above-the-fold and below-the-fold are functions of screen size, not properties of a page. One viewport proves nothing general.

- Test at a laptop (1280x800 or 1366x768) **and** a large monitor (1440x900 or above), plus mobile. Record the pixel offset of the element against each viewport height.
- State the condition in the finding. "About 20 pixels under the fold at full size and well under it on a laptop" is a finding. "Below the fold" is a coin flip that the client resolves by opening the page on the screen you didn't test.
- Assume the client reads the deliverable on the largest screen they own, and assume their customers do not.

## Evidence-to-claim pass (run before building the deliverable)

For every finding, write the artifact that proves it beside the sentence, then match the artifact to the claim type:

| The sentence asserts | Sufficient evidence |
|---|---|
| exists / says / links to | screenshot or DOM read |
| is visible to a human | computed geometry (rect, opacity, overflow), not presence in the HTML |
| **what a visitor sees on the first screen** | **a screenshot. Never a text extraction, which is blind to copy inside video and images** |
| **nothing / none / no X is present** | **pixels at 2+ viewports, plus a named list of where you looked. DOM absence is never sufficient** |
| **above or below the fold** | **measured offset at a laptop and a large monitor, with the viewport named in the finding** |
| when / how often / in what order | timestamped measurement |
| what a first-time visitor sees | cleared state, then measure |

If the artifact doesn't match the claim type, either go get the right artifact or narrow the sentence to what you actually verified. Provenance: Client C, Aug 2026.

## Stance

Judge as a cold first-time visitor. Run the 5-second test before any tactic. Diagnose friction before prescribing changes. Prioritize every finding by revenue impact.

## Standard findings (~4-5, consolidated)

1. **Above-the-fold clarity** — does a cold visitor know what's sold, who it's for, why it matters, and what to do, in 5 seconds.
2. **Page friction** — the highest-leverage page (PDP / landing / sales), its friction points and copy.
3. **Funnel & checkout** — where users drop: cart, checkout, forms.
4. **Trust, pricing & urgency** — proof and trust signals, pricing presentation, credible (not fake) urgency.
5. **Behavioral evidence** — only if heatmap / session / analytics data is provided.

## Deep-dive handoffs

Audit-depth findings here. For depth on one area, hand to its specialist instead of going deeper inline. Don't duplicate their logic.

| Section | Specialist skill | Needs |
|---|---|---|
| Above-the-fold | `5-second-cro` (not included in this kit) | URL/screenshot |
| PDP | `pdp-teardown` (not included in this kit) (Shopify mode on Shopify stores) | URL/screenshot |
| Landing / sales copy | `landing-page-auditor` (not included in this kit) | screenshot + offer/audience |
| Mobile | `mobile-friction-diagnostic` (not included in this kit) | URL/screenshot |
| Checkout | `checkout-dropoff-analysis` (not included in this kit) | checkout funnel data |
| Forms | `form-analytics-diagnostics` (not included in this kit) | form analytics |
| Funnel step | `funnel-leak-detection` (not included in this kit) | full-funnel data |
| Sudden CR drop | `conversion-drop-diagnostics` (not included in this kit) | traffic/device/page/checkout data |
| Heatmaps | `heatmap-pattern-decoder` (not included in this kit) | heatmap export |
| Session recordings | `session-recording-analyzer` (not included in this kit) | recordings |
| Pricing | `pricing-psychology-scanner` (not included in this kit) | URL/screenshot |
| Urgency / scarcity | `urgency-scarcity-audit` (not included in this kit) | URL/screenshot |
| Competitor page | `competitor-conversion-teardown` (not included in this kit) | competitor URL |

Checklists: the trust and CTA checklists from the retired `ai-powered-cro-analysis` now live in `references/page-checklists.md`. Route every page audit through `/cro`. Copy audits: `landing-page-auditor` and `direct-response-copy-audit` (not included in this kit) overlap; prefer `landing-page-auditor` for ranked copy fixes from a live page or screenshot, `direct-response-copy-audit` for the full direct-response teardown of pasted copy.

## Guardrails (shared + CRO-specific)

Load `references/guardrails.md`. Add: judge as a cold visitor; 5-second test before tactics; diagnose friction before suggesting changes; prioritize by revenue impact; no dark patterns; credible urgency only (never fabricated scarcity); for the opportunities memo, frame everything as wins.

## Diagnosis handoff

Prioritized findings by revenue impact, each tied to the specific page element or data point, framed as opportunities. Pass to the chosen deliverable (`cro-site-audit` / `cro-opportunities-memo` / `cro-audit`) plus URL/screenshot, business model, primary goal, prior tests, and client experience level.
