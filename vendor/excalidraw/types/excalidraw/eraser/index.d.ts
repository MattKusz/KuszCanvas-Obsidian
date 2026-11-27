import type { GlobalPoint, LineSegment } from "@excalidraw/math/types";
import type { ElementsMap, ExcalidrawElement } from "@excalidraw/element/types";
import { AnimatedTrail } from "../animatedTrail";
import type App from "../components/App";
export declare class EraserTrail extends AnimatedTrail {
    private elementsToErase;
    private groupsToErase;
    constructor(app: App);
    startPath(x: number, y: number): void;
    addPointToPath(x: number, y: number, restore?: boolean): string[];
    private updateElementsToBeErased;
    endPath(): void;
}
export declare const eraserTest: (pathSegment: LineSegment<GlobalPoint>, element: ExcalidrawElement, elementsMap: ElementsMap, zoom: number) => boolean;
