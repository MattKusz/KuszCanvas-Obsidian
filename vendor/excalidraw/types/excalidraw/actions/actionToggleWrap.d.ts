import type { AppClassProperties } from "../types";
export declare const actionToggleWrap: {
    name: "toggleWrap";
    label: string;
    trackEvent: {
        category: "element";
    };
    predicate: (elements: readonly import("@excalidraw/element/types").ExcalidrawElement[], appState: import("../types").AppState, _: import("../types").ExcalidrawProps, app: AppClassProperties) => boolean;
    perform: (elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[], appState: Readonly<import("../types").AppState>, _: unknown, app: AppClassProperties) => import("./types").ActionResult;
    keyTest: (event: KeyboardEvent | import("react").KeyboardEvent<Element>, appState: import("../types").AppState, elements: readonly import("@excalidraw/element/types").ExcalidrawElement[], app: AppClassProperties) => boolean;
} & {
    keyTest?: ((event: KeyboardEvent | import("react").KeyboardEvent<Element>, appState: import("../types").AppState, elements: readonly import("@excalidraw/element/types").ExcalidrawElement[], app: AppClassProperties) => boolean) | undefined;
};
