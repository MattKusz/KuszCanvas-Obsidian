import { type FontMetadata } from "@excalidraw/common";
import type { ExcalidrawElement, ExcalidrawTextElement } from "@excalidraw/element/types";
import type { Scene } from "@excalidraw/element";
import { ExcalidrawFontFace } from "./ExcalidrawFontFace";
export declare class Fonts {
    static readonly loadedFontsCache: Set<string>;
    private static _registered;
    private static _initialized;
    static get registered(): Map<number, {
        metadata: FontMetadata;
        fontFaces: ExcalidrawFontFace[];
    }>;
    get registered(): Map<number, {
        metadata: FontMetadata;
        fontFaces: ExcalidrawFontFace[];
    }>;
    private readonly scene;
    private readonly ownerDocument;
    private readonly loadedFonts;
    constructor(scene: Scene, ownerDocument?: Document);
    /**
     * Get all the font families for the given scene.
     */
    getSceneFamilies: () => number[];
    /**
     * if we load a (new) font, it's likely that text elements using it have
     * already been rendered using a fallback font. Thus, we want invalidate
     * their shapes and rerender. See #637.
     *
     * Invalidates text elements and rerenders scene, provided that at least one
     * of the supplied fontFaces has not already been processed.
     */
    onLoaded: (fontFaces: readonly FontFace[]) => void;
    /**
     * Load font faces for a given scene and trigger scene update.
     */
    loadSceneFonts: (defaultFontFamily?: ExcalidrawTextElement["fontFamily"]) => Promise<FontFace[]>;
    /**
     * Load font faces for passed elements - use when the scene is unavailable (i.e. export).
     *
     * Loads into the document's font set, or in a worker into the worker's own
     * (`self.fonts`, what an `OffscreenCanvas` there measures with). Where there
     * is neither -- e.g. a DOM shim without `FontFaceSet` (`linkedom`), or Node
     * -- nothing is loaded: the host makes the fonts available itself, and is
     * warned once if the elements use fonts that would need loading.
     */
    static loadElementsFonts: (elements: readonly ExcalidrawElement[], ownerDocument?: Document) => Promise<FontFace[]>;
    /**
     * Generate CSS @font-face declarations for the given elements.
     */
    static generateFontFaceDeclarations(elements: readonly ExcalidrawElement[]): Promise<string[]>;
    static loadFontFaces(fontFamilies: Array<ExcalidrawTextElement["fontFamily"]>, charsPerFamily: Record<number, Set<string>>, target: FontFaceSet | Document): Promise<FontFace[]>;
    private static fontFacesLoader;
    private static fontFacesStylesGenerator;
    /**
     * Register a new font.
     *
     * @param family font family
     * @param metadata font metadata
     * @param fontFacesDecriptors font faces descriptors
     */
    static register(this: Fonts | {
        registered: Map<number, {
            metadata: FontMetadata;
            fontFaces: ExcalidrawFontFace[];
        }>;
    }, family: string, metadata: FontMetadata, ...fontFacesDecriptors: ExcalidrawFontFaceDescriptor[]): Map<number, {
        metadata: FontMetadata;
        fontFaces: ExcalidrawFontFace[];
    }> | Map<number, {
        metadata: FontMetadata;
        fontFaces: ExcalidrawFontFace[];
    }>;
    /**
     * WARN: should be called just once on init, even across multiple instances.
     */
    private static init;
    /**
     * Get all the unique font families for the given elements.
     */
    static getUniqueFamilies(elements: ReadonlyArray<ExcalidrawElement>): Array<ExcalidrawTextElement["fontFamily"]>;
    /**
     * Get all the unique characters per font family for the given scene.
     */
    private static getCharsPerFamily;
    /**
     * Get characters for a given family.
     */
    private static getCharacters;
}
export interface ExcalidrawFontFaceDescriptor {
    uri: string;
    descriptors?: FontFaceDescriptors;
}
