import type { RenderEnvironment } from "./renderEnvironment";
import type { Scene } from "./Scene";
import type { ExcalidrawElement, ExcalidrawTextElement } from "./types";
/** a list marker advanced by duplication, to go back and forth */
export type ListMarkerAdvance = {
    elementId: ExcalidrawTextElement["id"];
    prevOriginalText: string;
    nextOriginalText: string;
    /**
     * where the item's text (after the marker and whitespace) starts in
     * `nextOriginalText` (its length if there's none)
     */
    contentStart: number;
    /** the label's container before the label (may have) grown it */
    prevContainerSize: {
        width: number;
        height: number;
    } | null;
};
/**
 * Advances the list markers of the duplicated texts and labels, so that
 * duplicating `1. foo` gives `2. foo` (and `1` gives `2`).
 *
 * Duplicating several list items at once continues the list from the
 * highest of them: duplicating `1.`, `3.`, `5.` gives `6.`, `7.`, `8.` (only
 * if they're just markers, i.e. without text).
 *
 * Only if nothing but list items (texts, or containers with list item labels)
 * is duplicated.
 */
export declare const advanceDuplicatedListMarkers: (duplicatedElements: readonly ExcalidrawElement[], scene: Scene, 
/** measures the re-numbered texts */
renderEnvironment?: RenderEnvironment) => ListMarkerAdvance[];
/**
 * Sets the advanced list markers back (`"prev"`), or forth again (`"next"`).
 */
export declare const applyListMarkerAdvances: (advances: readonly ListMarkerAdvance[], direction: "prev" | "next", scene: Scene, 
/** measures the re-numbered texts */
renderEnvironment?: RenderEnvironment) => void;
