import type React from "react";
import type App from "./App";
type AppClipboardDependencies = {
    getContainer: () => HTMLDivElement | null;
};
/**
 * The clipboard: cut and copy (through their actions), and paste — the
 * pasted data parsed (`pasteFromClipboard`) and inserted as whatever it is
 * (`insertClipboardContent`): images or SVG code, elements, a Mermaid
 * definition, embeddable URLs, a spreadsheet (as a chart), mixed content,
 * or text. Pasted elements go in through `app.addElementsFromPasteOrLibrary`,
 * as a library item or a drop does.
 */
export declare class AppClipboard {
    private app;
    private dependencies;
    constructor(app: App, dependencies: AppClipboardDependencies);
    onCut: (event: ClipboardEvent) => void;
    onCopy: (event: ClipboardEvent) => void;
    private insertClipboardContent;
    /**
     * Ctrl/Cmd+V: whether the paste event that follows is a plain one (with
     * Shift)
     */
    onPasteShortcut: (event: React.KeyboardEvent | KeyboardEvent) => void;
    clearPlainPaste: () => void;
    pasteFromClipboard: (event: ClipboardEvent) => Promise<void>;
    private addElementsFromMixedContentPaste;
    private addTextFromPaste;
}
export {};
