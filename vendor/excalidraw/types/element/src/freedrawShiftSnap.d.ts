/**
 * Shift-constrained freehand (KuszCanvas whiteboard, CP3).
 *
 * While Shift is held during a freedraw stroke, every raw point after an
 * anchor is projected onto the anchor→pointer direction snapped to the
 * nearest 45°. Points keep their index (and any pressure component), so
 * perfect-freehand still derives thickness from pressure and point spacing.
 *
 * Pure logic only: App.tsx owns the event handling and scene mutation.
 */
import { type LocalPoint } from "@excalidraw/math";
/**
 * Projects every point after `anchorIndex` onto the line from the anchor
 * towards the last point, snapped to 0/45/90°… The distance along that line
 * is clamped to [0, distance of the last point] and made non-decreasing, so
 * back-tracking cannot fold the line over itself. Points up to and including
 * the anchor are returned unchanged; components after x and y (pressure) are
 * kept. Returns a new array.
 */
export declare const snapFreedrawSegment: <P extends readonly number[]>(points: readonly P[], anchorIndex: number) => P[];
/** Per-stroke buffer for Shift-constrained freehand. */
export type FreedrawSnapState = {
    /** Index in the displayed points where the current Shift segment starts. */
    anchorIndex: number | null;
    /** Raw (unsnapped) pointer points after the anchor. */
    rawTail: LocalPoint[];
    /** The previous raw pointer point, for duplicate filtering. */
    lastRaw: LocalPoint | null;
};
export declare const createFreedrawSnapState: () => FreedrawSnapState;
/**
 * Adds one raw pointer point to a freedraw stroke.
 *
 * - Shift up: the point is appended as is (and any Shift segment is frozen).
 * - Shift goes down: the anchor is the current last displayed point.
 * - Shift held: the displayed tail after the anchor is rebuilt from the raw
 *   tail and snapped, so the segment follows the pointer direction.
 *
 * The returned points always have one more entry than `displayedPoints`
 * when `appended` is true, so a parallel pressures array stays aligned.
 * A point identical to the previous raw point is discarded (`appended`
 * false, inputs returned unchanged).
 */
export declare const appendFreedrawStrokePoint: (state: FreedrawSnapState, displayedPoints: readonly LocalPoint[], rawPoint: LocalPoint, shiftKey: boolean) => {
    state: FreedrawSnapState;
    points: LocalPoint[];
    appended: boolean;
};
