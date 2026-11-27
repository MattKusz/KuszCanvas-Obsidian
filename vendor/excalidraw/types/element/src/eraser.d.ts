import type { GlobalPoint } from "@excalidraw/math";
import type { ElementsMap, ExcalidrawElement } from "./types";
/**
 * Sticky notes, embeds (iframe / embeddable) and images are never erased:
 * not by the trail, a click, their group or their frame being erased. A
 * sticky note's label shares its note's protection.
 */
export declare const isEraserProtected: (element: ExcalidrawElement, elementsMap: ElementsMap) => boolean;
/**
 * Closed shapes and frames are erased only where the eraser crosses their
 * outline, never through their fill.
 */
export declare const isEraserOutlineOnly: (element: ExcalidrawElement) => boolean;
/**
 * The label of an outline-only container sits inside its fill, so touching
 * the label must not erase the container.
 */
export declare const isEraserIgnoredLabel: (element: ExcalidrawElement, elementsMap: ElementsMap) => boolean;
/**
 * Filters a click hit the editor already found at `point`: drops protected
 * elements and labels inside shapes, and keeps an outline-only element only
 * when the click lands within `threshold` of its outline.
 */
export declare const isEraserClickHit: (point: GlobalPoint, element: ExcalidrawElement, elementsMap: ElementsMap, threshold: number) => boolean;
export type EraserOutcome = "delete" | "detachFromFrame" | null;
/**
 * What committing an erase does to `element`, given the ids the eraser marked.
 * Erasing a frame erases its children and erasing a container its label,
 * except for protected elements, which leave the erased frame instead.
 */
export declare const getEraserOutcome: (element: ExcalidrawElement, pendingIds: ReadonlySet<ExcalidrawElement["id"]>, elementsMap: ElementsMap) => EraserOutcome;
