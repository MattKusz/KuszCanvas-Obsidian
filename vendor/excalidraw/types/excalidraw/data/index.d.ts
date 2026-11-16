import type { ExcalidrawElement, ExcalidrawFrameLikeElement, NonDeleted, NonDeletedExcalidrawElement } from "@excalidraw/element/types";
import type { RenderEnvironment } from "@excalidraw/element";
import type { ExportType } from "../scene/types";
import type { AppState, BinaryFiles } from "../types";
export { loadFromBlob } from "./blob";
export { loadFromJSON, saveAsJSON } from "./json";
export type ExportedElements = readonly NonDeletedExcalidrawElement[] & {
    _brand: "exportedElements";
};
export declare const prepareElementsForExport: (allElements: readonly ExcalidrawElement[], { selectedElementIds }: Pick<AppState, "selectedElementIds">, exportSelectionOnly: boolean) => {
    exportingFrame: NonDeleted<ExcalidrawFrameLikeElement> | null;
    exportedElements: ExportedElements;
};
export declare const exportCanvas: (type: Omit<ExportType, "backend">, elements: ExportedElements, appState: AppState, files: BinaryFiles, { exportPadding, name, fileHandle, exportingFrame, renderEnvironment, }: {
    exportPadding?: number;
    /** filename, if applicable */
    name?: string;
    fileHandle?: FileSystemFileHandle | null;
    exportingFrame: NonDeleted<ExcalidrawFrameLikeElement> | null;
    renderEnvironment?: RenderEnvironment;
}) => Promise<FileSystemFileHandle | null | undefined>;
