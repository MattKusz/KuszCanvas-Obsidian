import type { MarkdownInlineStyle } from "./markdownText";
import type { MarkdownTextLayout } from "./markdownTextLayout";
import type { ExcalidrawTextElement, FontString } from "./types";
/** Highlighter yellow; translucent so it reads on light and dark scenes. */
export declare const MARKDOWN_HIGHLIGHT_COLOR = "rgba(255, 208, 0, 0.4)";
/** Opacities applied to the text colour for secondary marks. */
export declare const MARKDOWN_MARK_ALPHA: Readonly<{
    codeBackground: 0.1;
    quoteBar: 0.35;
    tableGrid: 0.4;
    tableHeader: 0.06;
}>;
/** Decoration offsets from the baseline, in em. */
export declare const MARKDOWN_DECORATION: Readonly<{
    underlineOffset: 0.12;
    strikeOffset: -0.3;
    thickness: 0.06;
    bulletCentre: -0.32;
}>;
export type MarkdownDrawOptions = Readonly<{
    layout: MarkdownTextLayout;
    /** the element's font, for ordered-list labels */
    font: FontString;
    /** element width, which alignment offsets each line within */
    width: number;
    /** "left", "center" or "right" (checked at runtime: elements type it as string) */
    textAlign: string;
    fontSize: number;
    lineHeightPx: number;
    /** baseline offset from the top of a line */
    verticalOffset: number;
    /** text colour, dark-mode filter already applied */
    color: string;
}>;
/** KuszCanvas: what a Markdown rect paints, so blackboard mode can layer it. */
export type MarkdownRectRole = "highlight" | "code" | "tableHeader" | "tableGrid" | "quote" | "decoration";
export type MarkdownPaintOp = Readonly<{
    kind: "rect";
    role: MarkdownRectRole;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    /** multiplies the element opacity */
    alpha: number;
    radius: number;
} | {
    kind: "circle";
    cx: number;
    cy: number;
    r: number;
    color: string;
} | {
    kind: "text";
    text: string;
    /** left edge of the text, at `y` = baseline */
    x: number;
    y: number;
    font: FontString;
    style: MarkdownInlineStyle;
    color: string;
}>;
/** Paint ops for `options.layout`, with the element's top-left at the origin. */
export declare const getMarkdownPaintOps: (options: MarkdownDrawOptions) => MarkdownPaintOp[];
/**
 * Draws `options.layout` on a canvas, with the element's top-left at the
 * origin. `include` limits the ops drawn (blackboard mode paints one chalk
 * layer at a time). Returns whether any op was drawn.
 */
export declare const drawMarkdownText: (context: CanvasRenderingContext2D, options: MarkdownDrawOptions, include?: (op: MarkdownPaintOp) => boolean) => boolean;
/**
 * Draws a text element's lines as plain text, with the element's top-left at
 * the origin and each line aligned within `width` (the element's width on
 * the scene, the editor's box width in the live preview).
 */
export declare const drawPlainTextLines: (context: CanvasRenderingContext2D, element: Pick<ExcalidrawTextElement, "text" | "fontSize" | "lineHeight" | "fontFamily" | "textAlign">, color: string, width: number) => void;
