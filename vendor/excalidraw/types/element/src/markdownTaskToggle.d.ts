import type { MarkdownPaintOp } from "./markdownTextRender";
/** Source line indices of the task items (`- [ ]`, `1. [x]`, …) in `text`. */
export declare const getMarkdownTaskLines: (text: string) => number[];
/**
 * Ticks the open task on source line `line` of `text`, or clears a done one.
 * Throws if that line is not a task item.
 */
export declare const toggleMarkdownTask: (text: string, line: number) => string;
export type MarkdownTaskTexts = Readonly<{
    /** the displayed (unwrapped) text the checkbox was hit in */
    originalText: string;
    /** the host's raw source; empty when the host keeps none */
    rawText: string;
}>;
/**
 * Toggles the task on `line` of `originalText`, and the same task (by its
 * order among the tasks) in `rawText`, which a host may keep with different
 * lines above the task. Returns `null` when the raw source's tasks don't
 * match the displayed ones, so the toggle can't be placed safely.
 */
export declare const toggleMarkdownTaskInTexts: (texts: MarkdownTaskTexts, line: number) => MarkdownTaskTexts | null;
/**
 * The source line of `visualText`'s line `visualLine`, where `visualText`
 * is a wrap of `sourceText`. Returns `null` if the texts don't align.
 */
export declare const getMarkdownSourceLine: (sourceText: string, visualText: string, visualLine: number) => number | null;
/**
 * The visual line of the checkbox under `point` (element-local), within
 * `slop` of its box, or `null`.
 */
export declare const findMarkdownCheckboxAt: (ops: readonly MarkdownPaintOp[], point: Readonly<{
    x: number;
    y: number;
}>, slop: number) => number | null;
