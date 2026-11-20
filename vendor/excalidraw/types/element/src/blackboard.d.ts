import type { MarkdownPaintOp } from "./markdownTextRender";
import type { ExcalidrawElement } from "./types";
import type { Drawable } from "roughjs/bin/core";
/**
 * Paint layers of a chalked element. `fill` and `stroke` get grain of
 * different strength; `solid` is painted without grain (code runs).
 */
export type ChalkLayer = "fill" | "stroke" | "solid";
export declare const CHALK_LAYERS: readonly ChalkLayer[];
/** Fraction of the noise tile's erase alpha applied per grained layer. */
export declare const CHALK_LAYER_STRENGTH: Readonly<Record<Exclude<ChalkLayer, "solid">, number>>;
/** Opacity of the offset second pass that roughens chalk outlines. */
export declare const CHALK_JITTER_ALPHA = 0.35;
/** Noise tile edge in pixels (power of two). */
export declare const CHALK_TILE_SIZE = 128;
/**
 * Scene units one tile covers. Grain lives in scene space, so it scales with
 * zoom and stays put on the element as it moves.
 */
export declare const CHALK_TILE_SCENE_SIZE = 48;
/** Seed of the shared per-document tile; elements vary by tile offset. */
export declare const CHALK_TILE_SEED = 1667785068;
/**
 * The tile is erased twice, the second time rotated and at an
 * incommensurate scale, so large fills show no visible repeat. `strength`
 * multiplies the layer strength per pass.
 */
export declare const CHALK_GRAIN_PASSES: readonly Readonly<{
    scale: number;
    rotation: number;
    strength: number;
}>[];
export declare const isBlackboardRender: (theme: string, enabled: boolean) => boolean;
/**
 * Whether `element` is drawn as chalk in blackboard mode.
 *
 * - freedraw: always;
 * - rectangle, diamond, ellipse, line, arrow and regular frames: when
 *   sketchy (roughness ≥ artist) — architect stays solid ink;
 * - text: Excalifont only, except on sticky notes (chalk on paper);
 * - sticky notes, images, embeds, magic and marker frames: never.
 *
 * @param container the bound-text container of `element`, if any
 */
export declare const isChalkElement: (element: ExcalidrawElement, container: ExcalidrawElement | null) => boolean;
/**
 * Whether `element` keeps its light-theme colours in blackboard mode: a
 * sticky note is paper on the board, and so is the label written on it.
 *
 * @param container the bound-text container of `element`, if any
 */
export declare const isPaperRender: (element: ExcalidrawElement, container: ExcalidrawElement | null, theme: string, blackboardEnabled: boolean) => boolean;
/**
 * Whether the text editor paints its live preview canvas (and hides the
 * textarea's glyphs): always for a Markdown layout; for plain chalk text
 * only while the element's wrap matches the editor's value, since a stale
 * wrap would misplace the glyphs under the caret.
 */
export declare const shouldPaintLiveTextPreview: (options: Readonly<{
    markdownLayout: object | null;
    chalk: boolean;
    wrapMatches: boolean;
}>) => boolean;
/**
 * The part of a rough drawable that belongs to `layer`: outlines (`path`
 * sets) to `stroke`, hachure and solid fills to `fill`. Null when the layer
 * has nothing to draw.
 */
export declare const splitDrawableForChalk: (drawable: Drawable, layer: ChalkLayer) => Drawable | null;
/** The chalk layer a Markdown paint op belongs to. */
export declare const getMarkdownOpChalkLayer: (op: MarkdownPaintOp) => ChalkLayer;
/**
 * A seamless square tile of erase alpha (0 keeps the pixel, 255 erases it):
 * coarse blotches, finer grain and per-pixel speckle, thresholded so a chalk
 * stroke keeps most of its body with real holes in it.
 */
export declare const generateChalkNoise: (size: number, seed: number) => Uint8ClampedArray;
/**
 * The board's mean colour: the shader board (`blackboardShader.ts`) averages
 * to it. In blackboard mode it replaces the (dark-filtered) scene
 * background; only a transparent background still clears.
 */
export declare const BLACKBOARD_BASE_COLOR = "#0e100f";
/** Board texture tile edge in texels (power of two). */
export declare const BLACKBOARD_TILE_SIZE = 512;
/** Seed of the shared per-document board tile. */
export declare const BLACKBOARD_TILE_SEED = 1651466610;
/**
 * CSS px per texel: the zoom (one texel per scene unit), clamped so the
 * texture neither blows up into blotches nor shrinks into noise.
 */
export declare const BLACKBOARD_PATTERN_SCALE: Readonly<{
    min: 0.5;
    max: 2;
}>;
/**
 * A seamless board texture tile as an RGBA overlay for the flat
 * `BLACKBOARD_BASE_COLOR`: white lightens and black darkens by its alpha.
 * Layers:
 * - low-frequency mottling, ±`BOARD_MOTTLE`;
 * - eraser smears: noise stretched along x, its bands bent by a gentle
 *   periodic wave (a slight, varying slant), lighter by up to `BOARD_SMEAR`;
 * - sparse light specks of chalk dust.
 */
export declare const generateBlackboardTexture: (size: number, seed: number) => Uint8ClampedArray;
/**
 * Maps board-tile texels to the canvas's CSS px for the current view, so the
 * texture is anchored in scene space: it pans with the scene and scales with
 * the zoom (within `BLACKBOARD_PATTERN_SCALE`).
 */
export declare const getBlackboardPatternTransform: (view: Readonly<{
    scrollX: number;
    scrollY: number;
    zoom: number;
}>) => Affine;
/** Where in the shared tile `seed`'s grain starts, as a fraction of a tile. */
export declare const getChalkTileOffset: (seed: number) => {
    x: number;
    y: number;
};
/** Offset of the faint second pass over chalk outlines, in scene units. */
export declare const getChalkJitter: (seed: number) => {
    dx: number;
    dy: number;
};
export type Affine = Readonly<{
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
}>;
export type DeviceRect = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
}>;
/** `m · n`: applies `n` first, then `m`. */
export declare const multiplyAffine: (m: Affine, n: Affine) => Affine;
/**
 * Maps noise-tile pixels to device pixels for each grain pass, given the
 * layer's local-to-device transform `m`: the tile is anchored at the
 * element's origin, shifted by its seed offset, and covers
 * `CHALK_TILE_SCENE_SIZE` local units (× the pass scale).
 */
export declare const getChalkGrainTransforms: (m: Affine, seed: number) => {
    transform: Affine;
    strength: number;
}[];
export declare const invertAffine: (m: Affine) => Affine;
/** Integer device-pixel bounds covering `rect` (local units) under `m`. */
export declare const transformRectToDeviceBounds: (m: Affine, rect: DeviceRect) => DeviceRect;
export declare const intersectDeviceRects: (a: DeviceRect, b: DeviceRect) => DeviceRect | null;
