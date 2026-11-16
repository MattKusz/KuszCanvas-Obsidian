import type { AppState, InputDevice, NormalizedZoomValue } from "./types";
export declare const getDefaultAppState: () => Omit<AppState, "offsetTop" | "offsetLeft" | "width" | "height">;
export declare const clearAppStateForLocalStorage: (appState: Partial<AppState>) => {
    viewBackgroundColor?: string | undefined;
    theme?: import("@excalidraw/element/types").Theme | undefined;
    name?: string | null | undefined;
    zoom?: Readonly<{
        value: NormalizedZoomValue;
    }> | undefined;
    isBindingEnabled?: boolean | undefined;
    isMidpointSnappingEnabled?: boolean | undefined;
    selectedElementIds?: Readonly<{
        [id: string]: true;
    }> | undefined;
    scrollX?: number | undefined;
    scrollY?: number | undefined;
    editingGroupId?: string | null | undefined;
    activeTool?: ({
        lastActiveTool: import("./types").ActiveTool | null;
        locked: boolean;
        fromSelection: boolean;
    } & import("./types").ActiveTool) | undefined;
    selectedGroupIds?: {
        [groupId: string]: boolean;
    } | undefined;
    selectedLinearElement?: import("@excalidraw/element").LinearElementEditor | null | undefined;
    gridModeEnabled?: boolean | undefined;
    zenModeEnabled?: boolean | undefined;
    shouldCacheIgnoreZoom?: boolean | undefined;
    exportScale?: number | undefined;
    currentItemArrowType?: "round" | "sharp" | "elbow" | undefined;
    showWelcomeScreen?: boolean | undefined;
    boxSelectionMode?: import("./types").BoxSelectionMode | undefined;
    bindingPreference?: "enabled" | "disabled" | undefined;
    showHints?: boolean | undefined;
    inputDevice?: InputDevice | undefined;
    preferredSelectionTool?: {
        type: "selection" | "lasso";
        initialized: boolean;
    } | undefined;
    penMode?: boolean | undefined;
    penDetected?: boolean | undefined;
    exportBackground?: boolean | undefined;
    exportEmbedScene?: boolean | undefined;
    exportWithDarkMode?: boolean | undefined;
    currentItemStrokeColor?: string | undefined;
    currentItemStickynoteStrokeColor?: string | undefined;
    currentItemStickynoteBackgroundColor?: string | undefined;
    currentItemBackgroundColor?: string | undefined;
    currentItemFillStyle?: import("@excalidraw/element/types").FillStyle | undefined;
    currentItemStrokeWidth?: number | undefined;
    currentItemStrokeWidthKey?: import("@excalidraw/common").StrokeWidthKey | undefined;
    currentItemStrokeStyle?: import("@excalidraw/element/types").StrokeStyle | undefined;
    currentItemRoughness?: number | undefined;
    currentItemStrokeVariability?: import("@excalidraw/element/types").StrokeVariability | undefined;
    currentItemOpacity?: number | undefined;
    currentItemFontFamily?: number | undefined;
    currentItemFontSize?: number | undefined;
    currentItemTextAlign?: string | undefined;
    currentItemStartArrowhead?: import("@excalidraw/element/types").Arrowhead | null | undefined;
    currentItemEndArrowhead?: import("@excalidraw/element/types").Arrowhead | null | undefined;
    currentItemRoundness?: import("@excalidraw/element/types").StrokeRoundness | undefined;
    currentItemFrameRole?: ("marker" | null) | undefined;
    cursorButton?: "up" | "down" | undefined;
    scrolledOutside?: boolean | undefined;
    openMenu?: "canvas" | "shape" | null | undefined;
    openSidebar?: {
        name: import("./types").SidebarName;
        tab?: import("./types").SidebarTabName;
    } | null | undefined;
    defaultSidebarDockedPreference?: boolean | undefined;
    lastPointerDownWith?: import("@excalidraw/element/types").PointerType | undefined;
    previousSelectedElementIds?: {
        [id: string]: true;
    } | undefined;
    gridSize?: number | undefined;
    gridStep?: number | undefined;
    stats?: {
        open: boolean;
        panels: number;
    } | undefined;
    objectsSnapModeEnabled?: boolean | undefined;
    lockedMultiSelections?: {
        [groupId: string]: true;
    } | undefined;
    bindMode?: import("@excalidraw/element/types").BindMode | undefined;
    colorTopPicks?: {
        elementStroke: readonly string[] | null;
        elementBackground: readonly string[] | null;
        bucketFill: readonly string[] | null;
        stickyNoteStroke: readonly string[] | null;
        stickyNoteBackground: readonly string[] | null;
    } | undefined;
    fontTopPicks?: readonly number[] | null | undefined;
};
export declare const cleanAppStateForExport: (appState: Partial<AppState>) => {
    viewBackgroundColor?: string | undefined;
    gridModeEnabled?: boolean | undefined;
    gridSize?: number | undefined;
    gridStep?: number | undefined;
    lockedMultiSelections?: {
        [groupId: string]: true;
    } | undefined;
};
export declare const clearAppStateForDatabase: (appState: Partial<AppState>) => {
    viewBackgroundColor?: string | undefined;
    gridModeEnabled?: boolean | undefined;
    gridSize?: number | undefined;
    gridStep?: number | undefined;
    lockedMultiSelections?: {
        [groupId: string]: true;
    } | undefined;
};
export declare const isEraserActive: ({ activeTool, }: {
    activeTool: AppState["activeTool"];
}) => boolean;
export declare const isHandToolActive: ({ activeTool, }: {
    activeTool: AppState["activeTool"];
}) => boolean;
export declare const isLaserPointerActive: ({ activeTool, }: {
    activeTool: AppState["activeTool"];
}) => boolean;
/**
 * The device the wheel mappings follow for the given preference.
 *
 * `auto` is meant to detect the device from the wheel events themselves
 * (line vs. pixel delta modes, whole vs. fractional deltas, one vs. two axes
 * moving, event cadence and momentum tails). That is not implemented yet, so
 * it resolves to `trackpad` — the mapping the editor has always had, and the
 * default to keep until detection exists.
 */
export declare const resolveInputDevice: (inputDevice: InputDevice) => Exclude<InputDevice, "auto">;
