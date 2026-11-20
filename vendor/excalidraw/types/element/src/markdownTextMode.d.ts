/** Runs `fn` with text measured and wrapped as raw text. */
export declare const withRawTextLayout: <T>(fn: () => T) => T;
/** Whether `measureText`/`wrapText` lay text out as rendered Markdown. */
export declare const isMarkdownTextLayoutActive: () => boolean;
