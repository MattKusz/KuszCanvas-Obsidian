import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { ActionResult } from "../actions/types";
import type { AppState } from "../types";
import type App from "./App";
/**
 * Wraps the selection in what fits it, or unwraps it, preferring containers
 * over frames:
 *
 * 1. a text and a container without one: binds the text to the container
 * 2. texts, with any labeled containers: wraps each text in a container
 * 3. labeled containers: unwraps their texts, removing the containers
 * 4. a frame with any of its children, or all of a frame's children: removes
 *    the frame
 * 5. anything else without a frame: wraps it in a frame
 *
 * The containers (3) removed come back in place of new ones while the
 * selection it left stands, so diamonds, notes and arrows survive a toggle.
 */
export declare class AppWrap {
    private app;
    private unwrapped;
    constructor(app: App);
    toggle: (elements: readonly ExcalidrawElement[], appState: Readonly<AppState>) => ActionResult;
    /** frees the containers' texts, moving the containers' arrows onto them */
    private unwrap;
    /**
     * puts the unwrapped texts back into their containers, along with the
     * containers' arrows — `null` when any of them is gone
     */
    private rewrap;
}
