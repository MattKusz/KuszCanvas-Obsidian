import type { ExcalidrawFrameLikeElement } from "@excalidraw/element/types";
import type { StaticCanvasRenderConfig, StaticSceneRenderConfig } from "../scene/types";
import type { StaticCanvasAppState } from "../types";
export declare const frameClip: (frame: ExcalidrawFrameLikeElement, context: CanvasRenderingContext2D, renderConfig: StaticCanvasRenderConfig, appState: StaticCanvasAppState) => void;
/**
 * Throttled to animation framerate, one throttle per canvas. A shared
 * throttle drops all but the last caller's pending frame when multiple
 * editors render in the same frame, and a module-realm scheduler would run
 * popout renders on the main window's rAF, which freezes while that window
 * is hidden.
 */
export declare const renderStaticSceneThrottled: (config: StaticSceneRenderConfig) => void;
/** Drops the canvas' pending frame; the throttle itself is dropped with the
 * canvas. */
export declare const cancelStaticSceneThrottle: (canvas: HTMLCanvasElement) => void;
/**
 * Static scene is the non-ui canvas where we render elements.
 */
export declare const renderStaticScene: (renderConfig: StaticSceneRenderConfig, throttle?: boolean) => void;
