import { type GlobalPoint, type LocalPoint } from "@excalidraw/math";
import { type ElementUpdate } from "./mutateElement";
import { type ExcalidrawElbowArrowElement, type NonDeletedSceneElementsMap } from "./types";
import type { FixedPointBinding, FixedSegment } from "./types";
export declare const BASE_PADDING = 40;
/**
 *
 */
export declare const updateElbowArrowPoints: (arrow: Readonly<ExcalidrawElbowArrowElement>, elementsMap: NonDeletedSceneElementsMap, updates: {
    points?: readonly LocalPoint[];
    fixedSegments?: readonly FixedSegment[] | null;
    startBinding?: FixedPointBinding | null;
    endBinding?: FixedPointBinding | null;
}, options?: {
    isDragging?: boolean;
    isBindingEnabled?: boolean;
    isMidpointSnappingEnabled?: boolean;
}) => ElementUpdate<ExcalidrawElbowArrowElement>;
/**
 * The update routing an elbow arrow again where it is, e.g. once its
 * arrowheads change, as its route makes room for them
 */
export declare const updateElbowArrowRoute: <T extends ExcalidrawElbowArrowElement>(arrow: Readonly<T>, elementsMap: NonDeletedSceneElementsMap) => ElementUpdate<T>;
export declare const validateElbowPoints: <P extends GlobalPoint | LocalPoint>(points: readonly P[], tolerance?: number) => boolean;
