import "../Switch.scss";
import type { DropdownMenuItemProps } from "./DropdownMenuItem";
export type DropdownMenuItemToggleProps = Omit<DropdownMenuItemProps, "onSelect" | "onChange" | "selected" | "badge"> & {
    checked: boolean;
    /** called with the new value after the row is selected */
    onChange: (checked: boolean) => void;
};
declare const DropdownMenuItemToggle: {
    ({ checked, onChange, className, children, ...rest }: DropdownMenuItemToggleProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export default DropdownMenuItemToggle;
