import type { AppClassProperties } from "../types";
type ImageMenuItemsProps = {
    app: AppClassProperties;
};
export declare const ImageMenuItems: ({ app }: ImageMenuItemsProps) => import("react/jsx-runtime").JSX.Element;
type ImageMenuProps = {
    app: AppClassProperties;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    triggerClassName?: string;
};
export declare const ImageMenu: ({ app, open, onToggle, onClose, triggerClassName, }: ImageMenuProps) => import("react/jsx-runtime").JSX.Element;
export {};
