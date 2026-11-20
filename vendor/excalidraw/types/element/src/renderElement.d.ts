import { type GlobalPoint } from "@excalidraw/math";
import type { AppState, StaticCanvasAppState, InteractiveCanvasAppState, ElementRenderOverrides } from "@excalidraw/excalidraw/types";
import type { StaticCanvasRenderConfig, RenderableElementsMap, InteractiveCanvasRenderConfig } from "@excalidraw/excalidraw/scene/types";
import type { RenderEnvironment } from "./renderEnvironment";
import type { FrameRenderPass } from "./frameStyle";
import type { DeviceRect } from "./blackboard";
import type { ExcalidrawElement, ExcalidrawTextElement, NonDeletedExcalidrawElement, ExcalidrawFreeDrawElement, ExcalidrawImageElement, NonDeletedSceneElementsMap, ElementsMap } from "./types";
import type { RoughCanvas } from "roughjs/bin/canvas";
/**
 * Margin, in device px before zoom, around an element's cached canvas. Scene
 * px of margin = padding / device scale.
 */
export declare const getCanvasPadding: (element: ExcalidrawElement) => number;
export type RenderPositionOffset = Readonly<{
    x: number;
    y: number;
}>;
/** Bound labels follow their container; a label's own offset is ignored. */
export declare const getElementRenderOffset: (element: ExcalidrawElement, elementsMap: ElementsMap, overrides: ElementRenderOverrides | undefined) => RenderPositionOffset | undefined;
export declare const getRenderElementWithPositionOverride: <TElement extends ExcalidrawElement>(element: TElement, positionOffset: RenderPositionOffset) => TElement;
export type ElementRenderState = Readonly<{
    /** Alpha including frame opacity and pending erasure; selection dimming is separate. */
    opacity: number;
    offset: RenderPositionOffset;
}>;
/** Resolve visual state at the drawing boundary, preserving document cache keys. */
export declare const resolveElementRenderState: (element: ExcalidrawElement, elementsMap: ElementsMap, renderConfig: Pick<StaticCanvasRenderConfig, "elementRenderOverrides" | "elementsPendingErasure" | "pendingFlowchartNodes">, allElementsMap?: ElementsMap) => ElementRenderState;
export interface ExcalidrawElementWithCanvas {
    element: ExcalidrawElement | ExcalidrawTextElement;
    canvas: HTMLCanvasElement;
    theme: AppState["theme"];
    scale: number;
    /** backing-store scale the bitmap was rasterized at, see StaticCanvasRenderConfig["scale"] */
    deviceScale: number;
    environment: RenderEnvironment;
    zoomValue: AppState["zoom"]["value"];
    canvasOffsetX: number;
    canvasOffsetY: number;
    imageCrop: ExcalidrawImageElement["crop"] | null;
    containingFrameOpacity: number;
    /** KuszCanvas: host render flags the bitmap was drawn with */
    blackboardMode: boolean;
    markdownText: boolean;
}
export declare const DEFAULT_LINK_SIZE = 14;
/**
 * `save()`s the context around `draw`, restoring it even when `draw` throws:
 * the scene renderer logs a failing element and carries on, and the element
 * mustn't leave its transforms and clips behind for the next one.
 */
export declare const withSavedContext: (context: CanvasRenderingContext2D, draw: () => void) => void;
/**
 * KuszCanvas: whether `element` renders as chalk (blackboard mode). Shared
 * with the SVG exporter.
 */
export declare const isChalkedRender: (element: NonDeletedExcalidrawElement, elementsMap: ElementsMap, renderConfig: Readonly<{
    theme: StaticCanvasRenderConfig["theme"];
}>) => boolean;
/**
 * KuszCanvas: the box an element paints in, in its local drawing units
 * (origin at `element.x`/`y`), with room for strokes and arrowheads.
 */
export declare const getChalkLocalBounds: (element: NonDeletedExcalidrawElement, elementsMap: ElementsMap) => DeviceRect;
export declare const elementWithCanvasCache: WeakMap<ExcalidrawElement, ExcalidrawElementWithCanvas>;
export declare const renderSelectionElement: (element: NonDeletedExcalidrawElement, context: CanvasRenderingContext2D, appState: InteractiveCanvasAppState, selectionColor: InteractiveCanvasRenderConfig["selectionColor"]) => void;
export declare const renderElement: (element: NonDeletedExcalidrawElement, elementsMap: RenderableElementsMap, allElementsMap: NonDeletedSceneElementsMap, rc: RoughCanvas, context: CanvasRenderingContext2D, renderConfig: StaticCanvasRenderConfig, appState: StaticCanvasAppState | InteractiveCanvasAppState, renderState?: Readonly<{
    /** Alpha including frame opacity and pending erasure; selection dimming is separate. */
    opacity: number;
    offset: RenderPositionOffset;
}>, 
/**
 * KuszCanvas: which part of a stylable frame to paint. The static scene
 * paints a filled frame's "fill" below its children and its "stroke" at
 * the frame's own z-index; everything else paints in full.
 */
framePass?: FrameRenderPass) => void;
export declare function getFreedrawOutlineAsSegments(element: ExcalidrawFreeDrawElement, points: [number, number][], elementsMap: ElementsMap): import("@excalidraw/math").LineSegment<GlobalPoint>[];
