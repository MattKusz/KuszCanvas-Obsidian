import type { MarkdownMeasure, MarkdownTextLayout } from "./markdownTextLayout";
import type { FontString } from "./types";
/** First and last source line (0-based, inclusive). */
export type SourceLineRange = Readonly<{
    first: number;
    last: number;
}>;
/** The source lines that `[selectionStart, selectionEnd]` touches. */
export declare const getSourceLineRange: (sourceText: string, selectionStart: number, selectionEnd: number) => SourceLineRange;
export type MarkdownLivePreviewOptions = Readonly<{
    /** the editor's lines: `sourceText` wrapped as raw text */
    visualText: string;
    /** the editor's value */
    sourceText: string;
    font: FontString;
    measure: MarkdownMeasure;
    /** source lines drawn raw */
    revealed: SourceLineRange;
}>;
/**
 * Lays the edited text out for the live preview: one line per visual line,
 * raw on the revealed source lines (and on any table they touch, whose rows
 * otherwise share space), Markdown elsewhere.
 *
 * Returns `null` when the preview would look exactly like the editor's raw
 * text, or when `visualText` is not a wrap of `sourceText` (a stale wrap):
 * the editor then shows its own text.
 */
export declare const layoutMarkdownLivePreview: (options: MarkdownLivePreviewOptions) => MarkdownTextLayout | null;
