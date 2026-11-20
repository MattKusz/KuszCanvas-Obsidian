import type { AppState } from "@excalidraw/excalidraw/types";
import type { Drawable } from "roughjs/bin/core";
import type { ExcalidrawElement, ExcalidrawFrameElement, ExcalidrawFrameLikeElement } from "./types";
/**
 * Value of `customData.frameStyle` on frames drawn like rectangles.
 * Contract with KuszCanvas-Obsidian `src/utils/dynamicStyling.ts`
 * (`needsDynamicFrameColor`), which skips recolouring frames carrying this
 * literal: change both together.
 */
export declare const FRAME_SHAPE_STYLE = "shape";
export type FrameShapeStyle = Pick<ExcalidrawElement, "strokeColor" | "backgroundColor" | "fillStyle" | "strokeWidth" | "strokeStyle" | "roughness" | "roundness">;
export type FrameRenderPass = "full" | "fill" | "stroke";
type HostFrameColor = {
    stroke?: string;
} | null | undefined;
/** A regular frame: not a marker frame, not a magic frame. */
export declare const isStylableFrame: (element: ExcalidrawElement | null | undefined) => element is ExcalidrawFrameElement;
/** A regular frame that has opted into rectangle styling. */
export declare const isShapeStyledFrame: (element: ExcalidrawElement | null | undefined) => boolean;
/** The frame tool draws stylable frames unless it is set to marker frames. */
export declare const isStylableFrameTool: (toolType: string, frameRole: ExcalidrawFrameLikeElement["frameRole"] | null | undefined) => boolean;
/**
 * The current-item styles a new rectangle would take, used for new frames
 * (frame tool and "wrap selection in frame").
 */
export declare const getCurrentItemFrameShapeStyle: (appState: Pick<AppState, "currentItemStrokeColor" | "currentItemBackgroundColor" | "currentItemFillStyle" | "currentItemStrokeWidthKey" | "currentItemStrokeWidth" | "currentItemStrokeStyle" | "currentItemRoughness" | "currentItemRoundness">) => FrameShapeStyle;
/**
 * Constructor styles for a frame created with the frame tool. Regular
 * frames take the current-item styles and the shape flag; marker frames and
 * magic frames keep the legacy frame style and the host palette.
 */
export declare const getFrameCreationStyle: ({ type, frameRole, currentItemStyle, hostFrameColor, }: {
    type: "frame" | "magicframe";
    frameRole: ExcalidrawFrameLikeElement["frameRole"] | null | undefined;
    currentItemStyle: FrameShapeStyle;
    hostFrameColor: Record<string, string> | null | undefined;
}) => FrameShapeStyle & {
    customData?: Record<string, unknown>;
};
/**
 * The rectangle style a stylable frame is drawn with. Legacy frames use the
 * host palette for the outline (`customData.frameColor` → host
 * `frameColor` → `#bbb`), no fill and the old 8px rounded corners unless they
 * store a roundness of their own.
 */
export declare const resolveFrameRenderStyle: (frame: ExcalidrawElement, hostFrameColor: HostFrameColor) => FrameShapeStyle;
/**
 * Called after a styles-panel action produced `next` from `prev`: a legacy
 * frame whose style changed opts into rectangle styling. Returns `next`
 * unchanged in every other case.
 */
export declare const markFrameStyleChange: <T extends ExcalidrawElement>(prev: ExcalidrawElement, next: T) => T;
/**
 * The part of a frame's cached rough drawable to paint in a render pass,
 * optionally with another stroke colour (legacy host palette). Never
 * mutates the cached drawable.
 */
export declare const getFrameDrawableForPass: (drawable: Drawable, pass: FrameRenderPass, strokeOverride: string | null) => Drawable;
/**
 * Frame children sit just below their frame in z-order, so a frame's fill
 * must be painted before its lowest child or it would cover them. Returns,
 * keyed by the id of the element to paint before, the filled shape frames
 * whose fill pass belongs there. Frames listed here must then be drawn with
 * the "stroke" pass; a frame with no child below it in `elements` is not
 * listed and paints in full at its own z-index.
 */
export declare const getFrameFillAnchors: <T extends ExcalidrawElement>(elements: readonly T[]) => Map<string, (T & ExcalidrawFrameElement)[]>;
export {};
