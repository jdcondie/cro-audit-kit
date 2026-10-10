# Audit Voice (client-facing) — shared across all audits

The **default** register for every client-facing audit deliverable, any channel (Meta, Google, and on). Calm senior strategist talking to a client, not an essayist performing. Warm, plain, direct. The client should feel seen and educated, never lectured or attacked.

This is canonical for voice on the audit family. It replaces the punchier operator-essay register for these documents, you don't need the user to ask for it. Use it by default whenever you're producing an audit, whether or not you arrived through a router.

This sets REGISTER. All of your universal rules still apply on top: no em dashes, no banned words, no negation flips, digits for numbers, contractions always.

**Optional: keep a red-pen file.** If you log your own pre-send edits as rules, load that file with this one and run it as a self-edit pass before handing over any draft.

The register's core failure mode, named: **warm means kind about the client's business, never chatty about your own document.**

Note: the CRO audit family (`cro-audit`, `cro-site-audit`, `cro-opportunities-memo`) has its own `references/voice.md` with beginner/intermediate tone calibration. Leave that as-is unless told to unify; this kit voice is the default for Meta and Google audits.

---

## Stance

- Second person. Speak to "you / your" (the client).
- First-person calibration, two lanes (lane must match the theme sub-brand; ask which lane at kickoff when ambiguous):
  - **Agency lane** (sub-brand `jcm` by default, `corporate` for enterprise clients; agency-branded client work): "we / we'd" throughout.
  - **Solo lane** (sub-brand `jcm`, your own pipeline): "I" owns judgments, preferences, and asks ("I'd still split brand," "I prefer month-to-month"); "we" owns future joint execution with the client ("We'd lock today's numbers as the starting line," "we can jump on another call"). Headers with an actor take "I": "What I'd recommend," "How I'd approach the relaunch."
- Calm and collaborative. You're a peer who's seen the pattern before, explaining it kindly.
- Opportunity framing, always. "Places where we see room to get more out of the same spend," not "problems" or "what's broken." Don't trash the incumbent. Let the data carry it.
- Plain over punchy. State the finding in normal language. Skip the slogan headlines and the branded section names ("The Reveal," "The Wedge"). Use plain sections: Summary, Performance Snapshot, What's Working, the numbered findings, The Page, First 30 Days.

## Branding, close, and sign-off (two lanes)

Which lane a document ships in follows the engagement, and the cover, pronouns, close, and sign-off all move together (agency rule set from your Client A edit, Aug 2026; solo rule set from his a prospect edit, Aug 2026).

**Agency lane** (agency client work):
- Cover: `preparedBy: S.brand.agency` (the agency name, set once in `tokens.js`). Title the document by what it is (Landing Page Audit, Meta Ads Audit), brand as subtitle.
- No personal greeting, no "Talk soon, / [YOUR NAME]." Close on: "Questions on any of it, shoot us a message. Happy to jump on a call and go through it together."
- "Shoot us a message," never "text me."

**Solo lane** (your own pipeline, sub-brand `jcm`):
- Cover: `preparedBy: "[YOUR NAME]"`.
- **The close (first-send pitch docs):** "If you wanted to run this with me and my team, here's what that includes:" + plain lowercase scope bullets + "I prefer month-to-month because I'd rather earn the commitment than lock it up in a contract." + an invite to a call. No pricing, no terms/cadence table, no protection cross-references. Pricing waits for the call.
- **The sign-off:** a pushback invite plus a respect line ("If the math reads off anywhere, or you'd push back on any of this, tell me. You know this business from the inside in ways an audit can't."). No dated promises, no start-date logistics, no "text me anytime" in the document — that register belongs in your cover email.
- No portfolio/strategy flattery paragraphs in the close. The doc sells the work; the call sells the relationship.

Both lanes: no personal greeting ("Hey,") — open straight into the first paragraph.

## Verdicts and framing (client register)

These came from red-pen passes on shipped deliverables. They're the default now, not suggestions.

- **Soften verdict words.** "Needs work," not "Nothing." A gap is named kindly, then quantified.
- **Frame deficits as goals.** "You want the person your ad sent to see himself using the product," not "the person doesn't see himself in it."
- **No acquisition-cost shaming.** Never stage a scene where "a customer who cost you $49 gets told they lost." State the positive standard instead ("this should be a win-win for a potential customer").
- **Hedge outcome claims.** "Could be the quickest way," not "is the quickest way." Predictions are hedged; observed facts are not.
- **Recommendations as suggestions.** "I'd cut the slider to 4 or 5," not "Cut the slider." (Or "we'd," per the first-person calibration.)
- **No internal notes in client copy.** Verification receipts ("I ran it myself and the cart came back at..."), pre-publish checks ("confirm this number before it goes live"), and methodology asides stay in the chat handoff to the user. The client doc states the finding cleanly.
- **Attribution caveats live in the chat handoff, not the document.** Guardrail #3 (platform numbers are platform-attributed, ground-truth before targets) still applies in full; deliver it to the user alongside the doc, not to the client inside it.
- **KPI columns key off the business model, then the audit type.** Most of your audits are ecommerce; lead gen is the exception, not the default.
  - *Ecom account audit* (the majority): spend, purchases, revenue, blended return, cost per purchase, AOV. Return math is the subject; keep it (Client B pattern).
  - *Lead-gen account audit*: spend, leads, CPL, with CTR/CPM as diagnostics (Client E pattern). No revenue or ROAS columns; the platform can't see close rates, and implying it can breaks the no-fabrication guardrail.
  - *Site / landing-page audit* (either model): lead with spend, orders (or leads), sales. Drop the return-per-dollar column (set by your Client A edit); the page is the subject, not the ad economics.

## Say it once

The decisive move is stated once, inside the section that owns it. No closing callout restating it, no "this is the one that matters most" escalation, no summary sentence repeating the section's own point back ("that's the whole audit in a sentence"). Recap bullets stand alone as plain imperatives with no justification clauses; the sections already made the case.

## Rhythm

- Short paragraphs, 1-3 sentences. Vary length. Calmer cadence than your social voice, fewer staccato fragments.
- Gentle hedges are fine here and read as honest: "Worth noting that...", "which is good in some ways, but...", "there's some upside there too."

## Section headers

**A header names its subject in plain words. Nothing else.** Someone scanning the document should know exactly what each section covers without reading a line of body copy.

Good: `Summary`, `Structure & spend`, `Creative`, `The funnel`, `The landing page`, `Pricing`, `Mobile`, `Product pages`, `Proof and guarantee`, `What we'd recommend` (solo lane: `What I'd recommend`).

Never use:
- Metaphors. "Clear the doorway" doesn't tell anyone the section is about popups.
- Slogans or branded blocks. "The Reveal," "The Wedge," "The Big Idea," "The Decisive Move."
- Labels that need the body copy to decode. "The focus," "What's next," "Win 3."
- Insight sentences. "Your homepage is your best salesperson" reads well and navigates badly.

**The insight belongs in the first sentence of the section, bolded.** That way the header carries the map and the lead-in carries the finding:

> **Structure & spend**
> **Spend concentration at the campaign level is fine:** prospecting is 81% of spend, retargeting 13%. Underneath, though, the account holds 199 ad sets...

> **Pricing**
> **Your product page shows one price and your cart charges another.** The page shows $30.59 with $35.99 crossed out beside it...

A header that tries to carry the insight too ends up doing neither job well. Split them.

If two sections would end up with the same plain header, that's a signal they're one section. Merge them.

Named lead-ins inside `finding()` callouts (WHAT TO CHANGE / THE BIGGEST, SIMPLEST MOVE / RECAP / SHIP EARLY) are the sanctioned home for these labels. They live in the box, never as section headers.

## Numbers

- **Every data table names its date range and scope, in the document.** A line under the table: "August 2025 through August 10, 2026, all campaigns, split by landing page." Never "since you started" or an unlabeled window. Clients read audits next to their own Ads Manager, which defaults to last 30 days with filters they forgot they applied; an unlabeled table guarantees a "your numbers don't match" email (this happened on the Client A audit, Aug 2026, and the sender had to apologize for the labeling).
- When quoting platform numbers in a live client exchange, re-pull first and state the pull date. Meta restates the trailing ~7 days as attribution completes, so numbers older than a day lose arguments against a client's live screen.
- Every number gets a comparison frame. Not "ROAS 2.51," but "a 2.51 return, with your best week at 3.57." Not "$3,000 wasted," but "about $3,000, roughly 8% of spend, that we'd move into the pockets already working."
- Translate jargon at first use, calibrated to the reader. "Back per $1" beats ROAS for a beginner. Where a technical term has to appear (learning phase, CAPI, MER), one clause explains why it matters.

## Honesty

- Platform numbers get flagged as platform-generous: "These come from what Facebook reports, and Facebook is generous to itself. Worth sanity-checking against your Shopify totals."
- Benchmarks are labeled directional: "working ranges for this category, not a formal index." Never presented as absolute targets.
- Own errors get admitted plainly when a prior read was wrong: "The first version of this audit told you to collect 1,200 reviews. That was wrong."
- Uncertainty is stated, not smoothed over: "It may not have come up for me because of cache, wanted to make sure before launch."
- Say what the document deliberately leaves out: "What this doc is not: a 30-page strategy deck. I cut the theory."

## Structure of a finding

State it the way Client E does: the situation in plain words, the data underneath, then what we'd do, woven together rather than split into leak/data/move labels.

> Spend is concentrated in one campaign and one ad set. Your prospecting campaign carries 81% of spend, which is fine, but underneath it 199 ad sets are splitting the budget into pieces too small to learn from. Meta's own opportunity score flags this as the single biggest fix in the account, worth about 23% lower cost per purchase. We'd collapse it to a lean set: one broad prospecting campaign, one for testing, one for retargeting, one catalog.

## Recommendations

Numbered list, each with a bold lead-in phrase, then a plain explanation. Client E style:

> 1. **Reviews in the buy box.** A star rating and review count next to the price, so the proof is the first thing people see.
> 2. **A clearer hero.** One line that names the product and who it's for, plus a visible button above the fold.

Write the recommendation as finished copy, not an instruction. "A more specific headline" is homework; supply the headline: "VA Loan Pre-Approval for Veterans. In 2 Minutes. No Hit to Your Credit." When it could genuinely go more than one way, give 2-3 labeled options (Option 1 / 2 / 3) with a stated first choice and the reason.

No effort tags. Easy / Medium / Hard are dead in client deliverables (your call, Aug 2026, reversing the earlier Gen-3 rule). Priority is carried by ordering and the one biggest move.

Lead-in punctuation: recommendation bullets open with a bold sentence and a period ("**Reviews in the buy box.** A star rating..."). Fact-list bullets (What's Working and similar) open with a bold label and a colon ("**Unit margins:** 80%+ product margins..."). Label → colon; sentence → period.

## Flag the biggest move plainly

Name the single highest-leverage move in plain terms and make it feel easy. The flag lives in exactly one place: either inside the section that owns the move, or as the `finding("The biggest, simplest move", ...)` box in the Recap (the a prospect pattern) — never both. Per "Say it once," whichever home it gets, the other never restates it. No calendar promises ("under a week").

## Cover

Keep it plain and professional, no clever titling. Use `coverStacked` with an empty `kicker`, `title: "Meta Ads Audit"`, `subtitle: "<Brand name>"`, and the date. `preparedBy` follows the lane: the agency name (`S.brand.agency`) or "[YOUR NAME]" (see Branding, close, and sign-off). No headline slogan on the cover, no "where the next gains are" wording. The document type is the title; the client name is the subtitle.

## What to avoid

- Slogan headlines and branded blocks ("The Reveal," "The Wedge," "Decisive Move") as section headers. (As `finding()` callout lead-ins they're fine; see Section headers.)
- Harsh diagnosis language ("leak," "wasted," "failure") in the client-facing copy. Internally it's a leak; to the client it's an opportunity.
- Composite scores. No 0-100 health scores or letter grades in client deliverables. Priority is carried by ordering and the one biggest move. (The 5-Second Test's X/10 per question is the lone exception.)
- Checkmark or emoji bullets, and emoji anywhere in body copy. (Emoji may appear only inside quoted copy suggestions for the client's own site.)
- Bare "Findings:" / "Key Recommendations:" as the only structure.
- Direct-response artillery in the audit's own voice: bonus stacks, countdown urgency, dollar-value anchoring ("$1,244 of value FREE"). Suggested client copy can use those moves; the audit never does.
- "Auditor: Name / Date:" metadata stacks. The cover block carries that.
- Leftover research citations or source tags pasted into client-facing sentences.
- Over-punching. This register is warmer and more explanatory than your LinkedIn voice. When in doubt, sound like a trusted operator walking a client through it on a call.
