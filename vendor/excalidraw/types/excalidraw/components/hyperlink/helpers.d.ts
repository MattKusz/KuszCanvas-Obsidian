import type { RenderEnvironment } from "@excalidraw/element/renderEnvironment";
import type { GlobalPoint, Radians } from "@excalidraw/math";
import type { Bounds } from "@excalidraw/common";
import type { ElementsMap, NonDeletedExcalidrawElement } from "@excalidraw/element/types";
import type { AppState } from "../../types";
export declare const DEFAULT_LINK_SIZE = 12;
type SettledLinkImgStatus = Exclude<LinkImgStatus, "decoding">;
export type LinkImgStatus = "decoding" | "decoded" | "failed";
export type LinkImg = {
    /** Only safe as a `drawImage` source while `status` is `decoded`. */
    img: HTMLImageElement;
    status: LinkImgStatus;
    settled: Promise<SettledLinkImgStatus>;
};
export declare const getExternalLinkImg: (renderEnvironment: RenderEnvironment) => LinkImg;
export declare const getElementLinkImg: (renderEnvironment: RenderEnvironment) => LinkImg;
export declare const startLinkImgDecoding: (renderEnvironment: RenderEnvironment) => Promise<boolean>;
export declare const getLinkHandleFromCoords: ([x1, y1, x2, y2]: Bounds, angle: Radians, appState: Pick<AppState, "zoom">) => Bounds;
export declare const isPointHittingLinkIcon: (element: NonDeletedExcalidrawElement, elementsMap: ElementsMap, appState: AppState, [x, y]: GlobalPoint) => boolean;
export declare const isPointHittingLink: (element: NonDeletedExcalidrawElement, elementsMap: ElementsMap, appState: AppState, [x, y]: GlobalPoint, isMobile: boolean) => boolean;
export {};
