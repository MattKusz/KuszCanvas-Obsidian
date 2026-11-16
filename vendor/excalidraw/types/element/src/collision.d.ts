import type { GlobalPoint, LineSegment } from "@excalidraw/math";
import type { AppState, FrameNameBounds } from "@excalidraw/excalidraw/types";
import type { ElementsMap, ExcalidrawBindableElement, ExcalidrawElement, NonDeleted, NonDeletedExcalidrawElement, NonDeletedSceneElementsMap, Ordered } from "./types";
export declare const shouldTestInside: (element: ExcalidrawElement) => boolean;
export type HitTestArgs = {
    point: GlobalPoint;
    element: ExcalidrawElement;
    threshold: number;
    elementsMap: ElementsMap;
    frameNameBound?: FrameNameBounds | null;
    overrideShouldTestInside?: boolean;
};
export declare const hitElementItself: ({ point, element, threshold, elementsMap, frameNameBound, overrideShouldTestInside, }: HitTestArgs) => boolean;
export declare const hitElementBoundingBox: (point: GlobalPoint, element: ExcalidrawElement, elementsMap: ElementsMap, tolerance?: number) => boolean;
export declare const hitElementBoundingBoxOnly: (hitArgs: HitTestArgs, elementsMap: ElementsMap) => boolean;
export declare const hitElementBoundText: (point: GlobalPoint, element: ExcalidrawElement, elementsMap: ElementsMap) => boolean;
/**
 * Whether an arrow endpoint at the point could bind to the element: inside it,
 * or within binding distance of its outline. Unlike `getBindingCandidates`,
 * it ignores frame clipping, as frames may not be sized yet (e.g. while
 * converting skeletons, where frames are sized around their children last)
 */
export declare const isPointInBindingArea: (point: GlobalPoint, element: NonDeleted<ExcalidrawBindableElement>, elementsMap: ElementsMap, zoom: AppState["zoom"]) => boolean;
/**
 * Whether the element hides what is behind it from binding — an arrow's or a
 * text label's. Images count as opaque, and frames once they support a
 * background.
 */
export declare const isOpaqueForBinding: (element: ExcalidrawElement) => boolean;
/**
 * All elements an arrow endpoint at the point could bind to. Always includes
 * the result of `getHoveredElementForBinding` for the same arguments.
 */
export declare const getAllHoveredElementAtPoint: (point: Readonly<GlobalPoint>, elements: readonly Ordered<NonDeletedExcalidrawElement>[], elementsMap: NonDeletedSceneElementsMap, zoom: AppState["zoom"]) => NonDeleted<ExcalidrawBindableElement>[];
export declare const getHoveredElementForBinding: (point: Readonly<GlobalPoint>, elements: readonly Ordered<NonDeletedExcalidrawElement>[], elementsMap: NonDeletedSceneElementsMap, zoom: AppState["zoom"]) => NonDeleted<ExcalidrawBindableElement> | null;
/**
 * Intersect a line with an element for binding test
 *
 * @param element
 * @param line
 * @param offset
 * @returns
 */
export declare const intersectElementWithLineSegment: (element: ExcalidrawElement, elementsMap: ElementsMap, line: LineSegment<GlobalPoint>, offset?: number, onlyFirst?: boolean) => GlobalPoint[];
/**
 * Check if the given point is considered inside the element's border
 *
 * @param point
 * @param element
 * @returns
 */
export declare const isPointInElement: (point: GlobalPoint, element: ExcalidrawElement, elementsMap: ElementsMap) => boolean;
export declare const isBindableElementInsideOtherBindable: (innerElement: ExcalidrawBindableElement, outerElement: ExcalidrawBindableElement, elementsMap: ElementsMap) => boolean;
