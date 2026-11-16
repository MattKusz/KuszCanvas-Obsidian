import { MIME_TYPES } from "@excalidraw/common";
import type { RenderEnvironment } from "@excalidraw/element";
import type { ExcalidrawFrameLikeElement, NonDeleted, NonDeletedExcalidrawElement, Theme } from "@excalidraw/element/types";
import { cleanAppStateForExport } from "../appState";
import type { AppState, BinaryFiles } from "../types";
export type ExportSceneData = {
    elements: readonly NonDeletedExcalidrawElement[];
    /**
     * The scene settings a `.excalidraw` file stores (`viewBackgroundColor`,
     * grid settings) — not editor state. Used as the default background
     * (`canvasBackgroundColor`) and embedded with the scene (`embedScene`).
     * Anything else passed in is ignored; rendering options go to `config`.
     */
    appState?: ReturnType<typeof cleanAppStateForExport>;
    files?: BinaryFiles | null;
};
/**
 * The host capabilities an export uses, shared by every format: e.g. for test
 * environments, Node.js or another window.
 *
 * Unlike the editor's `renderEnvironment` prop, this needn't be the same
 * object across exports (e.g. on a server): exports draw without the element
 * caches keyed by an environment, and measure little text. Passing a complete
 * one (`createCanvas` and `createImage`) as-is, as the editor does, only keeps
 * its measuring caches warm.
 */
type ExportEnvironment = {
    /**
     * Creates the canvas a canvas/PNG/JPEG export renders into, and any canvas
     * the export measures text with (e.g. frame labels, embed placeholders).
     *
     * Do not set `canvas.width/height` or modify the canvas context as that's
     * handled by Excalidraw.
     *
     * Defaults to `document.createElement("canvas")`.
     */
    createCanvas?: RenderEnvironment["createCanvas"];
    /**
     * Creates the images that image elements are decoded into.
     *
     * Defaults to `new Image()`.
     */
    createImage?: RenderEnvironment["createImage"];
    /**
     * Creates the paths that freedraw elements are filled through.
     *
     * Defaults to the global `Path2D`.
     */
    createPath?: RenderEnvironment["createPath"];
    /**
     * The document an SVG export is built in, e.g. a popout window's or,
     * outside the browser, a DOM implementation's (such as `linkedom`).
     *
     * Defaults to the global `document`.
     */
    document?: RenderEnvironment["document"];
    /**
     * Measures text (frame labels, embed placeholders), e.g. where there is no
     * canvas to measure on.
     *
     * Defaults to the global provider set with `setCustomTextMetricsProvider`,
     * else to measuring on a canvas from `createCanvas`.
     */
    textMetrics?: RenderEnvironment["textMetrics"];
    /** Internal adapter hook; runs before drawing, preserving native canvas truncation. */
    configureCanvas?: (canvas: HTMLCanvasElement, width: number, height: number) => number;
    /**
     * Loads the fonts the exported elements use, before rendering.
     *
     * Defaults to loading them through the browser's
     * [FontFace API](https://developer.mozilla.org/en-US/docs/Web/API/FontFace).
     */
    loadFonts?: () => Promise<void>;
};
type ExportSceneBaseConfig = {
    frameColor?: AppState["frameColor"];
    /**
     * @default "light"
     */
    theme?: Theme;
    /**
     * Canvas background. Valid values are:
     *
     * - `undefined` - the background of "appState.viewBackgroundColor" is used.
     * - `false` - no background is used (transparent). Not supported for JPEG,
     *   which falls back to the default.
     * - `string` - should be a valid CSS color.
     *
     * Specified in light-theme terms: `theme: "dark"` transforms it like any
     * other scene color. Only affects the rendered image, not the embedded
     * scene (`embedScene`).
     *
     * @default undefined
     */
    canvasBackgroundColor?: string | false;
    /**
     * Canvas padding in pixels. Affected by `scale`.
     *
     * When `fit` is `none`, padding is added around the content bounding box,
     * or around the `width`/`height` frame if set — in which case the content
     * may overflow the frame, thus right or bottom padding may be ignored.
     *
     * When `fit` is `contain`, or `maxWidthOrHeight`/`widthOrHeight` is set,
     * padding is subtracted from the target size (so the export doesn't exceed
     * it, `scale` aside), and serves as a minimum distance between the content
     * and the canvas edges — it may be exceeded on one axis to maintain the
     * aspect ratio. It is recommended to set `position` to `center` when using
     * `fit: "contain"`.
     *
     * @default 10
     */
    padding?: number;
    /**
     * A multiplier to increase/decrease the frame dimensions
     * (content resolution).
     *
     * For example, if your canvas is 300x150 and you set scale to 2, the
     * resulting size will be 600x300.
     *
     * Can be a function, which receives the export dimensions at scale 1
     * (padding included) and returns the multiplier — e.g. to cap the output
     * by a pixel budget.
     *
     * @default 1
     */
    scale?: number | ((width: number, height: number) => number);
    /**
     * Host environment overrides, e.g. for test environments or Node.js.
     */
    environment?: ExportEnvironment;
    exportingFrame?: NonDeleted<ExcalidrawFrameLikeElement> | null;
    /**
     * Which frame decorations to render. Ignored when exporting a single frame
     * (`exportingFrame`), which renders neither its name nor outline, and clips
     * to it.
     *
     * @default { name: true, outline: true, clip: true }
     */
    frames?: {
        name?: boolean;
        outline?: boolean;
        clip?: boolean;
    };
};
/**
 * The ways to size the export — only one can be used. The positioning options
 * (`fit`, `position`, `x`, `y`, `origin`) belong to `width`/`height` (or no
 * size option).
 */
type ExportSizeOptions = {
    /**
     * Makes sure the canvas content fits into a frame of width/height no larger
     * than this value, while maintaining the aspect ratio.
     *
     * Final dimensions can get smaller/larger if used in conjunction with
     * `scale`.
     *
     * Can't be combined with `width`/`height`, `widthOrHeight`, or the
     * positioning options (`fit`, `position`, `x`, `y`, `origin`).
     */
    maxWidthOrHeight?: number;
    /**
     * Scale the canvas content to be exactly this many pixels wide/tall,
     * maintaining the aspect ratio.
     *
     * Final dimensions can get smaller/larger if used in conjunction with
     * `scale`.
     *
     * Can't be combined with `width`/`height`, `maxWidthOrHeight`, or the
     * positioning options (`fit`, `position`, `x`, `y`, `origin`).
     */
    widthOrHeight?: number;
    /**
     * Width of the frame. Supply `x` or `y` if you want to offset the canvas
     * content.
     *
     * If `width` omitted but `height` supplied, `width` is calculated from the
     * content's aspect ratio when `fit` is `contain` (the default), or is the
     * content bounding box width when `fit` is `none`.
     *
     * Defaults to the content bounding box width when both `width` and `height`
     * are omitted.
     *
     * Can't be combined with `maxWidthOrHeight` or `widthOrHeight`.
     */
    width?: number;
    /**
     * Height of the frame.
     *
     * If `height` omitted but `width` supplied, `height` is calculated from the
     * content's aspect ratio when `fit` is `contain` (the default), or is the
     * content bounding box height when `fit` is `none`.
     *
     * Defaults to the content bounding box height when both `width` and `height`
     * are omitted.
     *
     * Can't be combined with `maxWidthOrHeight` or `widthOrHeight`.
     */
    height?: number;
    /**
     * Left edge of the exported region (`padding` is added around it). By
     * default the coordinate is relative to the canvas. You can switch to
     * content coordinates by setting `origin` to `content`.
     *
     * Defaults to the `x` position of the content bounding box.
     *
     * Can't be combined with `maxWidthOrHeight` or `widthOrHeight`, and is
     * ignored with `fit: "contain"`, so setting `x` or `y` makes `fit` default
     * to `none` (cropping the region).
     */
    x?: number;
    /**
     * Top edge of the exported region (`padding` is added around it). By
     * default the coordinate is relative to the canvas. You can switch to
     * content coordinates by setting `origin` to `content`.
     *
     * Defaults to the `y` position of the content bounding box.
     *
     * Can't be combined with `maxWidthOrHeight` or `widthOrHeight`, and is
     * ignored with `fit: "contain"`, so setting `x` or `y` makes `fit` default
     * to `none` (cropping the region).
     */
    y?: number;
    /**
     * Indicates the coordinate system of the `x` and `y` values.
     *
     * - `canvas` - `x` and `y` are relative to the canvas [0, 0] position.
     * - `content` - `x` and `y` are relative to the content bounding box.
     *
     * Can't be combined with `maxWidthOrHeight` or `widthOrHeight`.
     *
     * @default "canvas"
     */
    origin?: "canvas" | "content";
    /**
     * How the content should be scaled into the `width`/`height` frame.
     *
     * Behavior aligns with the `object-fit` CSS property.
     *
     * - `none`    - no scaling.
     * - `contain` - scale to fit the frame. Includes `padding`.
     *
     * Can't be combined with `maxWidthOrHeight` or `widthOrHeight`.
     *
     * @default "contain" if `width` or `height` is set (and `x`/`y` aren't),
     * otherwise "none"
     */
    fit?: "none" | "contain";
    /**
     * When either `x` or `y` are not specified, indicates how the canvas should
     * be aligned on the respective axis.
     *
     * - `topLeft` - canvas aligned to top left.
     * - `center`  - canvas is centered on the axis which is not specified
     *               (or both).
     *
     * Can't be combined with `maxWidthOrHeight` or `widthOrHeight`.
     *
     * @default "center"
     */
    position?: "center" | "topLeft";
};
type ExportSizeOption<K extends keyof ExportSizeOptions> = Pick<ExportSizeOptions, K> & {
    [P in keyof ExportSizeOptions as P extends K ? never : P]?: never;
};
type ExportSizeConfig = ExportSizeOption<"width" | "height" | "fit" | "position" | "x" | "y" | "origin"> | ExportSizeOption<"maxWidthOrHeight"> | ExportSizeOption<"widthOrHeight">;
export type ExportSceneConfig = ExportSceneBaseConfig & ExportSizeConfig;
/**
 * The export config the editor's export settings translate to. Internal: hosts
 * pass their own config.
 */
export declare const getExportConfigFromAppState: (appState: Pick<AppState, "exportWithDarkMode" | "exportBackground" | "viewBackgroundColor" | "exportScale" | "frameRendering" | "frameColor">) => {
    theme: "light" | "dark";
    canvasBackgroundColor: string | false;
    scale: number;
    frameColor: {
        stroke: string;
        fill: string;
        nameColor: string;
    };
    frames: {
        enabled: boolean;
        name: boolean;
        outline: boolean;
        clip: boolean;
        markerName: boolean;
        markerEnabled: boolean;
    } | {
        name: boolean;
        outline: boolean;
        clip: boolean;
    };
};
type ExportToSvgConfig = Pick<ExportSceneBaseConfig, "canvasBackgroundColor" | "padding" | "theme" | "exportingFrame" | "scale" | "frames" | "frameColor" | "environment"> & ExportSizeConfig & {
    /**
     * if true, all embeddables passed in will be rendered when possible.
     */
    renderEmbeddables?: boolean;
    skipInliningFonts?: true;
    reuseImages?: boolean;
    /**
     * Embeds the scene into the SVG, so that it can be imported back into
     * Excalidraw.
     */
    embedScene?: boolean;
};
export declare const encodeSvgBase64Payload: ({ payload, metadataElement, }: {
    payload: string;
    metadataElement: SVGMetadataElement;
}) => void;
export declare const decodeSvgBase64Payload: ({ svg }: {
    svg: string;
}) => string;
export { MIME_TYPES };
type ExportToPngConfig = ExportSceneConfig & {
    /**
     * Embeds the scene into the PNG metadata, so that it can be imported back
     * into Excalidraw.
     */
    embedScene?: boolean;
};
type ExportToJpegConfig = ExportSceneConfig & {
    /**
     * Encoding quality between 0 and 1.
     *
     * @default 0.92
     */
    quality?: number;
};
export type ExportSceneOptions = {
    data: ExportSceneData;
} & ({
    type: "canvas";
    config?: ExportSceneConfig;
} | {
    type: "png";
    config?: ExportToPngConfig;
} | {
    type: "jpeg";
    config?: ExportToJpegConfig;
} | {
    type: "svg";
    config?: ExportToSvgConfig;
});
/**
 * Exports the scene to a canvas, a PNG or JPEG blob, or an SVG element.
 */
export declare function exportScene(opts: Extract<ExportSceneOptions, {
    type: "canvas";
}>): Promise<HTMLCanvasElement>;
export declare function exportScene(opts: Extract<ExportSceneOptions, {
    type: "png" | "jpeg";
}>): Promise<Blob>;
export declare function exportScene(opts: Extract<ExportSceneOptions, {
    type: "svg";
}>): Promise<SVGSVGElement>;
export declare function exportScene(opts: ExportSceneOptions): Promise<HTMLCanvasElement | Blob | SVGSVGElement>;
export declare const exportToClipboard: (opts: {
    data: ExportSceneData;
} & ({
    type: "png";
    config?: ExportToPngConfig;
} | {
    type: "svg";
    config?: ExportToSvgConfig;
} | {
    type: "json";
    config?: never;
})) => Promise<void>;
