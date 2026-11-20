/**
 * KuszCanvas: the blackboard board texture as a WebGL2 fragment shader.
 *
 * The board never repeats: every feature is hashed from integer lattice
 * cells anchored in scene space, so no tile exists to repeat. The board is
 * a flat slate lightened only by erased chalk (eraser strokes, steered by a
 * hidden mottle) and the odd scratch. Each layer is a ladder of octaves
 * whose cells are 2^k scene units wide. Scene-scaled layers (mottle,
 * strokes) keep their octaves at every zoom, so they grow and shrink with
 * the drawing; zoom-scaled ones (scratches) pick octaves by how large their
 * cells look on screen, so they read the same at every zoom.
 *
 * Large scene coordinates would lose float32 precision on the GPU, so the
 * lattice origin of each octave is split here, in float64, into an integer
 * cell and a fraction; the shader only adds small numbers to the fraction.
 *
 * Pure: no DOM, no WebGL calls. The runner lives in
 * `packages/excalidraw/renderer/blackboardShaderCanvas.ts`.
 */
export type BoardLayer = Readonly<{
    id: string;
    /** GLSL uniform name prefix */
    uniform: string;
    /**
     * "zoom": octaves follow the on-screen cell size, so zooming brings in
     * new ones and the layer looks the same at every zoom (fine texture).
     * "scene": octaves are fixed scene sizes that grow and shrink with the
     * zoom like drawn content (smudges); they fade out only once their cells
     * shrink below `BOARD_SCENE_FADE` CSS px.
     */
    scaling: "zoom" | "scene";
    /** cell size at full weight, [lo, lo·2^octaves]: CSS px for "zoom"
     * layers, scene units (CSS px at 100%) for "scene" layers */
    band: readonly [number, number];
    /** octaves in the band (log2(hi / lo), an integer) */
    octaves: number;
    /** uniform slots: every octave with non-zero weight ("zoom": band ± 1
     * octave; "scene": the band's octaves) */
    slots: number;
    /** amplitude at full weight, as a fraction of full brightness */
    gain: number;
    /** amplitude ∝ (cell size / lo)^slope: > 0 favours coarse octaves */
    slope: number;
    /** cell height / width before rotation (1 = isotropic) */
    aspect: number;
    /** largest |rotation| of an octave's lattice, radians (π = any) */
    tilt: number;
    seed: number;
}>;
/**
 * The board's layers. Gains are fractions of full brightness added to
 * `BOARD_SHADER_BASE`; the fragment shader draws and mixes them.
 */
export declare const BOARD_LAYERS: readonly BoardLayer[];
/** Board colour under the texture, sRGB 0..255: slate grey, barely green. */
export declare const BOARD_SHADER_BASE: readonly [12, 14, 13];
/** Per-channel response to the texture's lightness changes. */
export declare const BOARD_SHADER_TINT: readonly [1, 1.01, 0.99];
/**
 * Edge of the random noise texture the smooth layers sample, texels. Each
 * octave reads it at its own rotation and offset, so an octave repeats only
 * every `BOARD_NOISE_SIZE` cells (> 1,000 cells) and the
 * octaves never line up.
 */
export declare const BOARD_NOISE_SIZE = 1024;
/** Seed of the noise texture. */
export declare const BOARD_NOISE_SEED = 1802859386;
/**
 * Eraser strokes per smear cell: `perCell` tries, each drawn with chance
 * `density`.
 *
 * Cost: the board redraws on every pan frame and every try costs a hash
 * per haze pixel for each cell in reach, rejected or not. Benchmark the
 * frame on a weak GPU before raising `perCell`; more than ~1.2 strokes per
 * 256 px square also merges the bands into cloud.
 */
export declare const BOARD_SMEAR_STROKES: Readonly<{
    perCell: 2;
    density: 0.6;
}>;
/**
 * Eraser strokes run left-right: each stroke's axis sits within this many
 * radians of horizontal, and its bend turns it into an arc.
 */
export declare const BOARD_SMEAR_ANGLE_SPREAD = 0.4;
/**
 * Eraser stroke size in smear cells: half its length and half its width,
 * each drawn between the two. Wide for their length: a block eraser.
 */
export declare const BOARD_SMEAR_SHAPE: Readonly<{
    halfLength: readonly [0.55, 1];
    halfWidth: readonly [0.4, 0.6];
}>;
/**
 * Inside a stroke: a solid `fill` of erased chalk, shaded ± `texture` by
 * the felt's streaks, so each stroke reads as one band.
 */
export declare const BOARD_SMEAR_FELT: Readonly<{
    fill: 0.8;
    texture: 0.25;
}>;
/**
 * Furthest a stroke reaches from its centre along x and y, in smear cells:
 * its half-length, and its widest half-band plus the deepest bow, turned by
 * the widest angle. A pixel only looks at cells whose centres lie this
 * close, three or four a side.
 */
export declare const BOARD_SMEAR_REACH: Readonly<{
    x: number;
    y: number;
    across: number;
}>;
/** "scene" octaves fade out from this cell size (CSS px) down to half it. */
export declare const BOARD_SCENE_FADE = 4;
/**
 * Seeded random bytes for the noise texture: `size`² RGBA texels, four
 * independent uniform channels.
 */
export declare const generateBoardNoise: (size: number, seed: number) => Uint8Array;
export type BoardFrame = Readonly<{
    /** scene coordinates of the region's top-left device pixel */
    sceneX: number;
    sceneY: number;
    /** CSS px per scene unit */
    zoom: number;
    /** device px per CSS px */
    pixelRatio: number;
}>;
export type BoardLayerUniforms = Readonly<{
    /** per slot: lattice fraction x, y; weight; device px per cell */
    lattice: Float32Array;
    /** per slot: lattice units per device px, rows (m00, m01), (m10, m11) */
    matrix: Float32Array;
    /** per slot: lattice cell x, y (wrapping int32); seed; octave k */
    cell: Int32Array;
}>;
/**
 * Weight of an octave whose cells are `cellCss` CSS px on screen: 1 inside
 * the layer's band, easing to 0 one octave outside it. The ramps are
 * sin/cos in log2 space and the bands span whole octaves, so the summed
 * energy of a layer (Σ weight²) stays constant while zooming.
 */
export declare const getBoardBandWeight: (layer: BoardLayer, cellCss: number) => number;
/**
 * Per-slot uniforms of `layer` for a region whose top-left device pixel is
 * at (`frame.sceneX`, `frame.sceneY`). Slot `i` holds octave
 * `ceil(log2(lo / 2 / zoom)) + i` of a "zoom" layer (slots outside the band
 * get weight 0), or octave `log2(lo) + i` of a "scene" layer.
 */
export declare const getBoardLayerUniforms: (layer: BoardLayer, frame: BoardFrame) => BoardLayerUniforms;
/**
 * The frame of a region that starts `deviceX` × `deviceY` device px from the
 * top-left of a canvas showing `view`.
 */
export declare const getBoardRegionFrame: (view: Readonly<{
    scrollX: number;
    scrollY: number;
    zoom: number;
}>, pixelRatio: number, deviceX: number, deviceY: number) => BoardFrame;
export type BoardChunk = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
}>;
/** Splits a `width` × `height` px area into chunks of at most `limit` px. */
export declare const planBoardChunks: (width: number, height: number, limit: number) => BoardChunk[];
/** A full-screen triangle; no vertex buffers. */
export declare const BOARD_VERTEX_SHADER = "#version 300 es\nvoid main() {\n  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));\n  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);\n}\n";
/**
 * The haze pass (erased chalk, steered by the mottle) renders at
 * 1 / `BOARD_HAZE_DOWNSCALE` of the device resolution, with a one-texel
 * margin, and the board pass samples it bilinearly. Felt lines finer than
 * two texels fade out rather than alias.
 */
export declare const BOARD_HAZE_DOWNSCALE = 3;
/** Haze texture size for a region of `width` × `height` device px. */
export declare const getBoardHazeSize: (width: number, height: number) => Readonly<{
    width: number;
    height: number;
}>;
/** The layers each program draws. */
export declare const BOARD_HAZE_LAYERS: readonly BoardLayer[];
export declare const BOARD_DETAIL_LAYERS: readonly BoardLayer[];
/**
 * The haze pass: erased chalk (R) at
 * 1 / `BOARD_HAZE_DOWNSCALE` resolution. `uSize` is the haze texture's size; texel j (from the top)
 * covers device px (j − ½) × downscale.
 */
export declare const BOARD_HAZE_FRAGMENT_SHADER: string;
/**
 * The board pass. `p` is the device pixel from the region's top-left
 * (y down); each layer loops over its octave slots, skipping weight-0 ones.
 *
 * Smooth layers read `uNoise` (four random channels, bilinear, repeating)
 * at lattice coordinates wrapped to the texture: the integer cell is masked
 * to the texture size, so far scene coordinates lose no precision.
 * Scratches sit inside their own cell and read their random numbers from
 * `uNoise` too.
 */
export declare const BOARD_FRAGMENT_SHADER: string;
