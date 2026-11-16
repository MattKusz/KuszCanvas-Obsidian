import type { TransformHandleType } from "@excalidraw/element";
import type { ExcalidrawElement, ExcalidrawImageElement, NonDeleted, NonDeletedExcalidrawElement, NonDeletedSceneElementsMap, PointerType } from "@excalidraw/element/types";
import type React from "react";
import type { PointerDownState } from "../types";
import type App from "./App";
/**
 * The selection tool's (and the lasso's) selection: what a pointer down
 * selects, what a click (a pointer up without a drag) does to the selection —
 * including alt-click cycling through the overlapping elements — and the
 * selection's transform handles (resizing, rotating, cropping).
 */
export declare class AppSelectionTool {
    private app;
    constructor(app: App);
    clearSelectionIfNotUsingSelection: () => void;
    /**
     * @returns whether the pointer event has been completely handled
     */
    handleSelectionOnPointerDown: (event: React.PointerEvent<HTMLElement>, pointerDownState: PointerDownState) => boolean;
    maybeHandleCrop: (pointerDownState: PointerDownState, event: MouseEvent | KeyboardEvent) => boolean;
    /**
     * In the crop editor, a double-click on a handle uncrops its side (a
     * corner's two), and mirrored, the opposite side(s) too.
     *
     * @returns whether the double-click has been handled
     */
    maybeUncropSides: (image: NonDeleted<ExcalidrawImageElement>, sceneX: number, sceneY: number, mirrored: boolean) => boolean;
    maybeHandleResize: (pointerDownState: PointerDownState, event: MouseEvent | KeyboardEvent) => boolean;
    /**
     * Drags the selection (or, in the crop editor, the image within its crop) —
     * duplicating it on an alt-drag past the drag threshold.
     *
     * @returns whether the pointer event has been completely handled
     */
    handleSelectionDragOnPointerMove: (event: PointerEvent, pointerDownState: PointerDownState, pointerCoords: {
        x: number;
        y: number;
    }, elementsMap: NonDeletedSceneElementsMap) => boolean;
    /**
     * Box-selects with the selection tool — the line editor's points, while
     * editing a line.
     */
    handleBoxSelectionOnPointerMove: (event: PointerEvent, pointerDownState: PointerDownState) => void;
    /**
     * After dragging the selection: the dragged elements join the frame they're
     * dropped in, or leave theirs (and the edited group, if they leave it).
     */
    handleSelectionDragOnPointerUp: (childEvent: PointerEvent) => void;
    /**
     * The selection's transform handle at the scene point, if any — with its
     * element, for a lone selected element.
     *
     * A lone selected element has none while the line editor is open or one of
     * its line points is hovered, nor does an elbow arrow, a two-point line or
     * arrow, or (on mobile devices) any line or arrow. The selection has none in
     * the element link selector.
     */
    getTransformHandleAt(selectedElements: readonly NonDeletedExcalidrawElement[], sceneX: number, sceneY: number, pointerType: PointerType): {
        element?: NonDeletedExcalidrawElement;
        transformHandleType: TransformHandleType;
    } | null;
    /**
     * Updates the selection on a click (no drag): the element below the
     * selected one on an alt-click, the clicked element added to or removed
     * from the selection with shift, or selected, and the selection cleared
     * by a click hitting only a bounding box.
     *
     * @returns whether the pointer event has been completely handled
     */
    handleSelectionOnPointerUp: (childEvent: PointerEvent, pointerDownState: PointerDownState, elementsMap: NonDeletedSceneElementsMap) => boolean;
    clearSelection(hitElement: ExcalidrawElement | null): void;
    /** whether an alt-click on the selection (over other elements) cycles it */
    canCycleSelection: () => boolean;
    /**
     * The selectable unit (an element, or the group a click would select) an
     * element belongs to. Inside an edited group, its elements are units of
     * their own.
     */
    private getSelectableUnit;
    /**
     * The selected unit, if an alt-click can cycle away from it: exactly one
     * is selected, and neither the linear nor the crop editor is open.
     */
    private getCyclableSelectedUnit;
    /**
     * The element an alt-click selects: the selectable unit below the selected
     * one among the hit elements, wrapping around to the topmost — or `null`
     * unless it's an alt-click, the selection can cycle, and it's under the
     * pointer. Inside an edited group, it cycles through the group's elements
     * only, never leaving the group.
     */
    private getSelectionCycleTarget;
}
