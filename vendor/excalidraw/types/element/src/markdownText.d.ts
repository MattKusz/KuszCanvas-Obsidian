/**
 * KuszCanvas: pure Markdown parser for text elements.
 *
 * Parses the inline and line-block Markdown subset that text elements render
 * on canvas: `**`/`__` bold, `*`/`_` italic, `~~` strike, `==` highlight,
 * `<u>…</u>` underline, `` ` `` code and `\` escapes; and per line
 * `-`/`*`/`+` bullets, `1.`/`1)` ordered items, `>` quotes and GFM tables.
 * Headings, horizontal rules, fenced code and Obsidian `#tags` render
 * literally (Obsidian indexes tags itself).
 *
 * Every character of a parsed string belongs to exactly one run; markers the
 * parser consumes are `hidden` runs, so callers can map source offsets to
 * rendered text. Unmatched markers stay visible.
 *
 * No fonts, measuring or DOM here -- see `markdownTextLayout.ts`.
 */
export type MarkdownInlineStyle = Readonly<{
    bold: boolean;
    italic: boolean;
    strike: boolean;
    underline: boolean;
    highlight: boolean;
    code: boolean;
}>;
/** A stretch of a parsed string with one style. Offsets are code units. */
export type MarkdownRun = Readonly<{
    text: string;
    start: number;
    end: number;
    /** a consumed marker: takes no space and is not drawn */
    hidden: boolean;
    style: MarkdownInlineStyle;
}>;
export type MarkdownListMarker = Readonly<{
    kind: "bullet";
} | {
    kind: "ordered";
    label: string;
}>;
export type MarkdownTableAlign = "left" | "center" | "right";
export type MarkdownTableCell = Readonly<{
    /** offsets into the line */
    start: number;
    end: number;
    /** offsets into the line */
    runs: readonly MarkdownRun[];
}>;
export type MarkdownTableRow = Readonly<{
    tableId: number;
    /** index among the table's lines, delimiter included */
    rowIndex: number;
    isHeader: boolean;
    isDelimiter: boolean;
    cells: readonly MarkdownTableCell[];
    align: readonly MarkdownTableAlign[];
}>;
export type MarkdownLine = Readonly<{
    kind: "blank" | "text" | "table";
    quoteDepth: number;
    /** 0 outside a list; 1 for a top-level item and its continuation lines */
    listLevel: number;
    /** only on the first line of a list item */
    marker: MarkdownListMarker | null;
    /** where the drawn content starts, after indentation and markers */
    contentStart: number;
    /** offsets into the line; cover `[contentStart, line.length)` */
    runs: readonly MarkdownRun[];
    table: MarkdownTableRow | null;
}>;
export type ParseMarkdownTextOptions = Readonly<{
    /**
     * One flag per line: `true` marks a line as the wrapped tail of the line
     * before it (from `alignWrappedLines`), so it never starts a block.
     */
    continuation?: readonly boolean[];
}>;
export declare const PLAIN_MARKDOWN_STYLE: Readonly<{
    bold: boolean;
    italic: boolean;
    strike: boolean;
    underline: boolean;
    highlight: boolean;
    code: boolean;
}>;
/**
 * Parses inline Markdown in `text` (which may span several lines of one
 * paragraph) into runs that cover every character once.
 */
export declare const parseMarkdownInline: (text: string) => MarkdownRun[];
/**
 * Parses `text` into one `MarkdownLine` per `\n`-separated line. Inline
 * styles carry across the lines of one paragraph or list item and stop at a
 * blank line or a new block.
 */
export declare const parseMarkdownText: (text: string, options?: ParseMarkdownTextOptions) => MarkdownLine[];
/** Cheap pre-check: `false` means the text certainly renders as plain text. */
export declare const hasMarkdownSyntax: (text: string) => boolean;
/** Whether parsed lines render exactly like the raw text. */
export declare const isPlainMarkdown: (lines: readonly MarkdownLine[]) => boolean;
