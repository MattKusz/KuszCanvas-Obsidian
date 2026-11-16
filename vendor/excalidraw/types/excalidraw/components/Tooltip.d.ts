import React from "react";
import "./Tooltip.scss";
export declare const TOOLTIP_CLASS = "excalidraw-tooltip";
export declare const TOOLTIP_VISIBLE_CLASS = "excalidraw-tooltip--visible";
export declare const getTooltipDiv: (ownerDocument: Document) => HTMLDivElement;
/**
 * Hides `ownerDocument`'s tooltip, for tooltips not shown through
 * `showTooltip` (see `hideTooltip`).
 */
export declare const hideDocumentTooltip: (ownerDocument: Document) => void;
export declare const updateTooltipPosition: (tooltip: HTMLDivElement, item: {
    left: number;
    top: number;
    width: number;
    height: number;
}, position?: "bottom" | "top") => void;
/** ms before a `delay`ed tooltip shows */
export declare const TOOLTIP_DELAY = 500;
type TooltipOwner = Document | React.PointerEvent<HTMLElement>;
export declare const hideTooltip: (owner?: TooltipOwner) => void;
/**
 * Shows the tooltip for `item`. For elements that can't be wrapped
 * in <Tooltip>. Pair with `hideTooltip()`.
 */
export declare const showTooltip: (item: HTMLElement, label: string, { long, delay, position, }?: {
    long?: boolean;
    /** show after a short delay (unless a tooltip was visible just now) */
    delay?: boolean;
    position?: "bottom" | "top";
}) => void;
type TooltipProps = {
    children: React.ReactNode;
    label: string;
    long?: boolean;
    style?: React.CSSProperties;
    className?: string;
    disabled?: boolean;
    /** show after a short delay (unless a tooltip was visible just now) */
    delay?: boolean;
};
export declare const Tooltip: ({ children, label, long, style, className, disabled, delay, }: TooltipProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
