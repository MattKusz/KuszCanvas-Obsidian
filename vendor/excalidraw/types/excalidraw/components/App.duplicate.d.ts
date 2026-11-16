import { duplicateElements } from "@excalidraw/element";
import type { ExcalidrawElement, ExcalidrawTextElement } from "@excalidraw/element/types";
import type { PointerDownState } from "../types";
import type App from "./App";
type Duplication = Pick<ReturnType<typeof duplicateElements>, "duplicatedElements" | "duplicateElementsMap" | "origElementsMap" | "origIdToDuplicateId" | "duplicateIdToOrigId">;
/**
 * Owns the duplication paths which involve the host (`props.onDuplicate`):
 * duplicating elements into the scene (paste, library insert etc.), and
 * duplicating the dragged selection (alt-drag). The duplicate action shares
 * `runOnDuplicate()`.
 */
export declare class AppDuplicate {
    private app;
    private dependencies;
    constructor(app: App, dependencies: {
        /** pointers currently down */
        getPointerCount: () => number;
    });
    /**
     * Hands the duplication over to the host's `props.onDuplicate` (if any),
     * and reconciles what it returned with the duplicates.
     *
     * @returns next elements, and the duplicates that weren't vetoed
     */
    runOnDuplicate: (duplication: Duplication, nextElements: ExcalidrawElement[], 
    /** excludes the duplicated elements */
    prevElements: readonly ExcalidrawElement[]) => {
        elements: ExcalidrawElement[];
        duplicatedElements: import("@excalidraw/element/types").NonDeletedExcalidrawElement[];
    };
    /**
     * Runs `update` once what's pending is committed, capturing what it changes
     * (if it returns `true`) as a separate undo step.
     */
    private afterCommit;
    /**
     * Advances the list markers of the duplicated texts (`1.` -> `2.`) once
     * the duplication is committed, as a separate undo step, so that undo
     * reverts the markers first.
     */
    advanceListMarkers: (duplicatedElements: readonly ExcalidrawElement[]) => void;
    /**
     * The text whose editing an alt-press on it ended, while the press is
     * handed over to the canvas (see `handOverTextEditorPress()`).
     */
    handedOverTextId: ExcalidrawTextElement["id"] | null;
    /**
     * An alt-press on the text being edited, once it ended the editing, is
     * handed over to the canvas, for the text to be alt-dragged (duplicated) as
     * on the canvas — its duplicate is then edited on drop.
     */
    handOverTextEditorPress: (event: PointerEvent, textElementId: ExcalidrawTextElement["id"]) => void;
    /**
     * The pointer down a handed-over press is replayed as (see
     * `handOverTextEditorPress()`) moves what was edited — the text, or its
     * container — and nothing beneath the editor, which reaches past the text:
     * no resize handle, nor an arrow's point, midpoint or label.
     *
     * @returns `false` if the pointer down isn't a handed-over press
     */
    hitEditedElement: (pointerDownState: PointerDownState) => boolean;
    /**
     * On alt-drag drop: the list markers advanced along with the drag go back,
     * for the drag to be committed as is, and forth again once it is, as
     * a separate undo step (before the browser gets to paint either).
     *
     * A duplicate is then edited (once the drop is committed): a single list
     * item with text after its marker, with that text selected (`1. |foo|`),
     * as it's likely to differ from the original's — or else the duplicate of
     * the text the drag ended the editing of, with all of it selected.
     */
    commitDraggedDuplicates: ({ hit }: PointerDownState, { editText, }: {
        /** `false` if the drag didn't end with a genuine pointerup */
        editText: boolean;
    }) => void;
    private editDuplicatedText;
    /**
     * Duplicates elements so that they end up centered at the scene coords
     * (and in the frame at that point, if any). Doesn't update the scene.
     *
     * @returns `null` if the host vetoed the duplication
     */
    duplicateAtSceneCoords: (elements: readonly ExcalidrawElement[], { x, y }: {
        x: number;
        y: number;
    }, opts?: {
        retainSeed?: boolean;
        preserveFrameChildrenOrder?: boolean;
    }) => {
        nextElements: ExcalidrawElement[];
        duplicatedElements: import("@excalidraw/element/types").NonDeletedExcalidrawElement[];
    } | null;
    /**
     * Duplicates the selection being dragged: the originals go back to where
     * the drag started, and the drag continues with the duplicates.
     *
     * If the host vetoes the duplication, the originals keep being dragged.
     */
    duplicateDraggedSelection: (pointerDownState: PointerDownState, event: PointerEvent) => void;
}
export {};
