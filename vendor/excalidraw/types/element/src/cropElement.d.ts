import type { TransformHandleDirection } from "./transformHandles";
import type { ElementsMap, ExcalidrawImageElement } from "./types";
export declare const MINIMAL_CROP_SIZE = 10;
/**
 * Crops the image (as it was at the drag's start) as resizing it would
 * resize it, as far as the image reaches.
 */
export declare const cropElement: (element: ExcalidrawImageElement, elementsMap: ElementsMap, transformHandle: TransformHandleDirection, naturalWidth: number, naturalHeight: number, pointerX: number, pointerY: number, { shouldMaintainAspectRatio, shouldResizeFromCenter, }?: {
    shouldMaintainAspectRatio?: boolean;
    shouldResizeFromCenter?: boolean;
}) => {
    x: number;
    y: number;
    width: number;
    height: number;
    crop: {
        x: number;
        y: number;
        width: number;
        height: number;
        naturalWidth: number;
        naturalHeight: number;
    } | null;
};
/**
 * Uncrops the image on the handle's side (a corner's two); mirrored, on the
 * opposite side(s) too.
 */
export declare const uncropElementSides: (element: ExcalidrawImageElement, elementsMap: ElementsMap, handle: TransformHandleDirection, mirrored?: boolean) => {
    x: number;
    y: number;
    width: number;
    height: number;
    crop: {
        x: number;
        y: number;
        width: number;
        height: number;
        naturalWidth: number;
        naturalHeight: number;
    } | null;
} | null;
export declare const getUncroppedImageElement: (element: ExcalidrawImageElement, elementsMap: ElementsMap) => ExcalidrawImageElement;
export declare const getUncroppedWidthAndHeight: (element: ExcalidrawImageElement) => {
    width: number;
    height: number;
};
export declare const getFlipAdjustedCropPosition: (element: ExcalidrawImageElement, natural?: boolean) => {
    x: number;
    y: number;
} | null;
