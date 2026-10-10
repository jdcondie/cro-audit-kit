// references/tokens.js
// SINGLE SOURCE OF TRUTH for every [YOUR NAME] / agency deliverable.
// Every theme (docx, css, md) reads from here. Edit a value once, every output inherits it.
//
// Accent rule: client deliverables run HOUSE oxblood 8C2F26 on the Airy Minimal neutrals.
// Set by Jay, Aug 2026, replacing the old house orange E8541A on warm cream, which read as
// borrowed from Claude's palette. Cool greys + a warm accent is the only combination that
// keeps the boxes and kickers pulling; a full monochrome ramp flattens the hierarchy.
// Per-engagement `secondary` is allowed (client purple, agency navy, etc) and owns the
// tableHead and secondary headers when set. HOUSE always owns the cover accent, the section
// rule, and the finding-block frame.
// One sanctioned exception: the `strategy` sub-brand (Jay-solo strategy docs) runs amber
// B45309 on navy ink, per the shipped TAS look.
//
// ACCENT (orange) is NOT dead — it stays the accent for the non-client surfaces below
// (`rewrite` workbooks, `saas` landing pages, `alpine` dashboards), which are separate
// products with their own identities. Only the client deliverable surfaces moved.

const HOUSE = "8C2F26";    // oxblood — client deliverables (docx + pdf)
const ACCENT = "E8541A";   // orange — rewrite / saas / alpine surfaces only

// Airy Minimal neutrals (Jay, Aug 2026). The ramp tops out at 4.40:1 on white, so it owns
// fills, rules, zebra and tints; ink and body come from outside it, and `muted` is the ramp's
// darkest step nudged to 5F6B75 so small text clears 4.5:1 in print.
const N = {
  ink: "1F2A33", body: "2B3843", muted: "5F6B75",
  rule: "D1DADF", zebra: "F5F7F8", tint: "E6ECEF",
  fill: "F8F0EE",      // oxblood-tinted finding-block fill
  hairline: "A9B4BD",  // thin stat-card border
};

const brand = {
  name: "[YOUR NAME]",   // canonical author signature (internal + personal docs)
  agency: "[AGENCY]",   // client-deliverable brand. Set to the agency name once. Client audits pass preparedBy: brand.agency
};

const shared = {
  accent: ACCENT,
  brand,

  // page geometry (DXA / twips; 1 inch = 1440)
  page: {
    letter: { width: 12240, height: 15840 },
    marginStandard: 1440, // 1.0" — memos, audits, exec summaries
    marginCompact: 1080,  // 0.75" — dense audits, workbooks
  },

  // type scale in POINTS. docx builders convert to half-points (x2). css uses px ~= pt*1.333.
  type: {
    cover: 32,            // single-line cover title (was 40)
    coverStrategy: 28,    // strategy/research cover: brand line and title share this size (Client A, Aug 2026)
    coverDescriptor: 13,  // the "Competitive Research + Offer Recommendations" line under a strategy title
    h1: 18,
    h2: 13,
    kicker: 9,
    body: 10.5,           // sweet spot between corporate 10 and JCM 11
    note: 10.5,           // callout-box text + soWhat italic notes. Jay, Aug 2026: these read
                          // too small at 8.5 in client docs. Tunable independently of `body`.
    small: 8.5,           // cover meta lines only (prepared-by role, editorial byline role)
    caption: 9,
    tableHead: 9,
    tableCell: 9.5,
    kpi: 22,
    // editorial cover (Money Story layout) uses a serif scale
    serif: {
      title: 48,           // line 1 of two-line title ("The")
      titleEmphasis: 55,   // line 2, accent color, bold ("Money Story.")
      subtitle: 15,        // italic-feeling subtitle pair
    },
  },

  // vertical rhythm in twips
  space: { tight: 80, base: 160, loose: 240, section: 480 },

  // density variants. chosen per deliverable at build time.
  density: {
    compact: { bodyAfter: 100, line: 280, h1Before: 360, h1After: 160 },
    airy:    { bodyAfter: 160, line: 320, h1Before: 480, h1After: 200 },
  },

  // cover-specific vertical positions (twips). every cover variant pulls from here.
  covers: {
    classic:   { topDrop: 1400, ruleDrop: 2600 },
    stacked:   { topDrop: 1200, dateAfter: 600 },
    editorial: { topDrop: 2600, taglineAfter: 600, titleAfter: 500, subtitleAfter: 1200 },
  },

  // file naming for every deliverable: client-deliverable-YYYY-MM-DD.ext
  naming: "{client}-{deliverable}-{date}",

  // metric formatting. applies in docx tables AND markdown output.
  metrics: { roas: "0.00", cpa: "$0", pct: "0.0%", money: "$0,0" },

  // semantic delta colors (positive/negative movement in reports). shared by every client sub-brand.
  semantic: { good: "059669", bad: "991B1B" },

  // every deliverable skill ends on this contract (see its quality checklist)
  contract: ["cover", "consistent footer w/ page number", "locked section order", "TOC only at 12+ pages", "named per convention"],
};

const themes = {
  // CLIENT — split into two sub-brands. Each deliverable picks one at build time.
  client: {
    // corporate — navy/Calibri variant for corporate/enterprise clients (shipped: Client E).
    // Most agency-branded audits ship the `jcm` look below.
    corporate: {
      fonts: { display: "Calibri", body: "Calibri", serif: "Georgia", mono: "Consolas" },
      colors: {
        ink: N.ink, body: N.body, muted: N.muted,
        accent: HOUSE,
        secondary: "1F3A5F",     // navy. tableHead + secondary headers when set.
        rule: N.rule,
        fill: N.fill,            // finding-block fill
        zebra: N.zebra,
        tableHead: "1F3A5F",     // navy header by default (overridable per-doc via secondary)
        tableHeadText: "FFFFFF",
        tableTint: "EEF2F7",     // borderless card-table fill
        kpiBorder: N.hairline,   // thin per-cell stat-card border (shipped: Client B)
      },
    },
    // jcm — the house default. Agency audits and short memos (shipped: Client A, Client B,
    // Client F) plus growth audits, CRO docs, offer strategy.
    jcm: {
      fonts: { display: "Arial", body: "Arial", serif: "Georgia", mono: "Consolas" },
      colors: {
        ink: N.ink, body: N.body, muted: N.muted,
        accent: HOUSE,
        secondary: null,
        rule: N.rule,
        fill: N.fill,            // pale-oxblood finding-block fill
        zebra: N.zebra,
        tableHead: N.ink,        // dark slate header by default
        tableHeadText: "FFFFFF",
        tableTint: N.tint,
        kpiBorder: N.hairline,   // thin per-cell stat-card border (shipped: Client B)
      },
    },
    // strategy — Jay-solo strategy docs (shipped: TAS 90-Day Strategy). Navy ink, amber kickers.
    // The sanctioned exception to the house-accent rule: `accent` here is amber, and it owns
    // kickers, KPI values, and finding bars. Left on its shipped palette through the Aug 2026
    // oxblood switch. Amber and oxblood are closer than amber and orange were, so if this look
    // and a jcm doc ever go out together, check they still read as different documents.
    strategy: {
      fonts: { display: "Calibri", body: "Calibri", serif: "Georgia", mono: "Consolas" },
      colors: {
        ink: "1F2A44", body: "1F2A44", muted: "6B7280",
        accent: "B45309",        // amber
        secondary: "1F2A44",
        rule: "D8D8D2",
        fill: "F7F3E8",          // finding-block fill
        zebra: "F8F9FB",
        tableHead: "1F2A44",
        tableHeadText: "FFFFFF",
        tableTint: "EEF2F7",
        kpiBorder: "B45309",
      },
    },
  },

  // PDF — landscape reportlab site audits (cro-site-audit). House palette on the PDF surface.
  // reportlab has no Arial: register Helvetica as the metric twin. No CDN font downloads.
  pdf: {
    fonts: { display: "Helvetica", body: "Helvetica" },
    colors: {
      paper: "FFFFFF", ink: N.ink, body: N.body, muted: N.muted,
      accent: HOUSE, rule: N.rule,
      card: N.tint,             // current-state card fill
      panel: N.zebra,           // secondary panel fill
      opportunityBox: N.ink,    // dark opportunities box, white text, accent labels
    },
  },

  // REWRITE — editorial workbook / journal (Word). serif headlines, peach contrast.
  rewrite: {
    fonts: { display: "Georgia", body: "Arial" },
    colors: { ink: "1A1A1A", muted: "555555", accent: ACCENT, rule: "D8D8D2", anchor: "F4F4F2", peach: "FBEDE5" },
  },

  // SAAS — marketing / landing pages (HTML). white, orange, Plus Jakarta.
  saas: {
    fonts: { display: "Plus Jakarta Sans", body: "Plus Jakarta Sans" },
    colors: { bg: "FFFFFF", ink: "111111", accent: ACCENT, cardBorder: "D4D4D4" },
    radius: { card: 12, button: 8, pill: 100, tag: 6 },
  },

  // ALPINE — dark dashboards / mission-control (HTML). navy steps, amber, mono numbers.
  alpine: {
    fonts: { display: "Inter", body: "Inter", mono: "JetBrains Mono" },
    colors: { void: "0B0E14", base: "11151F", elevated: "1A2030", overlay: "242C3D", text: "E8EBF0", accent: ACCENT },
  },
};

module.exports = { shared, themes, ACCENT, HOUSE };
