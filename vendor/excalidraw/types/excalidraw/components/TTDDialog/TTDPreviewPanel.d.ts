import type { MermaidToExcalidrawLibProps } from "./types";
interface TTDPreviewPanelProps {
    canvasRef: React.RefObject<HTMLDivElement | null>;
    error: Error | null;
    loadStatus: MermaidToExcalidrawLibProps["status"];
    loadErrorReloadRequired?: boolean;
    onRetryLoad?: () => void;
    onInsert: () => void;
    hideErrorDetails?: boolean;
}
export declare const TTDPreviewPanel: ({ canvasRef, error, loadStatus, loadErrorReloadRequired, onRetryLoad, onInsert, hideErrorDetails, }: TTDPreviewPanelProps) => import("react/jsx-runtime").JSX.Element;
export {};
