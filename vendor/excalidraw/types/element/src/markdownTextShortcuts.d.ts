export type MarkdownShortcutStyle = "bold" | "italic" | "underline";
export type MarkdownShortcutKey = Readonly<{
    /** `KeyboardEvent.key` */
    key: string;
    /** `KeyboardEvent.code`, for layouts whose letters aren't Latin */
    code: string;
    ctrlOrCmd: boolean;
    shiftKey: boolean;
    altKey: boolean;
}>;
export type MarkdownStyleEdit = Readonly<{
    value: string;
    selectionStart: number;
    selectionEnd: number;
    /** the same edit as one replacement of `[replaceStart, replaceEnd)` */
    replaceStart: number;
    replaceEnd: number;
    replacement: string;
}>;
/** The style a key press toggles, or `null` for any other key. */
export declare const getMarkdownShortcutStyle: (event: MarkdownShortcutKey) => MarkdownShortcutStyle | null;
/**
 * Toggles `style` on the selection of `value`.
 *
 * A caret gets an empty marker pair (or loses one it sits in). A selection
 * is styled line by line, past list and quote prefixes and surrounding
 * whitespace; the style comes off when every selected line already has it.
 * The result selects the styled text without its markers.
 */
export declare const toggleMarkdownStyle: (value: string, selectionStart: number, selectionEnd: number, style: MarkdownShortcutStyle) => MarkdownStyleEdit;
/**
 * Enter at a caret inside a list item's content: the new line starts the
 * next item (same indent and quote markers, the next number, an open
 * checkbox for a task). Enter in an empty item ends the list instead,
 * leaving only its quote markers.
 *
 * Returns `null` when Enter should insert a plain newline: a selection, a
 * line that isn't a list item, or a caret inside the item's marker.
 */
export declare const continueMarkdownList: (value: string, selectionStart: number, selectionEnd: number) => MarkdownStyleEdit | null;
