import type App from "../components/App";
/** Set on the textarea while the preview draws its text. */
export declare const LIVE_TEXT_PREVIEW_CLASS = "excalidraw-wysiwyg--live-text-preview";
/**
 * Handles a Markdown style shortcut. Returns `true` when it consumed the
 * event.
 */
export declare const applyMarkdownShortcut: (event: KeyboardEvent, editable: HTMLTextAreaElement) => boolean;
export type LiveTextPreview = Readonly<{
    /** schedules a repaint (after an edit, a selection change or a restyle) */
    update: () => void;
    destroy: () => void;
}>;
/**
 * Creates the live preview for the textarea `editable` (already in the DOM)
 * editing the text element `elementId`.
 */
export declare const createLiveTextPreview: ({ app, editable, elementId, }: {
    app: App;
    editable: HTMLTextAreaElement;
    elementId: string;
}) => LiveTextPreview;
