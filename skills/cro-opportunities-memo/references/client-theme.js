// references/client-theme.js
// Client-deliverable docx theme (audits, memos, reports, exec summaries).
// Runs on docx-js. Reads every value from ./tokens.js. Zero hardcoded fonts/hex/margins.
//
// Usage:
//   const { createClientTheme } = require('./client-theme');
//   const C = createClientTheme({ subBrand: 'corporate', density: 'compact', secondary: '6E5BD3' });
//   const doc = C.build({ children: [...C.coverStacked({...}), C.h1('Section'), ...], label: 'Client · Memo' });
//
// Backward compat: default export instance is jcm + airy + standard margin. Existing
// `const C = require('./client-theme')` style imports keep working.

const {
  Document, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType, TableLayoutType,
  Footer, PageNumber, PageBreak, TabStopType,
} = require("docx");
const { shared: S, themes } = require("./tokens");

const hp = (pt) => Math.round(pt * 2); // points -> half-points

function createClientTheme(opts = {}) {
  const subBrand = opts.subBrand || "jcm";
  const densityKey = opts.density || "airy";
  const marginKey = opts.margin || "standard";
  const secondary = opts.secondary || null;

  const T = themes.client[subBrand];
  if (!T) throw new Error(`Unknown client subBrand: ${subBrand}. Use 'jcm', 'corporate', or 'strategy'.`);

  const F = T.fonts;
  // resolve colors. shared semantic deltas first, sub-brand base over them, per-doc secondary last.
  // per-engagement palette override, applied over the sub-brand. Use for a client whose deliverables
  // need their own neutrals or accent; pass only the keys you're changing.
  const C = { ...S.semantic, ...T.colors, ...(opts.colors || {}) };
  if (secondary) {
    C.secondary = secondary;
    C.tableHead = secondary; // per-doc secondary owns the dataTable header
  }
  const D = S.density[densityKey];
  const M = marginKey === "compact" ? S.page.marginCompact : S.page.marginStandard;

  const PAGE = { size: S.page.letter, margin: { top: M, bottom: M, left: M, right: M } };
  const CW = S.page.letter.width - M * 2; // usable content width (DXA)

  const docStyles = {
    default: {
      document: { run: { font: F.body, size: hp(S.type.body), color: C.body } },
      paragraph: { paragraph: { spacing: { after: D.bodyAfter, line: D.line } } },
    },
  };

  // ---------- border helpers ----------
  const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const HAIR = { style: BorderStyle.SINGLE, size: 4, color: C.rule };
  const noBorders = () => ({ top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE });
  const rowRules  = () => ({ top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: HAIR, insideVertical: NONE });

  // ---------- text builders ----------
  const kicker = (text) => new Paragraph({
    keepNext: true, spacing: { after: S.space.tight },
    children: [new TextRun({
      text: String(text).toUpperCase(), bold: true, allCaps: true,
      color: C.accent, font: F.display, size: hp(S.type.kicker), characterSpacing: 24,
    })],
  });

  const h1 = (text) => new Paragraph({
    keepNext: true, spacing: { before: D.h1Before, after: D.h1After },
    children: [new TextRun({ text, bold: true, color: C.ink, font: F.display, size: hp(S.type.h1) })],
  });

  const h2 = (text) => new Paragraph({
    keepNext: true, spacing: { before: S.space.loose, after: S.space.tight },
    children: [new TextRun({ text, bold: true, color: C.ink, font: F.display, size: hp(S.type.h2) })],
  });

  // inline run parser: `**bold**` markup → bold runs. odd split segments are bold.
  // b = { bold, italics, color, font, size }. Plain strings (no **) yield one run, so callers are backward compatible.
  const mkRuns = (text, b) => String(text).split("**").map((seg, i) => new TextRun({
    text: seg, bold: !!b.bold || i % 2 === 1, italics: !!b.italics, color: b.color, font: b.font, size: b.size,
  }));

  const body = (text, o = {}) => new Paragraph({
    spacing: { after: o.after ?? D.bodyAfter, line: D.line },
    alignment: o.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: mkRuns(text, { bold: !!o.bold, italics: !!o.italics, color: o.color || C.body, font: F.body, size: hp(o.size || S.type.body) }),
  });

  const bullet = (text) => new Paragraph({
    bullet: { level: 0 }, spacing: { after: S.space.tight, line: D.line },
    children: mkRuns(text, { color: C.body, font: F.body, size: hp(S.type.body) }),
  });

  // narrative "so what" line under every table
  const soWhat = (text) => new Paragraph({
    spacing: { before: S.space.tight, after: S.space.loose },
    children: [new TextRun({ text, italics: true, color: C.muted, font: F.body, size: hp(S.type.note) })],
  });

  // THE box frame for client deliverables: 4-sided accent outline + pale fill.
  // Jay, Aug 2026: the accent left-bar frame is retired. Every box in a client deliverable
  // uses this outline so the doc carries one box style. finding() adds a caps label on top;
  // callout() is the labelless italic sibling. Change it here and both move together.
  const boxEdge = () => ({ style: BorderStyle.SINGLE, size: 8, color: C.accent });
  const boxBorder = () => ({
    top: { ...boxEdge(), space: 8 },
    bottom: { ...boxEdge(), space: 8 },
    left: { ...boxEdge(), space: 12 },
    right: { ...boxEdge(), space: 12 },
  });

  // outlined finding / reveal block, with an accent caps label on the first line
  const finding = (label, text) => new Paragraph({
    spacing: { before: S.space.base, after: S.space.base },
    border: boxBorder(),
    shading: { type: ShadingType.CLEAR, color: "auto", fill: C.fill },
    children: [
      new TextRun({ text: String(label).toUpperCase(), bold: true, allCaps: true, color: C.accent, font: F.display, size: hp(S.type.kicker), characterSpacing: 18 }),
      new TextRun({ text, break: 1, color: C.ink, font: F.body, size: hp(S.type.body) }),
    ],
  });

  // labelless italic callout. same outline frame as finding().
  const callout = (text) => new Paragraph({
    spacing: { before: S.space.base, after: S.space.loose },
    border: boxBorder(),
    shading: { type: ShadingType.CLEAR, color: "auto", fill: C.fill },
    children: mkRuns(text, { italics: true, color: C.ink, font: F.body, size: hp(S.type.note) }),
  });

  // 9pt accent caps label / 12pt ink value pair. used in covers + section openers.
  const metaPair = (label, value) => [
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [new TextRun({
        text: String(label).toUpperCase(), bold: true, allCaps: true,
        color: C.accent, font: F.display, size: hp(S.type.kicker), characterSpacing: 18,
      })],
    }),
    new Paragraph({
      spacing: { before: 0, after: S.space.base },
      children: [new TextRun({ text: String(value), color: C.ink, font: F.body, size: hp(12), bold: true })],
    }),
  ];

  // KPI stat strip: [{value,label}] x 2-4
  const kpiRow = (items) => {
    const w = Math.floor(CW / items.length);
    const bd = { style: BorderStyle.SINGLE, size: 4, color: C.kpiBorder || C.rule };
    const cellBorders = { top: bd, bottom: bd, left: bd, right: bd };
    return new Table({
      width: { size: CW, type: WidthType.DXA }, columnWidths: items.map(() => w), layout: TableLayoutType.FIXED,
      borders: { top: bd, bottom: bd, left: bd, right: bd, insideHorizontal: bd, insideVertical: bd },
      rows: [new TableRow({ children: items.map((it) => new TableCell({
        width: { size: w, type: WidthType.DXA }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 80, right: 80 },
        children: [
          new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: String(it.value), bold: true, color: C.accent, font: F.display, size: hp(S.type.kpi) })] }),
          new Paragraph({ children: [new TextRun({ text: String(it.label).toUpperCase(), color: C.muted, font: F.body, size: hp(S.type.caption), characterSpacing: 14 })] }),
        ],
      })) })],
    });
  };

  // dataTable: dark/secondary header + zebra body. col 0 left + bold, others right-aligned.
  const dataTable = ({ headers, rows, widths }) => {
    const n = headers.length;
    const colW = widths || headers.map(() => Math.floor(CW / n));
    const head = new TableRow({ tableHeader: true, children: headers.map((hd, i) => new TableCell({
      width: { size: colW[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, color: "auto", fill: C.tableHead },
      margins: { top: 70, bottom: 70, left: 110, right: 110 },
      children: [new Paragraph({ spacing: { after: 0 }, alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.RIGHT,
        children: [new TextRun({ text: String(hd), bold: true, color: C.tableHeadText, font: F.display, size: hp(S.type.tableHead) })] })],
    })) });
    const bodyRows = rows.map((r, ri) => new TableRow({ children: r.map((cell, i) => {
      const opt = {
        width: { size: colW[i], type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 110, right: 110 },
        children: [new Paragraph({ spacing: { after: 0 }, alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.RIGHT,
          children: [new TextRun({ text: String(cell), bold: i === 0, color: i === 0 ? C.ink : C.body, font: F.body, size: hp(S.type.tableCell) })] })],
      };
      if (ri % 2) opt.shading = { type: ShadingType.CLEAR, color: "auto", fill: C.zebra };
      return new TableCell(opt);
    }) }));
    return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: colW, layout: TableLayoutType.FIXED, borders: rowRules(), rows: [head, ...bodyRows] });
  };

  // cardTable: borderless tinted card. used for memos where data reads as cards, not grids.
  // headers render as accent caps inside the tint; no zebra; no rule lines.
  const cardTable = ({ headers, rows, widths, tint }) => {
    const n = headers.length;
    const colW = widths || headers.map(() => Math.floor(CW / n));
    const fill = tint || C.tableTint;
    const head = new TableRow({ tableHeader: true, children: headers.map((hd, i) => new TableCell({
      width: { size: colW[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, color: "auto", fill },
      margins: { top: 90, bottom: 90, left: 140, right: 140 },
      children: [new Paragraph({ spacing: { after: 0 }, alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.RIGHT,
        children: [new TextRun({
          text: String(hd).toUpperCase(), bold: true, color: C.accent,
          font: F.display, size: hp(S.type.tableHead), characterSpacing: 18,
        })] })],
    })) });
    const bodyRows = rows.map((r) => new TableRow({ children: r.map((cell, i) => new TableCell({
      width: { size: colW[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, color: "auto", fill },
      margins: { top: 80, bottom: 80, left: 140, right: 140 },
      children: [new Paragraph({ spacing: { after: 0 }, alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.RIGHT,
        children: [new TextRun({ text: String(cell), bold: i === 0, color: i === 0 ? C.ink : C.body, font: F.body, size: hp(S.type.tableCell) })] })],
    })) }));
    return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: colW, layout: TableLayoutType.FIXED, borders: noBorders(), rows: [head, ...bodyRows] });
  };

  // copyBlock: paste-ready client copy inside the house box frame. Built as a one-cell table, not a
  // bordered paragraph with break-runs — clients edit these in Google Docs, and the round trip merges
  // break-separated lines into one another ("7 sticks, one per customer.If it isn't for you").
  // A table cell round-trips intact. Jay, Aug 2026, Client A First-Purchase Strategy.
  // lines: array of strings. A line that is all-caps reads as a headline and comes back bold.
  // Pass "" for a blank spacer line between blocks of copy.
  const copyBlock = (label, lines) => {
    const bd = { style: BorderStyle.SINGLE, size: 8, color: C.accent };
    const kids = [new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({
        text: String(label).toUpperCase(), bold: true, allCaps: true,
        color: C.accent, font: F.display, size: hp(S.type.kicker), characterSpacing: 18,
      })],
    })];
    lines.forEach((l, i) => {
      const headline = /^[^a-z]*$/.test(l) && l.trim().length > 3;
      kids.push(new Paragraph({
        spacing: { after: i === lines.length - 1 ? 0 : 40, line: D.line },
        children: [new TextRun({ text: l || " ", bold: headline, color: C.ink, font: F.body, size: hp(S.type.body) })],
      }));
    });
    const table = new Table({
      width: { size: CW, type: WidthType.DXA }, columnWidths: [CW], layout: TableLayoutType.FIXED,
      borders: { top: bd, bottom: bd, left: bd, right: bd, insideHorizontal: bd, insideVertical: bd },
      rows: [new TableRow({ cantSplit: true, children: [new TableCell({
        width: { size: CW, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: C.fill },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        children: kids,
      })] })],
    });
    // returns [table, spacer] — a Table carries no spacing-after, so the gap to the next
    // paragraph rides on a trailing empty one. Callers that spread arrays (push(...x.flat()))
    // get this for free.
    return [table, new Paragraph({ spacing: { after: S.space.base }, children: [new TextRun({ text: "" })] })];
  };

  // readLine: the one-sentence read that closes a table or a box. Italic, body color, full body size.
  // Distinct from soWhat() (muted, note size) — Jay italicized these in the Client A edit, Aug 2026.
  const readLine = (text) => new Paragraph({
    spacing: { after: D.bodyAfter, line: D.line },
    children: mkRuns(text, { italics: true, color: C.body, font: F.body, size: hp(S.type.body) }),
  });

  // thin accent divider between major sections (consolidates flow without a page break)
  const sectionRule = () => new Paragraph({
    spacing: { before: S.space.section, after: S.space.section },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C.accent, space: 1 } },
    children: [new TextRun({ text: "" })],
  });

  const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

  // ---------- covers ----------

  // CLASSIC: top-aligned. brand name top, accent subtitle, single meta line at bottom.
  // Use for older Rub-style strategies and identity manuals.
  const coverClassic = ({ kicker: k, title, subtitle, client, date }) => [
    new Paragraph({
      spacing: { before: S.covers.classic.topDrop, after: S.space.base },
      children: [new TextRun({
        text: String(k || S.brand.name).toUpperCase(), bold: true, allCaps: true,
        color: C.accent, font: F.display, size: hp(S.type.kicker), characterSpacing: 28,
      })],
    }),
    new Paragraph({
      spacing: { after: S.space.tight },
      children: [new TextRun({ text: title, bold: true, color: C.ink, font: F.display, size: hp(S.type.cover) })],
    }),
    subtitle ? new Paragraph({
      spacing: { after: S.space.section },
      children: [new TextRun({ text: subtitle, color: C.muted, font: F.body, size: hp(14) })],
    }) : null,
    new Paragraph({
      spacing: { before: S.covers.classic.ruleDrop, after: 0 },
      border: { top: { style: BorderStyle.SINGLE, size: 12, color: C.accent, space: 10 } },
      children: [new TextRun({ text: client || "", bold: true, color: C.ink, font: F.display, size: hp(11) })],
    }),
    new Paragraph({
      children: [new TextRun({
        text: [S.brand.name, date].filter(Boolean).join("   ·   "),
        color: C.muted, font: F.body, size: hp(S.type.small),
      })],
    }),
  ].filter(Boolean);

  // STACKED: PREPARED FOR / PREPARED BY block. Default cover for memos and audits.
  const coverStacked = ({ kicker: k, title, subtitle, date, preparedFor, preparedBy, dateTop, rule }) => {
    const topDrop = { before: S.covers.stacked.topDrop, after: S.space.tight };
    const parts = [];
    // date italic at the very top (above the title), audit-style
    if (dateTop && date) {
      parts.push(new Paragraph({ spacing: topDrop, children: [new TextRun({ text: date, italics: true, color: C.muted, font: F.body, size: hp(12) })] }));
    }
    // accent eyebrow only when provided (empty kicker no longer prints a blank line)
    if (k) {
      parts.push(new Paragraph({ spacing: parts.length ? { after: S.space.base } : { before: S.covers.stacked.topDrop, after: S.space.base }, children: [new TextRun({ text: String(k).toUpperCase(), bold: true, allCaps: true, color: C.accent, font: F.display, size: hp(S.type.kicker), characterSpacing: 24 })] }));
    }
    parts.push(new Paragraph({ spacing: parts.length ? { after: S.space.tight } : { ...topDrop }, children: [new TextRun({ text: title, bold: true, color: C.ink, font: F.display, size: hp(S.type.cover) })] }));
    if (subtitle) parts.push(new Paragraph({ spacing: { after: S.space.base }, children: [new TextRun({ text: subtitle, color: C.ink, font: F.body, size: hp(16) })] }));
    if (date && !dateTop) parts.push(new Paragraph({ spacing: { after: S.covers.stacked.dateAfter }, children: [new TextRun({ text: date, italics: true, color: C.muted, font: F.body, size: hp(12) })] }));
    // accent rule between the title block and the prepared-by pairs
    if (rule) parts.push(new Paragraph({ spacing: { before: S.space.tight, after: S.space.base }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C.accent, space: 1 } }, children: [new TextRun({ text: "" })] }));
    if (preparedFor) parts.push(...metaPair("Prepared For", preparedFor));
    parts.push(...metaPair("Prepared By", preparedBy || S.brand.name));
    return parts.filter(Boolean);
  };

  // STRATEGY: brand name on top (muted italic), document type the same size in ink, a descriptor line,
  // then the date with a trailing period. Strategy and research docs invert the audit cover, which
  // leads with the document type. Set by your Client A First-Purchase Strategy edit (Aug 2026), matching
  // the shipped Client D cover. Audits keep coverStacked.
  const coverStrategy = ({ brand: bName, title, descriptor, date, preparedBy }) => {
    const out = [];
    out.push(new Paragraph({
      spacing: { before: S.covers.stacked.topDrop, after: S.space.tight },
      children: [new TextRun({ text: bName, italics: true, color: C.muted, font: F.display, size: hp(S.type.coverStrategy) })],
    }));
    out.push(new Paragraph({
      spacing: { after: S.space.tight },
      children: [new TextRun({ text: title, bold: true, color: C.ink, font: F.display, size: hp(S.type.coverStrategy) })],
    }));
    if (descriptor) out.push(new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: descriptor, color: C.ink, font: F.body, size: hp(S.type.coverDescriptor) })],
    }));
    if (date) out.push(new Paragraph({
      spacing: { after: S.space.loose },
      children: [new TextRun({ text: String(date).replace(/\.?$/, "."), italics: true, color: C.muted, font: F.body, size: hp(11) })],
    }));
    out.push(...metaPair("Prepared By", preparedBy || S.brand.name));
    return out;
  };

  // EDITORIAL: Money Story layout. Left-aligned, big top air, two-line title with accent emphasis,
  // italic-feeling subtitle pair, author block at bottom of content stack.
  // Pass titleLine2 for the "money word" accent line; omit for a single-line title.
  const coverEditorial = ({ kicker: k, tagline, titleLine1, titleLine2, subtitleA, subtitleB, author, role }) => {
    const out = [];
    if (k) out.push(new Paragraph({
      spacing: { before: S.covers.editorial.topDrop, after: 0 },
      children: [new TextRun({
        text: String(k).toUpperCase(), bold: true, allCaps: true,
        color: C.accent, font: F.display, size: hp(10), characterSpacing: 24,
      })],
    }));
    if (tagline) out.push(new Paragraph({
      spacing: { after: S.covers.editorial.taglineAfter },
      children: [new TextRun({ text: tagline, italics: true, color: C.muted, font: F.body, size: hp(10) })],
    }));
    // line 1: serif, ink
    out.push(new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({ text: titleLine1, color: C.ink, font: F.serif, size: hp(S.type.serif.title) })],
    }));
    // line 2: serif, accent, bold (the "money word")
    if (titleLine2) out.push(new Paragraph({
      spacing: { after: S.covers.editorial.titleAfter },
      children: [new TextRun({ text: titleLine2, bold: true, color: C.accent, font: F.serif, size: hp(S.type.serif.titleEmphasis) })],
    }));
    if (subtitleA) out.push(new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: subtitleA, color: C.ink, font: F.serif, size: hp(S.type.serif.subtitle) })],
    }));
    if (subtitleB) out.push(new Paragraph({
      spacing: { after: S.covers.editorial.subtitleAfter },
      children: [new TextRun({ text: subtitleB, color: C.ink, font: F.serif, size: hp(S.type.serif.subtitle) })],
    }));
    out.push(new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({
        text: String(author || S.brand.name).toUpperCase(), bold: true,
        color: C.ink, font: F.display, size: hp(10), characterSpacing: 18,
      })],
    }));
    if (role) out.push(new Paragraph({
      children: [new TextRun({ text: role, color: C.muted, font: F.body, size: hp(S.type.small) })],
    }));
    return out;
  };

  // running footer: label left, page number right, hairline above.
  const footer = (label) => new Footer({
    children: [new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.rule, space: 8 } },
      tabStops: [{ type: TabStopType.RIGHT, position: CW }],
      children: [
        new TextRun({ text: label || S.brand.name, color: C.muted, font: F.body, size: hp(S.type.caption) }),
        new TextRun({ text: "\t" }),
        new TextRun({ children: [PageNumber.CURRENT], color: C.muted, font: F.body, size: hp(S.type.caption) }),
      ],
    })],
  });

  const build = ({ children, label }) => new Document({
    styles: docStyles,
    sections: [{ properties: { page: PAGE }, footers: { default: footer(label) }, children }],
  });

  return {
    build,
    // covers
    coverClassic, coverStacked, coverEditorial, coverStrategy,
    cover: coverStacked, // default alias
    // text
    kicker, h1, h2, body, bullet, soWhat, readLine, callout, finding, copyBlock, metaPair,
    // tables + decoration
    kpiRow, dataTable, cardTable, sectionRule, pageBreak, footer,
    // geometry + introspection
    PAGE, CW,
    ctx: { S, T, C, F, D, subBrand, density: densityKey, secondary, margin: marginKey },
  };
}

// Default instance (jcm + airy + standard). Preserves the old `require('./client-theme')` import shape.
const defaultTheme = createClientTheme();

module.exports = {
  createClientTheme,
  ...defaultTheme,
  tokens: { S, T: themes.client.jcm },
};
