import type App from "./App";
type ScenePoint = Readonly<{
    x: number;
    y: number;
}>;
type TaskHit = Readonly<{
    elementId: string;
    sourceLine: number;
}>;
export declare class AppMarkdownTasks {
    private app;
    constructor(app: App);
    private pending;
    /** The task checkbox under `scenePoint`, if a click there would toggle it. */
    hitTest: (scenePoint: ScenePoint) => TaskHit | null;
    /** the visual line of the checkbox under `scenePoint` in `text` */
    private findCheckboxLine;
    /**
     * Arms a toggle when a plain primary press lands on a checkbox. Returns
     * `true` when it took the press (the caller stops: no selection or drag).
     */
    handlePointerDown: (event: Readonly<{
        pointerId: number;
        clientX: number;
        clientY: number;
        shiftKey: boolean;
        altKey: boolean;
        ctrlKey: boolean;
        metaKey: boolean;
    }>, scenePoint: ScenePoint) => boolean;
    /** Disarms a pending toggle (context menu, pointercancel, new press). */
    cancel: () => void;
    private commit;
    /** Toggles the task in the element's text and raw source; one undo step. */
    private toggle;
}
export {};
