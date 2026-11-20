import type { ChalkLayer, DeviceRect } from "./blackboard";
import type { RenderEnvironment } from "./renderEnvironment";
/**
 * Draws `layer` of the element on `context` (already in the element's local
 * transform). Returns whether it painted anything.
 */
export type ChalkLayerDraw = (context: CanvasRenderingContext2D, layer: ChalkLayer) => boolean;
export type DrawChalkedOptions = Readonly<{
    /**
     * What the element may paint, in the target's current (local) units; null
     * for the whole target canvas (a per-element cache canvas).
     */
    localBounds: DeviceRect | null;
    /** element seed: picks the grain offset and jitter direction */
    seed: number;
    /** offset second pass over the stroke layer (not for text) */
    jitter: boolean;
    environment: RenderEnvironment;
    draw: ChalkLayerDraw;
}>;
/**
 * Paints an element as chalk onto `target`. See the module comment.
 *
 * Falls back to a plain draw (no grain) on a canvas without
 * `getTransform` — a non-DOM canvas the renderer may be handed.
 */
export declare const drawChalked: (target: CanvasRenderingContext2D, options: DrawChalkedOptions) => void;
