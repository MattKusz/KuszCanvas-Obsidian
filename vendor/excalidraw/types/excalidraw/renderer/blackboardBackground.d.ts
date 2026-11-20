/**
 * KuszCanvas: the blackboard board texture on canvas.
 *
 * The board is drawn by a WebGL2 shader (`blackboardShaderCanvas.ts`,
 * built from `blackboardShader.ts`) anchored in scene space, so it never
 * repeats at any zoom. Where WebGL2 is missing (jsdom, node-canvas,
 * OffscreenCanvas) the flat `BLACKBOARD_BASE_COLOR` fill that
 * `bootstrapCanvas` paints first is the board.
 */
import type { RenderEnvironment } from "@excalidraw/element";
export type BlackboardView = Readonly<{
    scrollX: number;
    scrollY: number;
    zoom: number;
}>;
/**
 * Paints the board texture over `width` × `height` CSS px of `context`
 * (already scaled to CSS px). Leaves the context untouched where the shader
 * cannot run.
 */
export declare const paintBlackboardBackground: (context: CanvasRenderingContext2D, view: BlackboardView, width: number, height: number, _environment?: RenderEnvironment) => void;
