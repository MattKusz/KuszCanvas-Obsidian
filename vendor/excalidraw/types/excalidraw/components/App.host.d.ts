import type { RenderEnvironment } from "@excalidraw/element";
import { type EyeDropperProperties } from "./EyeDropper";
import { type HyperlinkTooltipOwner } from "./hyperlink/Hyperlink";
import type { AppProps } from "../types";
import type App from "./App";
/**
 * Owns everything that ties this editor to the document/window it renders
 * into (cross-document runtime ownership): the render environment the
 * canvases, images and paths are minted from, and the state that has to be
 * re-primed whenever that environment is swapped.
 */
export declare class AppHost {
    private app;
    constructor(app: App);
    /**
     * Identity token for the hyperlink tooltip, which is a module-level
     * singleton shared by every editor in the process — the owner tells it
     * which editor the currently shown tooltip belongs to, so one editor never
     * hides (or leaks a timer into) another's tooltip.
     */
    readonly hyperlinkTooltipOwner: HyperlinkTooltipOwner;
    /**
     * The process-wide interaction slots this editor currently owns: the
     * pointerup handler of the interaction in flight, and the eye dropper (one
     * atom in the editor-wide store). Both hold closures over this editor, so a
     * teardown that leaves one set retains the editor -- and with it its owner
     * window and document, e.g. a closed popout.
     *
     * @see releaseOwnedInteractionState
     */
    private ownedPointerUp;
    private ownedEyeDropper;
    /** Takes over the pointerup slot (or clears it, on `null`). */
    setPointerUp(handler: (() => void) | null): void;
    /**
     * Runs the pending pointerup, whoever owns it -- pointerup does not always
     * fire (the user tabs away), so interactions are settled manually.
     */
    runPendingPointerUp(): void;
    /** Opens the eye dropper (or closes it, on `null`), taking ownership. */
    setActiveEyeDropper(eyeDropper: EyeDropperProperties | null): void;
    /**
     * Drops the ownership token without touching the atom -- for callers that
     * have just closed the eye dropper themselves.
     */
    releaseEyeDropperOwnership(): void;
    /**
     * Releases the process-wide slots this editor owns, so nothing outside it
     * keeps it alive once it is torn down. Ownership-checked: a sibling
     * editor's in-flight interaction must survive our teardown.
     */
    private releaseOwnedInteractionState;
    /**
     * Render environment scoped to this editor's owner window, so that the
     * canvases, images and paths created during rendering live in the owner
     * document. Memoized keyed on the resolved document because render caches
     * are keyed by environment identity: the identity must not survive a
     * document switch, or caches would mix canvases and images from two realms
     * under one bucket.
     */
    private _renderEnvironment;
    private _renderEnvironmentDocument;
    get renderEnvironment(): RenderEnvironment;
    /**
     * Re-primes whatever the render environment owns. Called on mount and on
     * every update, so an environment swap is picked up wherever it happens.
     */
    sync(prevProps?: AppProps): void;
    /**
     * Releases what this editor owns outside itself, so we don't retain the
     * (soon detached) document/window, or leave a pending tooltip timer around.
     */
    destroy(): void;
    private _destroyed;
    /**
     * Link icons decode asynchronously and the static scene skips an icon that
     * is not decoded yet, so start the decode on mount rather than on the
     * first render that happens to have a link, so the decode is settled long
     * before there is a link element to draw an icon for.
     *
     * Re-run on an environment swap: the images are keyed by env identity, so
     * a new environment starts with none.
     *
     * The decode landing only flips a status, which invalidates nothing, so the
     * scene is nudged once when an icon becomes drawable -- otherwise a scene
     * that paints before the decode settles and is then left alone (an initial
     * scene with links, never scrolled or edited) keeps its icons missing until
     * something unrelated repaints. Same shape as a font or an image file
     * landing: repaint only when there is something new to draw.
     */
    private _linkImgDecodingEnvironment;
    private ensureLinkImgDecoding;
    /**
     * Every render cache is keyed by environment identity, so a host passing an
     * inline `renderEnvironment` literal re-mints the identity on each render
     * and re-rasterizes everything, with no visible symptom other than being
     * slow. Detected by the factories' source being unchanged across the swap:
     * a genuine environment switch (e.g. a document change) reads differently.
     */
    private _warnedUnstableRenderEnvironment;
    private warnOnUnstableRenderEnvironment;
}
