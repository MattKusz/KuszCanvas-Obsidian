import type { Scene } from "@excalidraw/element";
import type { ExcalidrawElement, ExcalidrawFrameLikeElement, ExcalidrawFreeDrawElement, NonDeleted } from "@excalidraw/element/types";
/** The timing functions of the window that owns the editor. */
export type FrameLiveExpandScheduler = {
    now: () => number;
    setTimeout: (fn: () => void, ms: number) => number;
    clearTimeout: (id: number) => void;
    requestAnimationFrame: (fn: (time: number) => void) => number;
    cancelAnimationFrame: (id: number) => void;
};
/** What the release does with the frame the gesture previewed. */
export type FrameDropDecision = {
    frameId: ExcalidrawFrameLikeElement["id"];
    joins: boolean;
    admitsNewMembers: boolean;
    outsidersOnTop: boolean;
};
export declare class AppFrameLiveExpand {
    private readonly getScene;
    private readonly getScheduler;
    private readonly onPreviewFrameChange;
    /** each frame's box before this gesture first touched it */
    private originals;
    private session;
    private animations;
    private animationFrame;
    /** Escape turned live expand off for the rest of this gesture */
    private cancelledForGesture;
    private decision;
    /** a frame the drag let go of (or may not enter): the drop must not join */
    private rejectedFrameId;
    constructor(deps: {
        getScene: () => Scene;
        getScheduler: () => FrameLiveExpandScheduler;
        /** the drop target changed between pointer moves (the dwell passed) */
        onPreviewFrameChange: (frame: NonDeleted<ExcalidrawFrameLikeElement> | null) => void;
    });
    /**
     * A drag moved. `cursorFrame` is the frame the editor finds under the
     * pointer (live geometry); `dragged` are the dragged elements at their new
     * positions. Returns the frame the drop would join now — the one to
     * highlight — or null.
     */
    dragMove(pointer: {
        x: number;
        y: number;
    }, cursorFrame: NonDeleted<ExcalidrawFrameLikeElement> | null, dragged: readonly ExcalidrawElement[]): NonDeleted<ExcalidrawFrameLikeElement> | null;
    /**
     * A freehand stroke grew. A stroke belongs to the frame it started in (if
     * any): that frame grows to fit it at once and never lets go. A stroke
     * started outside grows nothing.
     */
    freedrawMove(element: ExcalidrawFreeDrawElement): void;
    /**
     * The gesture ended: stop every timer and animation, put each frame where
     * its preview was heading, and remember the decision for the drop.
     */
    settle(): FrameDropDecision | null;
    /** The last `settle()` decision, once (null after it was read). */
    consumeDecision(): FrameDropDecision | null;
    /**
     * Puts every touched frame back to its original box at once and stops all
     * timers. `forRestOfGesture`: Escape keeps live expand off until release;
     * a tool change or unmount does not.
     */
    cancel(forRestOfGesture: boolean): void;
    isActive(): boolean;
    private getOriginal;
    private startSession;
    /** ends the live session; its frame returns to its original box */
    private endSession;
    private getRule;
    private getPreviewBox;
    /** animates the session's frame toward what a drop now would leave */
    private applyPreview;
    private animateTo;
    private requestTick;
    private tick;
    private setFrameBox;
    private stopTimers;
    private reset;
}
