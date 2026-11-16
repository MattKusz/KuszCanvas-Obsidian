import type { ExcalidrawFreeDrawElement } from "./types";
export declare const getFreedrawOutlinePoints: (element: ExcalidrawFreeDrawElement) => [number, number][];
export declare const getSvgPathFromStroke: (points: number[][]) => string;
export declare const getFreeDrawSvgPath: (element: ExcalidrawFreeDrawElement) => string;
