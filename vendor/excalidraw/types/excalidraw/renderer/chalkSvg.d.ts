import type { ChalkLayer, DeviceRect } from "@excalidraw/element";
/**
 * Noise in the element's local units, tuned by eye against the canvas tile
 * (`.tmp/cp7/bb-export.cjs` renders both): grain of about 0.5-1 scene units.
 * Noise at or below `eraseFrom` keeps the chalk, at or above `eraseFull`
 * removes it, with partial erase between for the canvas's soft speckle.
 */
export declare const CHALK_SVG_NOISE: {
    readonly baseFrequency: 0.9;
    readonly numOctaves: 2;
    readonly eraseFrom: 0.4;
    readonly eraseFull: 0.63;
};
type ChalkedLayer = Exclude<ChalkLayer, "solid">;
export declare const getChalkSvgFilterId: (elementId: string, layer: ChalkLayer) => string;
export type ChalkSvgFilterOptions = Readonly<{
    id: string;
    layer: ChalkedLayer;
    seed: number;
    /** the element's paint box in its local units */
    bounds: DeviceRect;
    /** offset second pass (strokes only) */
    jitter: boolean;
}>;
export declare const createChalkSvgFilter: (doc: Document, options: ChalkSvgFilterOptions) => SVGFilterElement;
/**
 * The board texture as SVG turbulence, in the export's user units (scene
 * units at export scale 1), fitted against the shader board
 * (`blackboardShader.ts`) at zoom 1 by comparing their per-scale contrast.
 * Like the shader's smudges, it scales with the drawing and never repeats.
 * Gains are overlay alphas: white lightens, black darkens.
 */
export declare const BLACKBOARD_SVG_TEXTURE: {
    /** erased chalk: felt streaks (fine `across`, long `along`), lit where
     * the noise passes `from` */
    readonly streaks: {
        readonly across: 0.05;
        readonly along: 0.004;
        readonly numOctaves: 2;
        readonly slope: 2.5;
        readonly from: 0.45;
    };
    /** bends the streaks into eraser arcs: displacement up to `scale` units */
    readonly warp: {
        readonly baseFrequency: 0.0012;
        readonly scale: 200;
    };
    /** patches holding erased chalk: steep cut of coarse noise */
    readonly patch: {
        readonly baseFrequency: 0.003;
        readonly numOctaves: 2;
        readonly slope: 2;
        readonly from: 0;
    };
    /** strongest alpha of the erased chalk */
    readonly residue: 0.03;
};
/**
 * A filter for the export's background `<rect>` (filled with
 * `BLACKBOARD_BASE_COLOR`) that overlays the board texture: a flat slate
 * with erased chalk (felt streaks bent into arcs, in patches).
 * Headless: no canvas needed.
 */
export declare const createBlackboardSvgFilter: (doc: Document, id: string) => SVGFilterElement;
export type ChalkSvgGroupOptions = Readonly<{
    elementId: string;
    seed: number;
    bounds: DeviceRect;
    jitter: boolean;
}>;
/**
 * Wraps an element's nodes, sorted by chalk layer, in a `<g>` that paints
 * fill, stroke, then solid (the canvas order), each chalked layer through its
 * own filter. The caller sets the element's transform and opacity on the
 * returned group; the filters live in its user space.
 */
export declare const buildChalkSvgGroup: (doc: Document, options: ChalkSvgGroupOptions, layers: Readonly<Partial<Record<ChalkLayer, readonly Element[]>>>) => SVGGElement;
export {};
