import type { Scene, Store } from "@excalidraw/element";
import type { GlobalPoint } from "@excalidraw/math";
import type { FontMetadata } from "@excalidraw/common";
import type { ElementsMap, ExcalidrawElement, ExcalidrawTextElement, NonDeletedExcalidrawElement } from "@excalidraw/element/types";
import type { ObsidianExcalidrawHostAdapter, // zsviczian -- plugin #3019 derives named action types from the host
ObsidianKeyBlocker, ObsidianMermaidService } from "./obsidianExcalidrawHost";
import type { AppClassProperties, AppState } from "./types";
export declare function allowDoubleTapEraser(): boolean;
export declare function getMaxZoom(): number;
export declare function hideFreedrawPenmodeCursor(): boolean;
export declare function getFontMetrics(fontFamily: ExcalidrawTextElement["fontFamily"], fontSize?: number): {
    unitsPerEm: number;
    ascender: number;
    descender: number;
    lineHeight: number;
    baseline: number;
    fontString: string;
};
export declare function registerLocalFont(fontMetrics: FontMetadata & {
    name: string;
}, uri: string): void;
export declare function getFontFamilies(): string[];
export declare const getDefaultColorPalette: () => readonly (readonly [string, string, string, string, string])[];
export declare function registerFontsInCSS(): Promise<void>;
export declare function getCSSFontDefinition(fontFamily: number): Promise<string>;
export declare function loadSceneFonts(elements: NonDeletedExcalidrawElement[]): Promise<FontFace[]>;
export declare function fetchFontFromVault(url: string | URL): Promise<ArrayBuffer | undefined>;
export declare function isTouchInPenMode(appState: AppState, event: React.PointerEvent<HTMLElement> | MouseEvent): boolean;
export declare function getSharedMermaidInstance(): Promise<ObsidianMermaidService>;
export declare function loadMermaid(): Promise<ObsidianMermaidService>;
export declare const intersectElementWithLine: (element: ExcalidrawElement, a: GlobalPoint, b: GlobalPoint, gap: number | undefined, elementsMap: ElementsMap) => GlobalPoint[] | undefined;
export declare const disableDoubleClickTextEditing: () => boolean;
export declare const getZoomStep: () => number;
export declare const getZoomMin: () => number;
export declare const getZoomMax: () => number;
export declare const runAction: (action: Parameters<ObsidianExcalidrawHostAdapter["runAction"]>[0], editorId?: string) => void;
export declare const t2: (key: string) => string;
/**
 * zsviczian -- plugin #3027: only SVG-backed Mermaid output needs the host's
 * conversion choice. Native diagrams and standalone insertion remain synchronous.
 * The host receives an exact editor ID and staged data, never the App instance.
 * Author: zsviczian. See dev-docs/Obsidian/contracts.md.
 */
export declare const prepareMermaidSVGInsert: (app: AppClassProperties, diagram: Parameters<ObsidianExcalidrawHostAdapter["prepareMermaidSVGInsert"]>[1]) => (() => Promise<import("./obsidianExcalidrawHost").ObsidianDiagramInsertion | null>) | null;
export declare const shouldDisableZoom: (appState: AppState) => boolean;
export declare const isFullPanelMode: (app: AppClassProperties) => boolean;
export declare const isContextMenuDisabled: () => boolean;
export declare const refreshAllArrows: (scene: Scene, store: Store) => void;
/**
 * Attaches an inline link suggester to the specified input element.
 * @param inputEl The HTML input element to attach the suggester to.
 * @param widthWrapper Optional HTML element to wrap the width of suggester element.
 * @param container Optional container element used as collision boundary.
 * @param surpessPlaceholder Whether to suppress the placeholder text. Defaults to true.
 * @returns A keyboard-blocking lifecycle for managing keyboard input.
 */
export declare const attachInlineLinkSuggester: (inputEl: HTMLInputElement | HTMLTextAreaElement, widthWrapper?: HTMLElement, container?: HTMLDivElement | null, surpessPlaceholder?: boolean) => ObsidianKeyBlocker;
export declare const syncElementLinkWithText: () => boolean;
