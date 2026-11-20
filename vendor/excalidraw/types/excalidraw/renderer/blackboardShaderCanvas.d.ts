export type BoardShaderView = Readonly<{
    scrollX: number;
    scrollY: number;
    zoom: number;
}>;
/**
 * Paints the board over `width` × `height` CSS px of `context` (scaled to
 * CSS px, no rotation). False when WebGL2 is unavailable, leaving the
 * context untouched.
 */
export declare const paintBoardShader: (context: CanvasRenderingContext2D, view: BoardShaderView, width: number, height: number) => boolean;
