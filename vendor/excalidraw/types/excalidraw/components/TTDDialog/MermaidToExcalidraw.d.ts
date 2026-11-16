import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";
import "./MermaidToExcalidraw.scss";
import type { MermaidToExcalidrawLibProps } from "./types";
declare const MermaidToExcalidraw: ({ mermaidToExcalidrawLib, onRetryLoad, isActive, selectedElements, }: {
    mermaidToExcalidrawLib: MermaidToExcalidrawLibProps;
    onRetryLoad?: () => void;
    isActive?: boolean;
    selectedElements: readonly NonDeletedExcalidrawElement[];
}) => import("react/jsx-runtime").JSX.Element;
export default MermaidToExcalidraw;
