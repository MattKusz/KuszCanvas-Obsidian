/**
 * Public export compatibility adapters for Obsidian and community scripts.
 * Author: zsviczian
 * Reference: https://github.com/zsviczian/excalidraw/pull/468
 * Upstream replaced these flat options with exportScene. Keep the public host
 * contract while delegating all rendering to that single upstream pipeline.
 */
import { MIME_TYPES } from "@excalidraw/common";
import type { ExcalidrawFrameLikeElement, NonDeleted, NonDeletedExcalidrawElement } from "@excalidraw/element/types";
import { exportToClipboard as exportSceneToClipboard } from "./scene/export";
import type { AppState, BinaryFiles } from "./types";
export { MIME_TYPES };
type ExportOpts = {
    /** restored before exporting */
    elements: readonly NonDeletedExcalidrawElement[];
    appState?: Partial<Omit<AppState, "offsetTop" | "offsetLeft">>;
    files: BinaryFiles | null;
    maxWidthOrHeight?: number;
    exportingFrame?: NonDeleted<ExcalidrawFrameLikeElement> | null;
    getDimensions?: (width: number, height: number) => {
        width: number;
        height: number;
        scale?: number;
    };
};
export declare const exportToCanvas: ({ elements, appState, files, maxWidthOrHeight, getDimensions, exportPadding, exportingFrame, }: ExportOpts & {
    exportPadding?: number;
}) => Promise<HTMLCanvasElement>;
export declare const exportToBlob: (opts: ExportOpts & {
    mimeType?: string;
    quality?: number;
    exportPadding?: number;
}) => Promise<Blob>;
export declare const exportToSvg: ({ elements, appState, files, exportPadding, renderEmbeddables, exportingFrame, skipInliningFonts, reuseImages, }: Omit<ExportOpts, "getDimensions"> & {
    exportPadding?: number;
    renderEmbeddables?: boolean;
    skipInliningFonts?: true;
    reuseImages?: boolean;
}) => Promise<SVGSVGElement>;
export declare const exportToClipboard: (opts: Parameters<typeof exportSceneToClipboard>[0] | (ExportOpts & {
    mimeType?: string;
    quality?: number;
    type: "png" | "svg" | "json";
})) => Promise<void>;
