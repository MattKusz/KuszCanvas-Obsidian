import React from "react";
import { AppEventBus, type EXPORT_IMAGE_TYPES, Emitter, type EditorInterface, type StylesPanelMode } from "@excalidraw/common";
import { LinearElementEditor, Scene, Store, type ElementUpdate, StoreDelta, type ApplyToOptions } from "@excalidraw/element";
import type { ExcalidrawElement, ExcalidrawLinearElement, NonDeleted, FileId, NonDeletedExcalidrawElement, ExcalidrawTextElement, // zsviczian -- double-click edit guard retains the existing text type
ExcalidrawFrameLikeElement, ExcalidrawIframeElement, ExcalidrawEmbeddableElement, Ordered, SceneElementsMap } from "@excalidraw/element/types";
import type { RenderEnvironment, TransformHandleDirection } from "@excalidraw/element";
import type { Mutable } from "@excalidraw/common/utility-types";
import { ActionManager } from "../actions/manager";
import { History } from "../history";
import { Fonts } from "../fonts";
import { type WritableAtom } from "../editor-jotai";
import { Renderer } from "../scene/Renderer";
import { type SetViewportOptions } from "../viewport";
import { LaserTrails } from "../laserTrails";
import { isOverScrollBars } from "../scene/scrollbars";
import { LassoTrail } from "../lasso";
import { EraserTrail } from "../eraser";
import { AppArrowText } from "./App.arrowText";
import { AppClipboard } from "./App.clipboard";
import { AppText } from "./App.text";
import { AppTextTool } from "./App.textTool";
import { AppBucketFill } from "./App.bucketFill";
import { AppToolDrag } from "./App.toolDrag";
import { AppCursor } from "./App.cursor";
import { AppDrawShape } from "./App.drawshape";
import { AppDuplicate } from "./App.duplicate";
import { AppFlowchart } from "./App.flowchart";
import { AppModifiers } from "./App.modifiers";
import { AppPan } from "./App.pan";
import { AppViewport } from "./App.viewport";
import { AppWheel } from "./App.wheel";
import { AppSelection } from "./App.selection";
import { AppSelectionTool } from "./App.selectionTool";
import { AppWrap } from "./App.wrap";
import { AppHost } from "./App.host";
import { CursorHints } from "./CursorHint";
import { type OnStateChange } from "./AppStateObserver";
import type { ExportedElements } from "../data";
import type { AppClassProperties, AppProps, AppState, ElementRenderOverrides, ExcalidrawImperativeAPI, BinaryFiles, LibraryItems, PointerDownState, SceneData, FrameNameBoundsCache, SidebarName, SidebarTabName, KeyboardModifiersObject, ToolType, OnUserFollowedPayload, ExcalidrawImperativeAPIEventMap, GenerateDiagramToCode, NullableGridSize, UIConfig } from "../types";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { ActionResult } from "../actions/types";
declare const editorLifecycleEventBehavior: {
    readonly "editor:mount": {
        readonly cardinality: "once";
        readonly replay: "last";
    };
    readonly "editor:initialize": {
        readonly cardinality: "once";
        readonly replay: "last";
    };
    readonly "editor:unmount": {
        readonly cardinality: "once";
        readonly replay: "last";
    };
};
export declare const ExcalidrawContainerContext: React.Context<{
    container: HTMLDivElement | null;
    id: string | null;
}>;
export declare const ExcalidrawAPIContext: React.Context<ExcalidrawImperativeAPI | null>;
export declare const ExcalidrawAPISetContext: React.Context<((api: ExcalidrawImperativeAPI | null) => void) | null>;
export declare const useApp: () => AppClassProperties;
export declare const useAppProps: () => AppProps;
export declare const useEditorInterface: () => Readonly<{
    formFactor: "phone" | "tablet" | "desktop";
    desktopUIMode: StylesPanelMode;
    userAgent: Readonly<{
        isMobileDevice: boolean;
        platform: "ios" | "android" | "other" | "unknown";
    }>;
    isTouchScreen: boolean;
    canFitSidebar: boolean;
    isLandscape: boolean;
}>;
export declare const useStylesPanelMode: () => StylesPanelMode;
export declare const useExcalidrawContainer: () => {
    container: HTMLDivElement | null;
    id: string | null;
};
export declare const useExcalidrawElements: () => readonly NonDeletedExcalidrawElement[];
export declare const useExcalidrawAppState: () => AppState;
export declare const useExcalidrawSetAppState: () => <K extends keyof AppState>(state: AppState | ((prevState: Readonly<AppState>, props: Readonly<any>) => AppState | Pick<AppState, K> | null) | Pick<AppState, K> | null, callback?: (() => void) | undefined) => void;
export declare const useExcalidrawActionManager: () => ActionManager;
/**
 * Requires wrapping your component in <ExcalidrawAPIContext.Provider>
 */
export declare const useExcalidrawAPI: () => ExcalidrawImperativeAPI | null;
declare class App extends React.Component<AppProps, AppState> {
    canvas: AppClassProperties["canvas"];
    interactiveCanvas: AppClassProperties["interactiveCanvas"];
    sessionExportThemeOverride: AppState["theme"] | undefined;
    rc: RoughCanvas;
    unmounted: boolean;
    actionManager: ActionManager;
    editorInterface: EditorInterface;
    private stylesPanelMode;
    private excalidrawContainerRef;
    private zenModeTransitionTimer;
    get ownerDocument(): Document;
    get ownerWindow(): Window & typeof globalThis;
    /**
     * Everything binding this editor to the document/window it renders into
     * (render environment, hyperlink tooltip ownership). Delegated to so the
     * cross-document ownership rules live in one place.
     */
    host: AppHost;
    /** @see AppHost.renderEnvironment */
    get renderEnvironment(): RenderEnvironment;
    scene: Scene;
    fonts: Fonts;
    renderer: Renderer;
    visibleElements: readonly NonDeletedExcalidrawElement[];
    /** whether the last render had any renderable elements (excludes e.g. the
     * in-progress `newElement` and the edited text element) */
    private hasRenderableElements;
    private resizeObserver;
    library: AppClassProperties["library"];
    libraryItemsFromStorage: LibraryItems | undefined;
    id: string;
    store: Store;
    private history;
    private shouldRenderAllEmbeddables;
    excalidrawContainerValue: {
        container: HTMLDivElement | null;
        id: string;
    };
    files: BinaryFiles;
    imageCache: AppClassProperties["imageCache"];
    private iFrameRefs;
    /**
     * Indicates whether the embeddable's url has been validated for rendering.
     * If value not set, indicates that the validation is pending.
     * Initially or on url change the flag is not reset so that we can guarantee
     * the validation came from a trusted source (the editor).
     **/
    private embedsValidationStatus;
    /** embeds that have been inserted to DOM (as a perf optim, we don't want to
     * insert to DOM before user initially scrolls to them) */
    private initializedEmbeds;
    private elementsPendingErasure;
    private _initialized;
    private readonly editorLifecycleEvents;
    onEvent: AppEventBus<ExcalidrawImperativeAPIEventMap, typeof editorLifecycleEventBehavior>["on"];
    private appStateObserver;
    onStateChange: OnStateChange;
    bucketFill: AppBucketFill;
    duplicate: AppDuplicate;
    toolDrag: AppToolDrag;
    flowchart: AppFlowchart;
    cursor: AppCursor;
    arrowText: AppArrowText;
    pan: AppPan;
    textTool: AppTextTool;
    clipboard: AppClipboard;
    text: AppText;
    viewport: AppViewport;
    wheel: AppWheel;
    selection: AppSelection;
    selectionTool: AppSelectionTool;
    wrap: AppWrap;
    bindModeHandler: ReturnType<typeof setTimeout> | null;
    hitLinkElement?: NonDeletedExcalidrawElement;
    lastPointerDownEvent: React.PointerEvent<HTMLElement> | null;
    /**
     * the handle of the resize in progress while `state.isResizing` — for UI
     * that words itself by handle (a sticky note's corners resize
     * proportionally, its edges freely); not app state, so it costs no
     * re-render of its own
     */
    activeResizeHandle: TransformHandleDirection | null;
    lastPointerUpEvent: React.PointerEvent<HTMLElement> | PointerEvent | null;
    lastPointerUpIsDoubleClick: boolean;
    lastPointerMoveEvent: PointerEvent | null;
    /** current frame pointer cords */
    lastPointerMoveCoords: {
        x: number;
        y: number;
    } | null;
    private lastCompletedCanvasClicks;
    allowMobileMode: boolean;
    drawShape: AppDrawShape;
    laserTrails: LaserTrails;
    eraserTrail: EraserTrail;
    lassoTrail: LassoTrail;
    cursorHints: CursorHints;
    onChangeEmitter: Emitter<[elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles]>;
    onPointerDownEmitter: Emitter<[activeTool: {
        lastActiveTool: import("../types").ActiveTool | null;
        locked: boolean;
        fromSelection: boolean;
    } & import("../types").ActiveTool, pointerDownState: Readonly<{
        origin: Readonly<{
            x: number;
            y: number;
        }>;
        originInGrid: Readonly<{
            x: number;
            y: number;
        }>;
        scrollbars: ReturnType<typeof isOverScrollBars>;
        lastCoords: {
            x: number;
            y: number;
        };
        originalElements: Map<string, NonDeleted<ExcalidrawElement>>;
        resize: {
            handleType: import("@excalidraw/element").MaybeTransformHandleType;
            isResizing: boolean;
            offset: {
                x: number;
                y: number;
            };
            arrowDirection: "origin" | "end";
            center: {
                x: number;
                y: number;
            };
        };
        hit: {
            element: NonDeleted<ExcalidrawElement> | null;
            allHitElements: NonDeleted<ExcalidrawElement>[];
            wasAddedToSelection: boolean;
            cycleTarget: NonDeleted<ExcalidrawElement> | null;
            hasBeenDuplicated: boolean;
            advancedListMarkers: readonly import("@excalidraw/element").ListMarkerAdvance[];
            editedTextId: ExcalidrawTextElement["id"] | null;
            hasHitCommonBoundingBoxOfSelectedElements: boolean;
            arrowLabel: boolean;
        };
        withCmdOrCtrl: boolean;
        drag: {
            hasOccurred: boolean;
            offset: {
                x: number;
                y: number;
            } | null;
            origin: {
                x: number;
                y: number;
            };
            lastOffset: {
                x: number;
                y: number;
            };
            blockDragging: boolean;
        };
        eventListeners: {
            onMove: null | ReturnType<typeof import("@excalidraw/common").throttleRAF>;
            onUp: null | ((event: PointerEvent) => void);
            onKeyDown: null | ((event: KeyboardEvent) => void);
            onKeyUp: null | ((event: KeyboardEvent) => void);
        };
        boxSelection: {
            hasOccurred: boolean;
        };
    }>, event: React.PointerEvent<HTMLElement>]>;
    onPointerUpEmitter: Emitter<[activeTool: {
        lastActiveTool: import("../types").ActiveTool | null;
        locked: boolean;
        fromSelection: boolean;
    } & import("../types").ActiveTool, pointerDownState: Readonly<{
        origin: Readonly<{
            x: number;
            y: number;
        }>;
        originInGrid: Readonly<{
            x: number;
            y: number;
        }>;
        scrollbars: ReturnType<typeof isOverScrollBars>;
        lastCoords: {
            x: number;
            y: number;
        };
        originalElements: Map<string, NonDeleted<ExcalidrawElement>>;
        resize: {
            handleType: import("@excalidraw/element").MaybeTransformHandleType;
            isResizing: boolean;
            offset: {
                x: number;
                y: number;
            };
            arrowDirection: "origin" | "end";
            center: {
                x: number;
                y: number;
            };
        };
        hit: {
            element: NonDeleted<ExcalidrawElement> | null;
            allHitElements: NonDeleted<ExcalidrawElement>[];
            wasAddedToSelection: boolean;
            cycleTarget: NonDeleted<ExcalidrawElement> | null;
            hasBeenDuplicated: boolean;
            advancedListMarkers: readonly import("@excalidraw/element").ListMarkerAdvance[];
            editedTextId: ExcalidrawTextElement["id"] | null;
            hasHitCommonBoundingBoxOfSelectedElements: boolean;
            arrowLabel: boolean;
        };
        withCmdOrCtrl: boolean;
        drag: {
            hasOccurred: boolean;
            offset: {
                x: number;
                y: number;
            } | null;
            origin: {
                x: number;
                y: number;
            };
            lastOffset: {
                x: number;
                y: number;
            };
            blockDragging: boolean;
        };
        eventListeners: {
            onMove: null | ReturnType<typeof import("@excalidraw/common").throttleRAF>;
            onUp: null | ((event: PointerEvent) => void);
            onKeyDown: null | ((event: KeyboardEvent) => void);
            onKeyUp: null | ((event: KeyboardEvent) => void);
        };
        boxSelection: {
            hasOccurred: boolean;
        };
    }>, event: PointerEvent]>;
    onUserFollowEmitter: Emitter<[payload: OnUserFollowedPayload]>;
    onScrollChangeEmitter: Emitter<[scrollX: number, scrollY: number, zoom: Readonly<{
        value: import("../types").NormalizedZoomValue;
    }>]>;
    missingPointerEventCleanupEmitter: Emitter<[event: PointerEvent | null]>;
    onRemoveEventListenersEmitter: Emitter<[]>;
    modifiers: AppModifiers;
    api: ExcalidrawImperativeAPI;
    private elementRenderOverrides;
    /** offsets of `elementRenderOverrides`; keeps its identity while they don't change */
    private elementRenderOffsets;
    private renderOverridesUpdatePending;
    private getRenderOverrideConfig;
    private getElementRenderState;
    private createExcalidrawAPI;
    constructor(props: AppProps);
    /**
     * Whether the editor accepts user input (pointer, keyboard, wheel, touch,
     * clipboard, drag&drop). When `false`, the editor is fully inert for the
     * user, but remains controllable through the imperative API.
     *
     * All user-input entry points must consult this getter (directly or by
     * not being attached/rendered at all).
     */
    isInteractionEnabled(props?: Pick<AppProps, "interaction">): boolean;
    /**
     * Whether element links render their link icon and are clickable.
     * True when fully interactive, or when `interaction: { enabled: { links:
     * true } }`
     * (in which case clicking anywhere on a linked element opens the link,
     * same as in view mode).
     */
    isLinksEnabled(props?: Pick<AppProps, "interaction">): boolean;
    /**
     * Whether canvas navigation — panning & zooming, view-mode style — is
     * enabled. True when fully interactive, or when `interaction: { enabled:
     * { navigation: true } }`. Respects `appState.scrollConstraints`.
     */
    isNavigationEnabled(props?: Pick<AppProps, "interaction">): boolean;
    /**
     * Whether embeddable & iframe elements are interactive (hover & click to
     * activate, view-mode style). True when fully interactive, or when
     * allowed via `interaction.enabled.embeds` / `.interactiveContent`.
     */
    isEmbedsEnabled(props?: Pick<AppProps, "interaction">): boolean;
    /**
     * Whether the browser's own zoom (ctrl/cmd + wheel, pinch, keyboard
     * shortcuts) stays available over the non-interactive editor.
     * Prevented by default.
     */
    isBrowserZoomEnabled(props?: Pick<AppProps, "interaction">): boolean;
    /**
     * Whether the tool can be activated & driven by user input. False when
     * disabled via `UIOptions.tools`, or when the editor is non-interactive
     * and the tool isn't kept user-driven via `interaction.enabled.tools`.
     *
     * (Once UI tool availability is split from input availability — e.g.
     * `props.ui.tools` vs `interaction.disabled.tools` — the UI axis moves
     * out into its own predicate.)
     *
     * We purposely widen the `tool` type so this helper can be called with
     * any tool without having to type check it.
     */
    isToolSupported: <T extends ToolType | "custom">(tool: T, props?: Pick<AppProps, "interaction" | "UIOptions">) => boolean;
    /**
     * Whether the active tool is locked in place — via the tool lock
     * (padlock / Q) or by being host-forced (`props.activeTool`). A locked
     * tool doesn't revert to the selection tool after use, and elements drawn
     * with it aren't selected. Forcing deliberately does not mutate
     * `activeTool.locked`, which is the user's persisted padlock preference.
     */
    isToolLocked(): boolean;
    /**
     * Whether the active tool captures the primary pointer instead of the
     * view-mode drag-to-pan — the laser and host-implemented custom tools do;
     * while non-interactive, any tool allowed via
     * `interaction.enabled.tools` does. (Editing tools capture the pointer
     * trivially since view mode implies they're not active; this predicate only
     * matters where view-mode gates apply.)
     */
    isActiveToolPointerCapturing(): boolean;
    /** Whether Excalidraw's full default UI is rendered. */
    isDefaultUIEnabled(props?: Pick<AppProps, "ui">): boolean;
    /** Whether an individual default UI control is rendered. */
    isUIControlEnabled(control: keyof UIConfig["enabled"], props?: Pick<AppProps, "ui">): boolean;
    updateEditorAtom: <Value, Args extends unknown[], Result>(atom: WritableAtom<Value, Args, Result>, ...args: Args) => Result;
    private onWindowMessage;
    private handleSkipBindMode;
    private resetDelayedBindMode;
    private previousHoveredBindableElement;
    private handleDelayedBindModeChange;
    private cacheEmbeddableRef;
    /**
     * Returns gridSize taking into account `gridModeEnabled`.
     * If disabled, returns null.
     */
    getEffectiveGridSize: () => NullableGridSize;
    private getHTMLIFrameElement;
    /**
     * AI-generated iframe elements aren't interactive while their generation
     * is still in progress (the partial content is render-only).
     */
    private isIframeLikeInteractive;
    private handleIframeLikeElementHover;
    /** @returns true if iframe-like element click handled */
    private handleIframeLikeCenterClick;
    private isDoubleClick;
    private isIframeLikeElementCenter;
    private updateEmbedValidationStatus;
    private updateEmbeddables;
    private renderEmbeddables;
    private getFrameNameDOMId;
    frameNameBoundsCache: FrameNameBoundsCache;
    private resetEditingFrame;
    private renderFrameNames;
    private toggleOverscrollBehavior;
    render(): import("react/jsx-runtime").JSX.Element;
    focusContainer: AppClassProperties["focusContainer"];
    getSceneElementsIncludingDeleted: () => readonly import("@excalidraw/element/types").OrderedExcalidrawElement[];
    getSceneElementsMapIncludingDeleted: () => SceneElementsMap;
    getSceneElements: () => readonly Ordered<NonDeletedExcalidrawElement>[];
    onInsertElements: (elements: readonly ExcalidrawElement[]) => void;
    onExportImage: (type: keyof typeof EXPORT_IMAGE_TYPES, elements: ExportedElements, opts: {
        exportingFrame: NonDeleted<ExcalidrawFrameLikeElement> | null;
    }) => Promise<void>;
    private magicGenerations;
    private updateMagicGeneration;
    plugins: {
        diagramToCode?: {
            generate: GenerateDiagramToCode;
        };
    };
    setPlugins(plugins: Partial<App["plugins"]>): void;
    private onMagicFrameGenerate;
    private onIframeSrcCopy;
    onMagicframeToolSelect: () => void;
    private openEyeDropper;
    dismissLinearEditor: () => void;
    syncActionResult: (actionResult: ActionResult) => void;
    scheduleCapture: () => void;
    private onBlur;
    private onUnload;
    private disableEvent;
    private isFileDropEnabled;
    private onDragOver;
    private handleNavigationModeKeyDown;
    /**
     * PageUp/PageDown scroll the canvas by a page — vertically, or
     * horizontally with shift. Respects `appState.scrollConstraints`
     * (via `viewport.translate`).
     */
    private maybeHandlePageScrollKeyDown;
    private preventBrowserZoomKeyDown;
    /** Ends active input sessions before switching to a view-mode/non-interactive
     *  mode. */
    private terminateActiveInteraction;
    private handleInteractionStateChange;
    /** whether the two values reference the same tool (incl. custom subtype) */
    private isSameForcedTool;
    /**
     * Keeps `state.activeTool` synced to the host-controlled
     * `props.activeTool`. `setActiveTool` refuses non-matching activations
     * while forced (user input, API); this backstop covers the writers that
     * bypass the funnel (`actionFinalize`/`actionDeselect`, `restore()` on
     * scene load, ...) and re-applies the tool once it becomes activatable
     * (e.g. `interaction` config changes).
     */
    private handleForcedToolChange;
    private resetHistory;
    private undo;
    private redo;
    private resetStore;
    /**
     * Resets scene & history.
     * ! Do not use to clear scene user action !
     */
    private resetScene;
    private initializeScene;
    private getFormFactor;
    refreshEditorInterface: () => void;
    private reconcileStylesPanelMode;
    /** TO BE USED LATER */
    private setDesktopUIMode;
    private isTouchScreen;
    isTrayModeEnabled: () => boolean;
    private clearImageShapeCache;
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    private onResize;
    /** generally invoked only if fullscreen was invoked programmatically */
    private onFullscreenChange;
    private removeEventListeners;
    private addEventListeners;
    getSnapshotBeforeUpdate(prevProps: AppProps, prevState: AppState): null;
    /**
     * Flags the container while toggling zen mode so that UI chrome
     * (backgrounds etc.) animates only then, and hover transitions stay
     * instant. A data attribute so that React doesn't reset it on re-render.
     */
    private markZenModeTransition;
    private unmarkZenModeTransition;
    componentDidUpdate(prevProps: AppProps, prevState: AppState): void;
    private renderInteractiveSceneCallback;
    private onScroll;
    private static resetTapTwice;
    private onTouchStart;
    private onTouchEnd;
    addElementsFromPasteOrLibrary: (opts: {
        elements: readonly ExcalidrawElement[];
        files: BinaryFiles | null;
        position: {
            clientX: number;
            clientY: number;
        } | "cursor" | "center";
        retainSeed?: boolean;
        fit?: SetViewportOptions["fit"];
        preserveFrameChildrenOrder?: boolean;
    }) => void;
    setAppState: React.Component<any, AppState>["setState"];
    removePointer: (event: React.PointerEvent<HTMLElement> | PointerEvent) => void;
    toggleLock: (source?: "keyboard" | "ui") => void;
    updateFrameRendering: (opts: Partial<AppState["frameRendering"]> | ((prevState: AppState["frameRendering"]) => Partial<AppState["frameRendering"]>)) => void;
    togglePenMode: (force: boolean | null) => void;
    revealIfHidden: (elements: NonDeletedExcalidrawElement[]) => void;
    /** emits a follow/unfollow intent to the host (which owns the
     *  `userToFollow` state) via both the `onUserFollow` prop and the
     *  imperative API emitter */
    emitUserFollowIntent: (payload: OnUserFollowedPayload) => void;
    /** emits an UNFOLLOW intent if currently following someone — use on
     *  viewport changes that take the view over from the followed user (user
     *  pans and zooms, `setViewport` navigation) */
    requestUnfollow: () => void;
    setForceRenderAllEmbeddables: (force: boolean) => void;
    zoomToFit: (target?: readonly ExcalidrawElement[], maxZoom?: number, //null will zoom to max based on viewport
    margin?: number) => void;
    getColorAtScenePoint: ({ sceneX, sceneY, }: {
        sceneX: number;
        sceneY: number;
    }) => string | null;
    startLineEditor: (el: ExcalidrawLinearElement, selectedPointsIndices?: number[] | null) => void;
    refreshAllArrows: () => void;
    updateContainerSize: (containers: NonDeletedExcalidrawElement[]) => void;
    setToast: (toast: AppState["toast"]) => void;
    private showSceneReplacedToast;
    restoreFileFromShare: () => Promise<void>;
    /**
     * adds supplied files to existing files in the appState.
     * NOTE if file already exists in editor state, the file data is not updated
     * */
    addFiles: ExcalidrawImperativeAPI["addFiles"];
    /**
     * Waits for image-cache work already started by `addFiles()` for the given
     * file IDs. Obsidian recreates the editor across popout documents and uses
     * this completion boundary to publish transferred `BinaryFiles` in bounded
     * batches while retaining the component's ordinary decoding path.
     *
     * Author: zsviczian
     * Reference: obsidian-excalidraw-plugin performance refactor Phase 1C.2c.
     */
    awaitImageFiles: (fileIds: readonly FileId[]) => Promise<void>;
    setMobileModeAllowed: (allow: boolean) => void;
    private debounceClearHighlightSearchResults;
    selectElements: ExcalidrawImperativeAPI["selectElements"];
    bringToFront: ExcalidrawImperativeAPI["bringToFront"];
    bringForward: ExcalidrawImperativeAPI["bringForward"];
    sendToBack: ExcalidrawImperativeAPI["sendToBack"];
    sendBackward: ExcalidrawImperativeAPI["sendBackward"];
    private addMissingFiles;
    updateScene: <K extends keyof AppState>(sceneData: {
        elements?: SceneData["elements"];
        appState?: Pick<AppState, K> | null;
        collaborators?: SceneData["collaborators"];
        /**
         *  Controls which updates should be captured by the `Store`. Captured updates are emmitted and listened to by other components, such as `History` for undo / redo purposes.
         *
         *  - `CaptureUpdateAction.IMMEDIATELY`: Updates are immediately undoable. Use for most local updates.
         *  - `CaptureUpdateAction.NEVER`: Updates never make it to undo/redo stack. Use for remote updates or scene initialization.
         *  - `CaptureUpdateAction.EVENTUALLY`: Updates will be eventually be captured as part of a future increment.
         *
         * Check [API docs](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/excalidraw-api#captureUpdate) for more details.
         *
         * @default CaptureUpdateAction.EVENTUALLY
         */
        captureUpdate?: SceneData["captureUpdate"];
        forceFlushSync?: boolean;
    }) => void;
    /**
     * see {@link ExcalidrawImperativeAPI.setElementRenderOverrides} for details
     */
    setElementRenderOverrides: (overrides: ElementRenderOverrides | null) => void;
    applyDeltas: (deltas: StoreDelta[], options?: ApplyToOptions) => [SceneElementsMap, AppState, boolean];
    mutateElement: <TElement extends Mutable<ExcalidrawElement>>(element: TElement, updates: ElementUpdate<TElement>, informMutation?: boolean) => TElement;
    triggerRender: (
    /** force always re-renders canvas even if no change */
    force?: boolean) => void;
    /**
     * @returns whether the menu was toggled on or off
     */
    toggleSidebar: ({ name, tab, force, }: {
        name: SidebarName | null;
        tab?: SidebarTabName;
        force?: boolean;
    }) => boolean;
    private updateCurrentCursorPosition;
    private onKeyDown;
    private onKeyUp;
    setActiveTool: (tool: ({
        type: ToolType;
    } | {
        type: "custom";
        customType: string;
    }) & {
        locked?: boolean;
        fromSelection?: boolean;
    }, opts?: {
        keepSelection?: boolean;
        /**
         * When `true`, re-activating an already-active toggle tool (see
         * `TOGGLE_TOOLS`) switches back to the previously active tool.
         * Activation is idempotent by default; toggle tools always record the
         * previously active tool regardless (so ESC and the next `toggle`
         * activation can switch back to it).
         */
        toggle?: boolean;
    }) => void;
    setOpenDialog: (dialogType: AppState["openDialog"]) => void;
    /**
     * returns whether user is making a gesture with >= 2 fingers (points)
     * on o touch screen (not on a trackpad). Currently only relates to Darwin
     * (iOS/iPadOS,MacOS), but may work on other devices in the future if
     * GestureEvent is standardized.
     */
    private isTouchScreenMultiTouchGesture;
    getName: () => string;
    private onGestureStart;
    private onGestureChange;
    private onGestureEnd;
    getElementAtPosition(x: number, y: number, opts?: ({
        includeBoundTextElement?: boolean;
        includeLockedElements?: boolean;
    } | {
        allHitElements: NonDeleted<ExcalidrawElement>[];
    }) & {
        preferSelected?: boolean;
    }): NonDeleted<ExcalidrawElement> | null;
    getElementsAtPosition(x: number, y: number, opts?: {
        includeBoundTextElement?: boolean;
        includeLockedElements?: boolean;
    }): NonDeleted<ExcalidrawElement>[];
    /**
     * Whether the element's frame clips it away at the position — hitting a
     * frame's element from outside the frame is not considered a hit.
     */
    isClippedByFrameAt(x: number, y: number, element: ExcalidrawElement): boolean;
    getElementHitThreshold(element: ExcalidrawElement): number;
    hitElement(x: number, y: number, element: NonDeletedExcalidrawElement, considerBoundingBox?: boolean): boolean;
    private debounceDoubleClickTimestamp;
    private startImageCropping;
    finishImageCropping: () => void;
    private shouldHandleBrowserCanvasDoubleClick;
    private handleCanvasDoubleClick;
    private handleCanvasClick;
    getElementLinkAtPosition: (scenePointer: Readonly<{
        x: number;
        y: number;
    }>, hitElementMightBeLocked: NonDeletedExcalidrawElement | null) => NonDeletedExcalidrawElement | undefined;
    private handleElementLinkClick;
    /**
     * Applies (or clears) the element-link hover affordances — pointer cursor
     * and tooltip — based on the current `hitLinkElement`. Returns whether a
     * link is being hovered.
     */
    private applyElementLinkHoverAffordance;
    /**
     * On touchscreens (where no hover precedes the tap) re-derives
     * `hitLinkElement`, then opens the hit element link, if any.
     * Returns whether a link click was handled.
     */
    private maybeHandleElementLinkClick;
    /**
     * Restricted pointer handling for the non-interactive editor with links
     * and/or embeds allowed (`interaction.enabled.links` / `.embeds` /
     * `.interactiveContent`) — runs only the element-link & embed concerns
     * (shared with the full pointer handlers above) so they behave like in
     * view mode without the rest of the canvas pointer machinery.
     */
    private handleInteractiveContentPointerMove;
    private handleInteractiveContentPointerUp;
    /**
     * finds candidate frame under cursor (when dragging frame children/elements
     * inside frames)
     */
    getTopLayerFrameAtSceneCoords: (
    /**
     * should be already grid aligned (basically should be what the call site
     * sets the element's coords to, if applicable)
     */
    sceneCoords: {
        x: number;
        y: number;
    }, opts?: {
        /** to exclude selected elements when dragging, etc. */
        excludeElementIds?: AppState["selectedElementIds"];
        currentFrameId?: ExcalidrawElement["frameId"];
    }) => NonDeleted<ExcalidrawFrameLikeElement> | null;
    updateFrameToHighlight: (frameToHighlight: AppState["frameToHighlight"]) => void;
    private maybeUpdateFrameToHighlightOnPointerMove;
    insertNewElements: (elements: readonly ExcalidrawElement[], idx?: number) => void;
    insertNewElement: (element: ExcalidrawElement, idx?: number) => void;
    private handleCanvasPointerMove;
    private handleEraser;
    private handleTouchMove;
    /**
     * Applies the hover affordances of a selected linear element: the cursor,
     * plus the hovered-handle state that renders them highlighted.
     */
    handleHoverSelectedLinearElement(linearElementEditor: LinearElementEditor, scenePointerX: number, scenePointerY: number): void;
    private handleCanvasPointerDown;
    /**
     * The browser took the pointer over (scroll, pinch, palm rejection): no
     * pointerup will follow, so the gesture is torn down here and now — the
     * same cleanup a lost pointerup gets at the next press, only not left
     * lying in wait for it, where its replay would tangle with that press.
     */
    private handleCanvasPointerCancel;
    private handleCanvasPointerUp;
    private maybeOpenContextMenuAfterPointerDownOnTouchDevices;
    private resetContextMenuTimer;
    /**
     * pointerup may not fire in certian cases (user tabs away...), so in order
     * to properly cleanup pointerdown state, we need to fire any hanging
     * pointerup handlers manually
     */
    private maybeCleanupAfterMissingPointerUp;
    private updateGestureOnPointerDown;
    /**
     * Tracks the pointer within the ongoing multi-touch gesture and applies
     * the two-finger pinch zoom/pan, if any.
     */
    private updateMultiTouchGesture;
    private initialPointerDownState;
    private handleDraggingScrollBar;
    private handleFreeDrawElementOnPointerDown;
    insertIframeElement: ({ sceneX, sceneY, width, height, }: {
        sceneX: number;
        sceneY: number;
        width: number;
        height: number;
    }) => NonDeleted<ExcalidrawIframeElement>;
    insertEmbeddableElement: ({ sceneX, sceneY, link, }: {
        sceneX: number;
        sceneY: number;
        link: string;
    }) => NonDeleted<ExcalidrawEmbeddableElement> | undefined;
    private newImagePlaceholder;
    private handleLinearElementOnPointerDown;
    getCurrentItemRoundness(elementType: "selection" | "rectangle" | "stickynote" | "diamond" | "ellipse" | "iframe" | "embeddable"): {
        type: 2 | 3;
    } | null;
    getCurrentItemStrokeWidth(elementType: ExcalidrawElement["type"]): number;
    private createGenericElementOnPointerDown;
    private createFrameElementOnPointerDown;
    maybeCacheReferenceSnapPoints(event: KeyboardModifiersObject, selectedElements: readonly NonDeletedExcalidrawElement[], recomputeAnyways?: boolean): void;
    maybeCacheVisibleGaps(event: KeyboardModifiersObject, selectedElements: readonly NonDeletedExcalidrawElement[], recomputeAnyways?: boolean): void;
    private onKeyDownFromPointerDownHandler;
    private onKeyUpFromPointerDownHandler;
    private onPointerMoveFromPointerDownHandler;
    private handlePointerMoveOverScrollbars;
    private onPointerUpFromPointerDownHandler;
    private restoreReadyToEraseElements;
    private eraseElements;
    private initializeImage;
    /**
     * use during async image initialization,
     * when the placeholder image could have been modified in the meantime,
     * and when you don't want to loose those modifications
     */
    private getLatestInitializedImageElement;
    private onImageToolbarButtonClick;
    private getImageNaturalDimensions;
    /** updates image cache, refreshing updated elements and/or setting status
        to error for images that fail during <img> element creation */
    private updateImageCache;
    /** adds new images to imageCache and re-renders if needed */
    private addNewImagesToImageCache;
    /** generally you should use `addNewImagesToImageCache()` directly if you need
     *  to render new images. This is just a failsafe  */
    private scheduleImageRefresh;
    setSelection(elements: readonly NonDeletedExcalidrawElement[]): void;
    private handleInteractiveCanvasRef;
    insertImages: (imageFiles: File[], sceneX: number, sceneY: number) => Promise<void>;
    private handleAppOnDrop;
    /** @returns true if the file replaced the scene */
    loadFileToCanvas: (file: File, fileHandle: FileSystemFileHandle | null, insertPosition?: {
        clientX: number;
        clientY: number;
    }) => Promise<true | undefined>;
    private handleCanvasContextMenu;
    /** opens the context menu for the element under the pointer, or the canvas */
    openContextMenu: (pointer: {
        clientX: number;
        clientY: number;
        button?: number;
        pointerType?: string;
    }) => void;
    maybeDragNewGenericElement: (pointerDownState: PointerDownState, event: MouseEvent | KeyboardEvent, informMutation?: boolean) => void;
    private getContextMenuItems;
    savePointer: (x: number, y: number, button: "up" | "down") => void;
    resetShouldCacheIgnoreZoomDebounced: {
        (): void;
        flush(): void;
        cancel(): void;
    };
    private updateDOMRect;
    refresh: () => void;
    private getCanvasOffsets;
    watchState: () => void;
    private updateLanguage;
}
declare global {
    interface Window {
        h: {
            scene: Scene;
            elements: readonly ExcalidrawElement[];
            state: AppState;
            setState: React.Component<any, AppState>["setState"];
            watchState: (prev: any, next: any) => void | undefined;
            app: InstanceType<typeof App>;
            history: History;
            store: Store;
        };
    }
}
export declare const createTestHook: () => void;
export default App;
