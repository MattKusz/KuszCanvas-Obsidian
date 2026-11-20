import type { Radians } from "@excalidraw/math";
import type { RenderEnvironment } from "./renderEnvironment";
import type { Scene } from "./Scene";
import type { VerticalResizeAnchor } from "./sizeHelpers";
import type { TransformHandleDirection } from "./transformHandles";
import type { ElementsMap, ExcalidrawElement, ExcalidrawStickyNoteElement, ExcalidrawTextElement, NonDeletedExcalidrawElement } from "./types";
export type StickyNoteRenderPoint = {
    x: number;
    y: number;
};
export type StickyNotePathCommand = {
    type: "move";
    point: StickyNoteRenderPoint;
} | {
    type: "line";
    point: StickyNoteRenderPoint;
} | {
    type: "quadratic";
    control: StickyNoteRenderPoint;
    point: StickyNoteRenderPoint;
};
/** largest tilt a sticky note gets when it is placed with the tool: 1.5° */
export declare const STICKY_NOTE_MAX_TILT: Radians;
/**
 * Bounds of the per-note, seed-derived look. All render-only: none of these
 * is stored on the element.
 */
export declare const STICKY_NOTE_VARIATION_LIMITS: {
    /** ± degrees of hue rotation of the paper color */
    readonly hueShift: 3;
    /** ± HSL lightness (fraction of 1) added to the paper color */
    readonly lightnessShift: 0.04;
    /** multiplier range of the curl lift */
    readonly curlDepth: readonly [0.5, 1];
    /** ± px sideways offset of the drop shadow */
    readonly shadowOffsetX: 1.5;
    /** px downward offset range of the drop shadow's bottom edge */
    readonly shadowOffsetY: readonly [2.5, 4.5];
};
export type StickyNoteVariation = {
    hueShift: number;
    lightnessShift: number;
    /** which bottom corners lift off the board */
    curl: "left" | "right" | "both";
    curlDepth: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    /** 0–1 share of the roughness jitter the edges bow by */
    edgeWaviness: number;
};
export declare const normalizeStickyNoteStrokeColor: (strokeColor: string | null | undefined) => string;
export declare const normalizeStickyNoteBackgroundColor: (backgroundColor: string | null | undefined) => string;
/**
 * The update that applies a picked color to an element under the sticky
 * note policy: a note is always filled and its label — the visible text,
 * which the note's own `strokeColor` seeds — never goes transparent. Every
 * color surface (actions, both eyedroppers, paste styles, bind) routes
 * through this instead of re-deriving the rule.
 */
/**
 * The element a color pick on `element` lands on. A note's label has no fill
 * of its own, so a background pick on the label — the styles panel while
 * editing it — goes to the note; everything else colors itself.
 */
export declare const getColorTargetElement: (element: ExcalidrawElement, property: "strokeColor" | "backgroundColor", elementsMap: ElementsMap) => ExcalidrawElement;
export declare const getColorUpdate: (element: ExcalidrawElement, property: "strokeColor" | "backgroundColor", color: string, elementsMap: ElementsMap) => {
    strokeColor: string;
} | {
    backgroundColor: string;
};
/**
 * A note's ink is one color: the container's `strokeColor` — the seed for a
 * new label and what the creation-date footer paints with — and its label's.
 * Run after a property write to copy the side that changed onto the other;
 * when both changed, or neither (data that drifted), the label wins: it is
 * the text the user styled. A transparent label always takes the note's
 * color. Returns the same array when nothing needs to change.
 */
export declare const syncStickyNoteInk: <T extends ExcalidrawElement>(elements: readonly T[], prevElementsMap: ElementsMap) => readonly T[];
/**
 * The note's individual look, derived from its seed alone: the same seed
 * renders the same on canvas and in SVG, across redraws and clients.
 */
export declare const getStickyNoteVariation: (seed: number) => StickyNoteVariation;
/**
 * The tilt a note gets when the user places it with the sticky-note tool:
 * within ±`STICKY_NOTE_MAX_TILT`, normalised to [0, 2π). Seed-derived so a
 * test (or a replayed creation) gets the same angle.
 */
export declare const getStickyNoteCreationAngle: (seed: number) => Radians;
/** the paper color as painted: the stored color, tone-shifted per note */
export declare const getStickyNoteFillColor: (element: ExcalidrawStickyNoteElement) => string;
export declare const getStickyNoteCornerRadius: (element: ExcalidrawStickyNoteElement) => number;
/** the paper's four corners (TL, TR, BR, BL), jittered by sloppiness */
export declare const getStickyNoteRenderPoints: (element: ExcalidrawStickyNoteElement) => StickyNoteRenderPoint[];
/** the paper's outline in element-local coordinates */
export declare const getStickyNotePathCommands: (element: ExcalidrawStickyNoteElement) => StickyNotePathCommand[];
export type StickyNoteShadow = {
    /** outline of the shadow-casting shape, element-local, before blurring */
    commands: StickyNotePathCommand[];
    /**
     * canvas `shadowBlur` (≈ 2σ) in element px; SVG takes half of it as the
     * Gaussian `stdDeviation`
     */
    blur: number;
    opacity: number;
};
/**
 * The soft drop shadow: the paper's outline dropped further at the bottom
 * than the top, and further still under a curled corner.
 */
export declare const getStickyNoteShadow: (element: ExcalidrawStickyNoteElement) => StickyNoteShadow;
/**
 * Upper bound, in element px, of how far the painted note (blurred shadow and
 * jittered paper) reaches outside its width × height box. Analytic — no path
 * is built — since the cached element canvas asks for it on every frame.
 */
export declare const getStickyNoteShadowExtent: (element: ExcalidrawStickyNoteElement) => number;
export declare const normalizeStickyNoteFontSize: (fontSize: number) => number;
/** whether the text element is the label of a sticky note */
export declare const isStickyNoteBoundText: (textElement: ExcalidrawTextElement, elementsMap: ElementsMap) => boolean;
/**
 * The font size the user picked: the ceiling the auto-fit shrinks from for a
 * sticky note label, plain `fontSize` for any other text.
 *
 * Container-aware on purpose — generic binding repair (duplication, history)
 * rewrites `containerId` without touching the ceiling, so a numeric
 * `baseFontSize` alone does not prove the text is still sticky-bound.
 */
export declare const getBaseFontSize: (textElement: ExcalidrawTextElement, elementsMap: ElementsMap) => number;
/** the update that applies a user-picked font size (see `getBaseFontSize`) */
export declare const getBaseFontSizeUpdate: (textElement: ExcalidrawTextElement, fontSize: number, elementsMap: ElementsMap) => {
    fontSize: number;
} | {
    baseFontSize: number;
};
/**
 * The creation-date label: absolute, so painting needs no clock and exports
 * don't go stale, and short ("7 Sep") while the year is the current one.
 * `null` when the note has no usable timestamp (files restored without one).
 * Fixed English in the viewer's local time zone — the element package has no
 * locale, and the footer is chosen by width bucket rather than measured.
 */
export declare const getStickyNoteDateLabel: (created: ExcalidrawStickyNoteElement["created"], { short, now }?: {
    short?: boolean;
    now?: number;
}) => string | null;
/**
 * What the footer paints and where, in note-local coordinates — shared by the
 * canvas and SVG renderers, which take the font and opacity from
 * `STICKY_NOTE_FOOTER`. `null` for the 0×0 creation draft and anything under
 * the data floor, where the band would overlap the top padding.
 */
export declare const getStickyNoteFooter: (element: Pick<ExcalidrawStickyNoteElement, "created" | "width" | "height">, now?: number) => {
    text: string;
    x: number;
    y: number;
} | null;
/**
 * The smallest note the UI lets a user create or resize to: one line at the
 * label's font ceiling plus padding (and, vertically, the footer), never below
 * `STICKY_NOTE_MIN_SIZE`. Without the font term a fresh note would grow on
 * the very first keystroke. Data-level passes (restore, action post-passes)
 * only enforce the constant floor — the layout grows a note as needed.
 */
export declare const getStickyNoteMinSize: ({ fontSize, fontFamily, }: Pick<ExcalidrawTextElement, "fontSize" | "fontFamily">) => {
    width: number;
    height: number;
};
export type StickyNoteLayoutAnchor = VerticalResizeAnchor;
export type StickyNoteLayoutOpts = {
    /** unwrapped text to lay out; defaults to the label's `originalText` */
    originalText?: string;
    /**
     * absolute base-height intent — the gesture-start value to preserve, or the
     * height a resize asked for. Omitted = keep the note's live `baseHeight`
     * (typing, style changes, restore).
     */
    baseHeight?: number;
    /**
     * absolute font-ceiling intent (a proportional resize passes
     * `gesture-start ceiling × scale`). Omitted = keep the label's live ceiling.
     * Never a multiplier on the live value — that compounds across pointer-moves.
     */
    baseFontSize?: number;
    /** the edge that stays put when the content correction changes the height */
    anchor?: StickyNoteLayoutAnchor;
    /**
     * the host whose text metrics the fit measures with; omitted = the global
     * environment. An editor passes its own so a note laid out in one window
     * (or headlessly) is measured with that realm's fonts and canvas.
     */
    renderEnvironment?: RenderEnvironment;
};
export type StickyNoteLayout = {
    container: Pick<ExcalidrawStickyNoteElement, "x" | "y" | "width" | "height" | "baseHeight">;
    text: Pick<ExcalidrawTextElement, "text" | "fontSize" | "baseFontSize" | "width" | "height" | "x" | "y" | "angle"> | null;
};
/**
 * The single source of truth for a sticky note's geometry: wraps the label at
 * the note's width, fits the font under the ceiling, grows the note past
 * `baseHeight` only when the text still overflows at the minimum size, and
 * positions the label inside. Pure — returns the updates for both elements.
 */
export declare const getStickyNoteLayout: (container: ExcalidrawStickyNoteElement, textElement: ExcalidrawTextElement | null, opts?: StickyNoteLayoutOpts) => StickyNoteLayout;
/**
 * Resize intents for a sticky note — the §3.3 matrix of the plan. Every value
 * is absolute and derived from the gesture-start snapshot on each pointer-move,
 * so releasing Shift (or Alt) mid-gesture restores the original base height
 * and ceiling instead of keeping values a previous move scaled.
 *
 * - width-only gestures (free E/W, Stats W) preserve the base height
 * - height-changing gestures use the requested height as the new base
 * - proportional gestures (Shift on any handle, aspect-locked multi-select,
 *   Stats group) additionally scale the font ceiling with the note
 * - flips preserve everything
 * - the content correction anchors at the edge the gesture holds still
 */
export declare const getStickyNoteResizeIntent: (
/** the note with the requested geometry already applied */
container: ExcalidrawStickyNoteElement, originalElementsMap: ElementsMap, handleDirection: TransformHandleDirection, { proportional, fromCenter, flip, }: {
    proportional: boolean;
    fromCenter: boolean;
    flip?: boolean;
}) => Pick<StickyNoteLayoutOpts, "baseHeight" | "baseFontSize" | "anchor">;
/**
 * Applies `getStickyNoteLayout` to a live scene, then runs the bound-arrow
 * pass unless the caller already owns one (`bindings: false`) or needs to
 * forward its context (`bindings: { simultaneouslyUpdated }` — arrows resized
 * in the same gesture must not be moved by the pass, `updateBoundElements`
 * skips them only when told).
 */
export declare const updateStickyNoteLayout: (container: ExcalidrawStickyNoteElement, scene: Scene, { text, bindings, ...layoutOpts }?: StickyNoteLayoutOpts & {
    /** the label to lay out when it is an uncommitted clone (font actions clone before install) */
    text?: ExcalidrawTextElement | null;
    bindings?: {
        simultaneouslyUpdated?: readonly NonDeletedExcalidrawElement[];
    } | false;
}) => StickyNoteLayout;
/**
 * Applies `getStickyNoteLayout` inside an immutable elements array (property
 * actions, paste styles, restore): the notes among `affectedIds` — or the
 * notes whose labels are — get both halves merged into their clones. Elements
 * that need no change keep their identity and version; when `prevElementsMap`
 * is given, notes whose layout inputs did not change skip the fit entirely.
 * Bound arrows are the caller's job once the result is installed.
 */
export declare const relayoutStickyNotes: <T extends ExcalidrawElement>(elements: readonly T[], affectedIds: ReadonlySet<ExcalidrawElement["id"]>, opts?: {
    prevElementsMap?: ElementsMap;
    renderEnvironment?: RenderEnvironment;
}) => readonly T[];
