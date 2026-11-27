import type { MarkdownInlineStyle } from "./markdownText";
import type { WrappedTextLine } from "./textWrapping";
import type { FontString } from "./types";
/** Measures the advance width of `text` drawn in `font`. */
export type MarkdownMeasure = (text: string, font: FontString) => number;
/** Code spans: a system monospace stack, always available synchronously. */
export declare const MARKDOWN_CODE_FONT_FAMILY = "\"Cascadia Mono\", Consolas, \"SF Mono\", Menlo, monospace";
/** Layout metrics in em (multiples of the element's font size). */
export declare const MARKDOWN_TEXT_METRICS: Readonly<{
    listIndent: 1.4;
    quoteIndent: 0.9;
    quoteBarWidth: 0.12;
    quoteBarOffset: 0.15;
    bulletOffset: 0.55;
    bulletRadius: 0.13;
    orderedGap: 0.35;
    checkboxSize: 0.8;
    /** between a checkbox and the content (a bullet task's matches the dot's) */
    checkboxGap: 0.45;
    codePadding: 0.2;
    tableCellPadding: 0.5;
}>;
export type MarkdownSegment = Readonly<{
    text: string;
    /** box start, relative to the line origin */
    x: number;
    /** box width, padding included */
    width: number;
    /** where the text is drawn, relative to the line origin */
    textX: number;
    textWidth: number;
    style: MarkdownInlineStyle;
    font: FontString;
}>;
export type MarkdownBullet = Readonly<{
    kind: "dot";
    cx: number;
} | {
    kind: "label";
    text: string;
    x: number;
    width: number;
}>;
/** A task item's checkbox: a `size` square whose left edge is `x`. */
export type MarkdownCheckbox = Readonly<{
    x: number;
    size: number;
    checked: boolean;
}>;
export type MarkdownTableLine = Readonly<{
    columnXs: readonly number[];
    columnWidths: readonly number[];
    width: number;
    isHeader: boolean;
    isDelimiter: boolean;
    isLastRow: boolean;
}>;
export type MarkdownVisualLine = Readonly<{
    /** in line heights from the element's top */
    top: number;
    /** in line heights; table rows share the delimiter line, which gets 0 */
    height: number;
    /** total drawn width, indentation included */
    width: number;
    segments: readonly MarkdownSegment[];
    bullet: MarkdownBullet | null;
    checkbox: MarkdownCheckbox | null;
    /** left x of each quote bar */
    quoteBars: readonly number[];
    table: MarkdownTableLine | null;
}>;
export type MarkdownTextLayout = Readonly<{
    lines: readonly MarkdownVisualLine[];
    width: number;
}>;
/** The canvas/CSS font for a run of `style` in an element's `font`. */
export declare const getMarkdownRunFont: (font: FontString, style: MarkdownInlineStyle) => FontString;
/**
 * Maps the lines of `visualText` (a wrap of `sourceText`) back to the source:
 * `true` marks a visual line that continues the source line before it.
 * Returns `null` if the visual text did not come from the source.
 */
export declare const alignWrappedLines: (sourceText: string, visualText: string) => boolean[] | null;
/**
 * Lays out a text element's (possibly wrapped) `visualText` as Markdown.
 * Pass the unwrapped `sourceText` so wrapped tails are told apart from new
 * blocks. Returns `null` when the text renders exactly like raw text
 * (including right-to-left text, which keeps the plain renderer).
 */
export declare const layoutMarkdownText: (visualText: string, font: FontString, measure: MarkdownMeasure, sourceText?: string) => MarkdownTextLayout | null;
/**
 * Wraps `text` so each visual line's rendered Markdown fits `maxWidth`.
 * Mirrors `getWrappedTextLines` (offsets into `text`, trailing whitespace
 * trimmed at soft breaks); table rows and blank lines never wrap.
 */
export declare const wrapMarkdownText: (text: string, font: FontString, maxWidth: number, measure: MarkdownMeasure) => WrappedTextLine[];
