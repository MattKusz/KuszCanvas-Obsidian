import { LinearElementEditor } from "@excalidraw/element";
import type { ExcalidrawElement, NonDeletedExcalidrawElement } from "@excalidraw/element/types";
import type { Mutable } from "@excalidraw/common/utility-types";
import type { CaptureUpdateActionType } from "@excalidraw/element";
import type { AppClassProperties, AppState, InteractiveCanvasAppState } from "../types";
import type App from "./App";
export declare const selectGroupsForSelectedElements: {
    (appState: Pick<AppState, "selectedElementIds" | "editingGroupId">, elements: readonly NonDeletedExcalidrawElement[], prevAppState: InteractiveCanvasAppState, app: AppClassProperties | null): Mutable<Pick<InteractiveCanvasAppState, "selectedGroupIds" | "editingGroupId" | "selectedElementIds">>;
    clearCache(): void;
};
/**
 * The selection of the given elements alone, with their groups (within the
 * edited group): a frame wins over its children, bound text is left to its
 * container, and a lone line or arrow gets its line editor.
 *
 * @param allElements the (non-deleted) elements the selection is in
 * @param deep select the elements themselves rather than their groups,
 *   editing their innermost group if they share it (and no group otherwise)
 *   — as Ctrl+click does
 */
export declare const getSelectionStateForElements: (targetElements: readonly NonDeletedExcalidrawElement[], allElements: readonly NonDeletedExcalidrawElement[], appState: AppState, deep?: boolean) => Mutable<Pick<Readonly<{
    zoom: AppState["zoom"];
    scrollX: AppState["scrollX"];
    scrollY: AppState["scrollY"];
    width: AppState["width"];
    height: AppState["height"];
    viewModeEnabled: AppState["viewModeEnabled"];
    openDialog: AppState["openDialog"];
    editingGroupId: AppState["editingGroupId"];
    selectedElementIds: AppState["selectedElementIds"];
    frameToHighlight: AppState["frameToHighlight"];
    offsetLeft: AppState["offsetLeft"];
    offsetTop: AppState["offsetTop"];
    theme: AppState["theme"];
} & {
    activeTool: AppState["activeTool"];
    activeEmbeddable: AppState["activeEmbeddable"];
    selectionElement: AppState["selectionElement"];
    selectedGroupIds: AppState["selectedGroupIds"];
    selectedLinearElement: AppState["selectedLinearElement"];
    multiElement: AppState["multiElement"];
    newElement: AppState["newElement"];
    isBindingEnabled: AppState["isBindingEnabled"];
    isMidpointSnappingEnabled: AppState["isMidpointSnappingEnabled"];
    gridModeEnabled: AppState["gridModeEnabled"];
    suggestedBinding: AppState["suggestedBinding"];
    textToolHover: AppState["textToolHover"];
    isRotating: AppState["isRotating"];
    elementsToHighlight: AppState["elementsToHighlight"];
    collaborators: AppState["collaborators"];
    snapLines: AppState["snapLines"];
    zenModeEnabled: AppState["zenModeEnabled"];
    editingTextElement: AppState["editingTextElement"];
    viewBackgroundColor: AppState["viewBackgroundColor"];
    gridColor: AppState["gridColor"];
    gridDirection: AppState["gridDirection"];
    highlightSearchResult: AppState["highlightSearchResult"];
    isCropping: AppState["isCropping"];
    croppingElementId: AppState["croppingElementId"];
    searchMatches: AppState["searchMatches"];
    activeLockedId: AppState["activeLockedId"];
    hoveredElementIds: AppState["hoveredElementIds"];
    frameRendering: AppState["frameRendering"];
    frameColor: AppState["frameColor"];
    shouldCacheIgnoreZoom: AppState["shouldCacheIgnoreZoom"];
    exportScale: AppState["exportScale"];
    currentItemArrowType: AppState["currentItemArrowType"];
}>, "selectedElementIds" | "editingGroupId" | "selectedGroupIds">> & {
    selectedLinearElement: LinearElementEditor | null;
};
/**
 * The selection with the given elements added, with their groups (within the
 * edited group) — and the line editor of a lone selected line or arrow.
 *
 * A frame and its children aren't selected at the same time: an added frame
 * deselects its children, an added child of a selected (or added) frame is
 * left out, and adding elements grouped with frames deselects those frames'
 * children (and leaves the added ones out). In the element link selector, the
 * added elements replace the selection (unless one's group is selected).
 *
 * @param allElements the (non-deleted) elements the selection is in
 */
export declare const getSelectionStateAddingElements: (targetElements: readonly NonDeletedExcalidrawElement[], allElements: readonly NonDeletedExcalidrawElement[], appState: AppState) => Mutable<Pick<Readonly<{
    zoom: AppState["zoom"];
    scrollX: AppState["scrollX"];
    scrollY: AppState["scrollY"];
    width: AppState["width"];
    height: AppState["height"];
    viewModeEnabled: AppState["viewModeEnabled"];
    openDialog: AppState["openDialog"];
    editingGroupId: AppState["editingGroupId"];
    selectedElementIds: AppState["selectedElementIds"];
    frameToHighlight: AppState["frameToHighlight"];
    offsetLeft: AppState["offsetLeft"];
    offsetTop: AppState["offsetTop"];
    theme: AppState["theme"];
} & {
    activeTool: AppState["activeTool"];
    activeEmbeddable: AppState["activeEmbeddable"];
    selectionElement: AppState["selectionElement"];
    selectedGroupIds: AppState["selectedGroupIds"];
    selectedLinearElement: AppState["selectedLinearElement"];
    multiElement: AppState["multiElement"];
    newElement: AppState["newElement"];
    isBindingEnabled: AppState["isBindingEnabled"];
    isMidpointSnappingEnabled: AppState["isMidpointSnappingEnabled"];
    gridModeEnabled: AppState["gridModeEnabled"];
    suggestedBinding: AppState["suggestedBinding"];
    textToolHover: AppState["textToolHover"];
    isRotating: AppState["isRotating"];
    elementsToHighlight: AppState["elementsToHighlight"];
    collaborators: AppState["collaborators"];
    snapLines: AppState["snapLines"];
    zenModeEnabled: AppState["zenModeEnabled"];
    editingTextElement: AppState["editingTextElement"];
    viewBackgroundColor: AppState["viewBackgroundColor"];
    gridColor: AppState["gridColor"];
    gridDirection: AppState["gridDirection"];
    highlightSearchResult: AppState["highlightSearchResult"];
    isCropping: AppState["isCropping"];
    croppingElementId: AppState["croppingElementId"];
    searchMatches: AppState["searchMatches"];
    activeLockedId: AppState["activeLockedId"];
    hoveredElementIds: AppState["hoveredElementIds"];
    frameRendering: AppState["frameRendering"];
    frameColor: AppState["frameColor"];
    shouldCacheIgnoreZoom: AppState["shouldCacheIgnoreZoom"];
    exportScale: AppState["exportScale"];
    currentItemArrowType: AppState["currentItemArrowType"];
}>, "selectedElementIds" | "editingGroupId" | "selectedGroupIds">> & {
    selectedLinearElement: LinearElementEditor | null;
};
/**
 * The selection with the given elements removed — with the group they're
 * selected via (if any) — and a lone remaining line or arrow getting its
 * line editor.
 *
 * @param allElements the (non-deleted) elements the selection is in
 */
export declare const getSelectionStateRemovingElements: (targetElements: readonly NonDeletedExcalidrawElement[], allElements: readonly NonDeletedExcalidrawElement[], appState: AppState) => Mutable<Pick<Readonly<{
    zoom: AppState["zoom"];
    scrollX: AppState["scrollX"];
    scrollY: AppState["scrollY"];
    width: AppState["width"];
    height: AppState["height"];
    viewModeEnabled: AppState["viewModeEnabled"];
    openDialog: AppState["openDialog"];
    editingGroupId: AppState["editingGroupId"];
    selectedElementIds: AppState["selectedElementIds"];
    frameToHighlight: AppState["frameToHighlight"];
    offsetLeft: AppState["offsetLeft"];
    offsetTop: AppState["offsetTop"];
    theme: AppState["theme"];
} & {
    activeTool: AppState["activeTool"];
    activeEmbeddable: AppState["activeEmbeddable"];
    selectionElement: AppState["selectionElement"];
    selectedGroupIds: AppState["selectedGroupIds"];
    selectedLinearElement: AppState["selectedLinearElement"];
    multiElement: AppState["multiElement"];
    newElement: AppState["newElement"];
    isBindingEnabled: AppState["isBindingEnabled"];
    isMidpointSnappingEnabled: AppState["isMidpointSnappingEnabled"];
    gridModeEnabled: AppState["gridModeEnabled"];
    suggestedBinding: AppState["suggestedBinding"];
    textToolHover: AppState["textToolHover"];
    isRotating: AppState["isRotating"];
    elementsToHighlight: AppState["elementsToHighlight"];
    collaborators: AppState["collaborators"];
    snapLines: AppState["snapLines"];
    zenModeEnabled: AppState["zenModeEnabled"];
    editingTextElement: AppState["editingTextElement"];
    viewBackgroundColor: AppState["viewBackgroundColor"];
    gridColor: AppState["gridColor"];
    gridDirection: AppState["gridDirection"];
    highlightSearchResult: AppState["highlightSearchResult"];
    isCropping: AppState["isCropping"];
    croppingElementId: AppState["croppingElementId"];
    searchMatches: AppState["searchMatches"];
    activeLockedId: AppState["activeLockedId"];
    hoveredElementIds: AppState["hoveredElementIds"];
    frameRendering: AppState["frameRendering"];
    frameColor: AppState["frameColor"];
    shouldCacheIgnoreZoom: AppState["shouldCacheIgnoreZoom"];
    exportScale: AppState["exportScale"];
    currentItemArrowType: AppState["currentItemArrowType"];
}>, "selectedElementIds" | "editingGroupId" | "selectedGroupIds">> & {
    selectedLinearElement: LinearElementEditor | null;
};
/** elements, or their ids — one or many */
export type ElementsOrIds = ExcalidrawElement | ExcalidrawElement["id"] | readonly (ExcalidrawElement | ExcalidrawElement["id"])[];
type SelectionChangeOptions = {
    /**
     * how the change is recorded for undo (see `updateScene()`) — by default,
     * along with the next undoable change
     */
    captureUpdate?: CaptureUpdateActionType;
};
type AddOptions = SelectionChangeOptions & {
    /**
     * select locked elements too — e.g. for the context menu to offer unlocking
     * them
     */
    includeLocked?: boolean;
};
type SelectOptions = AddOptions & {
    /**
     * select the elements themselves rather than their groups, editing their
     * innermost group (if they share it) — as Ctrl+click does
     */
    deep?: boolean;
};
/**
 * The selection: selecting elements, adding them to or removing them from
 * the selection, and clearing it — keeping its rules: an element is selected
 * with its group (but within the edited group), a frame and its children
 * aren't selected at the same time, locked elements aren't selected, and a
 * lone line or arrow gets its line editor (see the `getSelectionState*()`
 * functions above).
 *
 * What hangs on the selection follows it: the link popup shows for a lone
 * selected element with a link (or an embeddable), an embed stays active only
 * while selected, cropping ends (unless the cropped image is selected again),
 * and selecting (or adding) anything but the edited text ends text editing,
 * submitting the text. The line editor ends once its line is deselected (see
 * `componentDidUpdate()`).
 *
 * Elements are taken by id from the scene: missing and deleted ones are
 * skipped.
 */
export declare class AppSelection {
    private app;
    constructor(app: App);
    /**
     * Selects the elements alone (with their groups, unless `deep`).
     */
    select: (elementsOrIds: ElementsOrIds, opts?: SelectOptions) => void;
    /**
     * Adds the elements (with their groups) to the selection.
     */
    add: (elementsOrIds: ElementsOrIds, opts?: AddOptions) => void;
    /**
     * Removes the elements from the selection — with the group they're
     * selected via.
     */
    remove: (elementsOrIds: ElementsOrIds, opts?: SelectionChangeOptions) => void;
    /**
     * Clears the selection, leaving the edited group and ending cropping.
     *
     * (Doesn't end text editing: starting it clears the selection.)
     */
    clear: (opts?: SelectionChangeOptions) => void;
    /**
     * Ends what changing the selection ends — cropping (unless
     * `keepsCroppedImage`), and text editing (unless selecting the edited text,
     * or its container) — and records the change for undo as asked.
     *
     * @param elements the elements being selected (or added) — none for a
     *   change that leaves text editing be
     */
    private beforeChange;
    /**
     * The next selection state with what follows it: the link popup — shown for
     * a lone selected element with a link (or an embeddable), the link editor
     * staying open if it's the same element, and hidden otherwise — and the
     * active embed, which stays active only while selected.
     */
    private withFollowingState;
    isASelectedElement(hitElement: ExcalidrawElement | null): boolean;
    isHittingCommonBoundingBoxOfSelectedElements(point: Readonly<{
        x: number;
        y: number;
    }>, selectedElements: readonly ExcalidrawElement[]): boolean;
    /**
     * The scene's (non-deleted) elements, by id, once each — but locked ones,
     * unless `includeLocked`
     */
    private resolve;
}
export {};
