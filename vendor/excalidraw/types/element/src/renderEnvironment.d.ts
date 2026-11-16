/**
 * Host environment used by the renderer and export pipeline.
 *
 * The default is the browser's. An explicit environment (see
 * `StaticCanvasRenderConfig["renderEnvironment"]`) scopes canvas and image
 * creation to one render target -- e.g. the editor's owner window, so that
 * one process can host editors in multiple realms (popouts, multi-tenant
 * embeds), or an export running where `document`/`window` don't exist (Node
 * with `node-canvas` / `@napi-rs/canvas`, passed in `config.environment`).
 * There is deliberately no process-wide override: every render and export
 * takes its environment explicitly.
 *
 * `document` is the DOM side of the same host: what SVG exports are built in
 * (a DOM implementation such as `linkedom` under Node).
 */
import type { TextMetricsProvider } from "./textMeasurements";
export type RenderEnvironment = {
    /** Creates a blank canvas. Callers set `width`/`height` themselves. */
    createCanvas: () => HTMLCanvasElement;
    /**
     * Creates an image to be decoded from a data URL and later used as a
     * `drawImage` source.
     *
     * NOTE: typed as `HTMLImageElement` because the renderer is typed against
     * the DOM lib throughout. Non-DOM implementations (node-canvas et al) need
     * to cast; they must support `src`, `onload`, `onerror`, `naturalWidth`,
     * `naturalHeight` and be accepted by their canvas' `drawImage`.
     */
    createImage: () => HTMLImageElement;
    /**
     * Creates a fillable path from an SVG path string -- freedraw elements are
     * filled through one.
     *
     * Optional, because browsers always have the global `Path2D` this falls back
     * to. A Node host MUST supply it (e.g. `@napi-rs/canvas`'s `Path2D`) or
     * install `globalThis.Path2D` itself: Node has no such global, and without
     * one every freedraw element fails to render.
     */
    createPath?: (svgPath: string) => Path2D;
    /**
     * The document SVG exports are built in: the editor's owner document, or
     * outside the browser a DOM implementation's (e.g. `linkedom`).
     *
     * Optional; falls back to the global `document`.
     */
    document?: Document;
    /**
     * Measures text (line widths, for wrapping and layout).
     *
     * Optional; falls back to the global provider set with
     * `setCustomTextMetricsProvider`, else to measuring on a canvas from
     * `createCanvas`.
     */
    textMetrics?: TextMetricsProvider;
};
/**
 * Resolves the host environment for a render: the explicitly scoped one (e.g.
 * the editor's owner window, or an export's), else the browser default.
 */
export declare const getRenderEnvironment: (env?: RenderEnvironment) => RenderEnvironment;
/**
 * Resolves the path factory for a render. `createPath` is the one optional
 * member of the contract, so this fills in the global-`Path2D` default for
 * environments that omit it.
 */
export declare const getCreatePath: (env?: RenderEnvironment) => ((svgPath: string) => Path2D);
