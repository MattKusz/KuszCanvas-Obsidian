import type { Bounds } from "@excalidraw/common";
import type { ElementsMap, ExcalidrawElement, ExcalidrawFrameLikeElement } from "./types";
/** How long something must reach past a frame before the frame grows. */
export declare const FRAME_EXPAND_DWELL_MS = 300;
/** Duration of one grow/return animation of a frame under a drag. */
export declare const FRAME_EXPAND_ANIMATION_MS = 180;
/** Easing of a frame following a freehand stroke: short, to keep up. */
export declare const FRAME_FREEDRAW_ANIMATION_MS = 60;
/**
 * How far the dragged selection may overhang the frame's ORIGINAL box while
 * the frame keeps following, as a share of the selection's own width
 * (left/right) and height (top/bottom), each axis on its own. At 0.5 the
 * frame lets go once the selection's centre leaves the original box. Past
 * it, the frame returns to its original size and the drop does not join.
 * Scene units: zoom-independent.
 */
export declare const FRAME_FOLLOW_ZONE_RATIO = 0.5;
/** A frame's axis-aligned box, with non-negative width and height. */
export type FrameBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};
type Point = {
    x: number;
    y: number;
};
/** The frame's box, normalised (a frame mid-creation may be negative). */
export declare const getFrameBox: (frame: ExcalidrawFrameLikeElement) => FrameBox;
/**
 * The box grown to fit the bounds. Expand only: a side moves only where some
 * bounds pass it, and then to those bounds plus `padding`; every other side
 * stays, so the result always contains the box. Bounds snapped to an edge
 * (within PRECISION) do not count as passing it.
 */
export declare const growFrameBoxToFit: (box: FrameBox, bounds: readonly Bounds[], padding: number) => FrameBox;
/**
 * The rotated bounds a frame must fit for these elements: each non-deleted,
 * non-frame element plus its bound text (a label is fitted even when only its
 * container is passed).
 */
export declare const getElementsFitBounds: (elements: readonly ExcalidrawElement[], elementsMap: ElementsMap) => Bounds[];
/** Whether the point is in the box, edges included. */
export declare const isPointInFrameBox: (point: Point, box: FrameBox) => boolean;
/**
 * Whether a dragged selection with these bounds is within the follow zone of
 * a frame whose original box is given: it overhangs the left or right edge by
 * no more than `ratio` × its own width, and the top or bottom edge by no more
 * than `ratio` × its own height, each axis measured on its own.
 */
export declare const isSelectionInFrameFollowZone: (selection: Bounds, originalBox: FrameBox, ratio: number) => boolean;
/** The union of the bounds, or null for none. */
export declare const unionBounds: (bounds: readonly Bounds[]) => Bounds | null;
/** Ease-out cubic on progress 0..1 (values outside are clamped). */
export declare const easeOutCubic: (progress: number) => number;
/** The box `progress` (0..1) of the way from `from` to `to`. */
export declare const interpolateFrameBox: (from: FrameBox, to: FrameBox, progress: number) => FrameBox;
export declare const frameBoxesEqual: (a: FrameBox, b: FrameBox) => boolean;
export type FrameDropInput = {
    /** a drag of existing elements, or a freehand stroke being drawn */
    kind: "drag" | "freedraw";
    /**
     * the frame engaged and its dwell has passed — or no dwell applies (see
     * `frameDwellApplies`)
     */
    dwellElapsed: boolean;
    /** the dragged selection is within the frame's follow zone */
    inZone: boolean;
    /** some dragged element was already in this frame when the drag started */
    hasMembers: boolean;
    /** some dragged element was not in this frame */
    hasOutsiders: boolean;
};
export type FrameDropDecision = {
    /** the frame is the drop target: highlighted, and members stay in it */
    joins: boolean;
    /** elements not yet in the frame are added to it */
    admitsNewMembers: boolean;
    /** what the frame's final box fits: nothing new, its existing children, or all */
    size: "original" | "members" | "all";
    /** newcomers dropped before the dwell are put on top of the frame */
    outsidersOnTop: boolean;
};
/**
 * Whether a frame waits FRAME_EXPAND_DWELL_MS before it follows: only for
 * newcomers. A frame's own children (and a stroke started in it) make it
 * grow at once.
 */
export declare const frameDwellApplies: (input: {
    hasOutsiders: boolean;
}) => boolean;
/**
 * What a drop does with the frame under a live expand — and so what the
 * preview shows while dragging.
 * - A freehand stroke stays in the frame it started in.
 * - Past the follow zone, nothing joins and the frame returns.
 * - After the dwell (or with no dwell: children only), everything joins.
 * - Before the dwell, children stay in and newcomers land on top.
 */
export declare const getFrameDropDecision: (input: FrameDropInput) => FrameDropDecision;
/**
 * Pure: the z-order with the given elements that sit below the frame moved
 * to just above it (keeping their relative order), so an element dropped on
 * top of a frame is drawn over it, its fill included. Elements already above
 * the frame stay. Returns the same array when nothing moves.
 */
export declare const placeElementsAboveFrame: <T extends ExcalidrawElement>(elements: readonly T[], elementIds: ReadonlySet<ExcalidrawElement["id"]>, frameId: ExcalidrawFrameLikeElement["id"]) => {
    elements: readonly T[];
    moved: T[];
};
export {};
