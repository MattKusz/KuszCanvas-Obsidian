import type { MermaidToExcalidrawLibProps } from "./types";
interface TTDDialogOutputProps {
    error: Error | null;
    canvasRef: React.RefObject<HTMLDivElement | null>;
    loadStatus: MermaidToExcalidrawLibProps["status"];
    loadErrorReloadRequired?: boolean;
    onRetryLoad?: () => void;
    hideErrorDetails?: boolean;
    sourceText?: string;
    autoFixAvailable?: boolean;
    onApplyAutoFix?: () => void;
}
export declare const TTDDialogOutput: ({ error, canvasRef, loadStatus, loadErrorReloadRequired, onRetryLoad, hideErrorDetails, sourceText, autoFixAvailable, onApplyAutoFix, }: TTDDialogOutputProps) => import("react/jsx-runtime").JSX.Element;
export {};
