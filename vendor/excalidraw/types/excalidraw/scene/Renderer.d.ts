import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";
import type { Scene } from "@excalidraw/element";
import type { RenderableElementsMap } from "./types";
import type { AppState, ElementRenderOffsets } from "../types";
type GetRenderableElementsOpts = {
    zoom: AppState["zoom"];
    offsetLeft: AppState["offsetLeft"];
    offsetTop: AppState["offsetTop"];
    scrollX: AppState["scrollX"];
    scrollY: AppState["scrollY"];
    height: AppState["height"];
    width: AppState["width"];
    editingTextElement: AppState["editingTextElement"];
    newElement: AppState["newElement"];
    selectedElements: readonly NonDeletedExcalidrawElement[];
    selectedElementsAreBeingDragged: AppState["selectedElementsAreBeingDragged"];
    frameToHighlight: AppState["frameToHighlight"];
};
export declare class Renderer {
    private scene;
    constructor(scene: Scene);
    /**
     * Adjusts the document-visible set for render-override translations: an
     * element leaves it when its offset moves it out of view and enters it when
     * its offset brings it in; everything else keeps its document visibility.
     * Only translated elements go through viewport geometry. The result is
     * memoized on the offsets' identity so that opacity-only snapshots don't
     * reach it at all.
     */
    getVisibleElementsWithRenderOffsets(visibleElements: readonly NonDeletedExcalidrawElement[], elementsMap: RenderableElementsMap, appState: AppState, offsets: ElementRenderOffsets): readonly NonDeletedExcalidrawElement[];
    private _getVisibleElementsWithRenderOffsets;
    /** the document-visible elements as a set, cached per visible array */
    private visibleSets;
    private getVisibleSet;
    private getVisibleCanvasElements;
    private getRenderableElementsMap;
    private sortSelectedElementsIntoHighlightedFrame;
    private _getRenderableElements;
    getRenderableElements: (opts: GetRenderableElementsOpts) => {
        elementsMap: RenderableElementsMap;
        visibleElements: readonly NonDeletedExcalidrawElement[];
        newElementCanvasElement: (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "line" | "arrow";
            points: readonly import("@excalidraw/math").LocalPoint[];
            startBinding: import("@excalidraw/element/types").FixedPointBinding | null;
            endBinding: import("@excalidraw/element/types").FixedPointBinding | null;
            startArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            endArrowhead: import("@excalidraw/element/types").Arrowhead | null;
        }> & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "rectangle";
        } & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "stickynote";
            baseHeight: number;
        }> & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "diamond";
        } & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "ellipse";
        } & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "embeddable";
            scale: [number, number];
        }> & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "iframe";
            customData?: {
                generationData?: import("@excalidraw/element/types").MagicGenerationData;
            };
            scale: [number, number];
        }> & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "image";
            fileId: import("@excalidraw/element/types").FileId | null;
            status: "pending" | "saved" | "error";
            scale: [number, number];
            crop: import("@excalidraw/element/types").ImageCrop | null;
            customData?: {
                pdfPageViewProps?: {
                    left: number;
                    bottom: number;
                    right: number;
                    top: number;
                    rotate?: number;
                };
                doNotInvertSVGInDarkMode?: boolean;
                invertBitmapInDarkmode?: boolean;
            };
        }> & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "frame";
            name: string | null;
            frameRole?: "marker" | null;
            customData?: {
                frameColor?: {
                    fill: string;
                    stroke: string;
                    nameColor: string;
                };
            };
        } & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "magicframe";
            name: string | null;
            frameRole?: "marker" | null;
        } & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "text";
            fontSize: number;
            fontFamily: import("@excalidraw/element/types").FontFamilyValues;
            baseFontSize: number | null;
            text: string;
            rawText: string;
            textAlign: import("@excalidraw/element/types").TextAlign;
            verticalAlign: import("@excalidraw/element/types").VerticalAlign;
            containerId: import("@excalidraw/element/types").ExcalidrawTextContainer["id"] | null;
            originalText: string;
            autoResize: boolean;
            lineHeight: number & {
                _brand: "unitlessLineHeight";
            };
            labelPosition?: number | null;
        }> & {
            isDeleted: false;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            created: number | null;
            link: string | null;
            hasTextLink?: boolean;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "freedraw";
            points: readonly import("@excalidraw/math").LocalPoint[];
            pressures: readonly number[];
            simulatePressure: boolean;
            strokeOptions: import("@excalidraw/element/types").StrokeOptions;
        }> & {
            isDeleted: false;
        }) | null;
        canvasNonce: string;
    };
    destroy(staticCanvas: HTMLCanvasElement): void;
}
export {};
