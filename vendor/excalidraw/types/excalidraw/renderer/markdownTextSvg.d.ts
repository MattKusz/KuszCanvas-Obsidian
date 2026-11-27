import type { MarkdownPaintOp } from "@excalidraw/element";
/**
 * Appends one node per op to `parent` (the chalk SVG export relies on it).
 *
 * @param fontFamily the element's CSS font-family list, for non-code runs
 * @param fontSize the element's font size in px
 */
export declare const appendMarkdownPaintOpsToSvg: (parent: SVGElement, ops: readonly MarkdownPaintOp[], fontFamily: string, fontSize: number) => void;
