import { type Bounds, type StylesPanelMode } from "@excalidraw/common";
import type { ArrowEndpoint } from "@excalidraw/element";
import type { ExcalidrawElement, ExcalidrawTextContainer, ExcalidrawTextElement, NonDeleted, NonDeletedExcalidrawElement } from "@excalidraw/element/types";
import { textWysiwyg } from "../wysiwyg/textWysiwyg";
import type App from "./App";
import type { AppState, Offsets, ViewportUIName } from "../types";
type AppTextDependencies = {
    getContainer: () => HTMLDivElement | null;
    getStylesPanelMode: () => StylesPanelMode;
};
/**
 * Texts, but for the text tool's pointer interaction (`AppTextTool`):
 *
 * - the editing session: what text to edit, or create, and where
 *   (`startTextEditing`), and the editor's lifecycle (`handleTextWysiwyg`)
 * - the part of the canvas a typed or pasted text is kept within
 *   (`getTextViewportOffsets`, `getMaxTextWidth`)
 * - the queries that find the text or container to edit at a position
 * - the handle that turns a fixed-width text back into a growing one
 *
 * Every way into editing ends up here: Enter, double-click, pointerup on a
 * selected text or container, the text tool, a drag-created text or sticky
 * note, and a sticky note dropped from the toolbar.
 */
export declare class AppText {
    private app;
    private dependencies;
    constructor(app: App, dependencies: AppTextDependencies);
    textWysiwygSubmitHandler: ReturnType<typeof textWysiwyg> | null;
    private getTextCreationGridPoint;
    /**
     * The side panels, besides the sidebar, that a typed or pasted text is
     * kept clear of: the stats panel, and the full styles panel (desktop),
     * which shows next to a text while it's edited, and once it's pasted and
     * selected.
     */
    getTextSidePanels: () => ViewportUIName[];
    /**
     * The part of the canvas a typed or pasted text is kept within, as offsets
     * from its edges (screen px): all of it but the sidebar and the side
     * panels (see getTextSidePanels), less some room at each side. The stats
     * panel covers the top of a side only, and counts only for a text beside
     * it: one (given by its scene bounds) with rows within that room of it.
     */
    getTextViewportOffsets: (textBounds?: Bounds) => Required<Offsets>;
    /**
     * The widest a text may grow to as it's typed or pasted, in scene units:
     * TEXT_MAX_WRAP_WIDTH, or less, so that a text never outgrows the part of
     * the canvas it's kept within.
     */
    getMaxTextWidth: (offsets: Required<Offsets>) => number;
    /**
     * Opens the text editor on the element. If the editor fails to open (in the
     * web harness, for one, the host's link suggester throws without an
     * Obsidian host), the half-started edit is rolled back before the error is
     * rethrown: an `editingTextElement` with no editor would make every later
     * pointer gesture a no-op.
     */
    handleTextWysiwyg(element: NonDeleted<ExcalidrawTextElement>, options: {
        isExistingElement?: boolean;
        /**
         * supply null if no caret positioning is desired, and instead
         * text should be auto-selected
         */
        initialCaretSceneCoords?: {
            x: number;
            y: number;
        } | null;
        /** range of the text to select (takes precedence over the caret) */
        initialSelection?: {
            start: number;
            end: number;
        } | null;
    }): void;
    /** Undoes what starting an edit did, for an editor that failed to open. */
    private abortFailedTextEditing;
    private openTextWysiwyg;
    private getSelectedTextElement;
    getSelectedTextEditingContainerAtPosition(hitElement: NonDeletedExcalidrawElement | null, sceneCoords: {
        x: number;
        y: number;
    }): ExcalidrawTextContainer | null | undefined;
    getTextElementAtPosition(x: number, y: number): NonDeleted<ExcalidrawTextElement> | null;
    isHittingTextAutoResizeHandle: (selectedElements: NonDeleted<ExcalidrawElement>[], point: Readonly<{
        x: number;
        y: number;
    }>) => boolean;
    handleTextAutoResizeHandlePointerDown: (selectedElements: NonDeleted<ExcalidrawElement>[], point: Readonly<{
        x: number;
        y: number;
    }>) => boolean;
    /**
     * The text container at a position — an arrow hit on its path, any other
     * container hit anywhere in its bounds (frames are skipped so a container
     * inside one can be hit, and a frame's children are only hit inside it,
     * where they are drawn). Purely positional: the selection plays no part.
     *
     * Only what hides the rest ends the search — a filled element or an image
     * (as for arrow binding), or an arrow — so containers below a transparent
     * one stay in reach whatever their z-order. Of the containers found, the
     * innermost one centered on the position wins, since that is where its
     * label would go (an arrow counting as innermost: it is pointed at, not just
     * enclosing); failing that, the top-most.
     */
    getTextBindableContainerAtPosition(x: number, y: number): NonDeleted<ExcalidrawTextContainer>;
    /**
     * Whether a text element's content is still being authored.
     *
     * Creating a text reverts the tool to selection during pointerdown, so the
     * pointerup that follows looks like an ordinary canvas click and would
     * capture the still-empty element as a history entry of its own. Undo would
     * then rewind only the typing, restoring an invisible, zero-content element
     * (and, for an endpoint label, leaving the arrow bound to it) rather than
     * removing it. The editor's own submit captures the finished text instead,
     * so the whole create-and-type lands in a single entry.
     */
    isEditingTextContent(): boolean;
    startTextEditing: ({ sceneX, sceneY, insertAtParentCenter, container, autoEdit, initialCaretSceneCoords, initialSelection, arrowEndpoint, textElement, }: {
        /** X position to insert text at */
        sceneX: number;
        /** Y position to insert text at */
        sceneY: number;
        /** whether to attempt to insert at element center if applicable */
        insertAtParentCenter?: boolean;
        container?: ExcalidrawTextContainer | null;
        autoEdit?: boolean;
        initialCaretSceneCoords?: {
            x: number;
            y: number;
        };
        /** range of an existing text to select (takes precedence over the caret) */
        initialSelection?: {
            start: number;
            end: number;
        };
        /**
         * creates the text as a label for this arrow endpoint: the binding then
         * dictates the text's position and alignment, overriding (sceneX, sceneY)
         */
        arrowEndpoint?: ArrowEndpoint | null;
        /**
         * the text to edit: an element to edit exactly that one; `null` to always
         * create, never adopting a selected text or one under the pointer;
         * `undefined` to resolve it here — a single selected text, the label of a
         * selected or passed arrow container, else the text at (sceneX, sceneY)
         */
        textElement?: NonDeleted<ExcalidrawTextElement> | null;
    }) => void;
    getTextWysiwygSnappedToCenterPosition(x: number, y: number, appState: AppState, container?: ExcalidrawTextContainer | null): {
        viewportX: number;
        viewportY: number;
        elementCenterX: number;
        elementCenterY: number;
    } | undefined;
}
export {};
