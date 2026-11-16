import React from "react";
type RadixPortalComponent = React.ComponentType<React.PropsWithChildren<{
    container?: HTMLElement;
}>>;
type ObsidianRadixPortalProps = {
    children: React.ReactNode;
    container: HTMLDivElement | null;
    portal: RadixPortalComponent;
};
/**
 * Purpose:
 *   Render Radix floating-position wrappers directly under the owning
 *   document's body. Obsidian popout windows place Excalidraw inside an
 *   offset containing block, which otherwise displaces Radix's fixed wrapper.
 *   The display:contents bridge retains Excalidraw's scoped theme rules and
 *   inline CSS variables without creating another containing block.
 *
 * Author:
 *   zsviczian
 *
 * References:
 *   https://github.com/excalidraw/excalidraw/pull/10221
 *
 * Notes:
 *   This is specific to Excalidraw hosted in Obsidian's Electron popouts.
 *   The bridge style is re-synced in a `useLayoutEffect` rather than read
 *   inline during render: render always observes the *previous* commit's
 *   `container.style` (React hasn't flushed this render's DOM writes yet),
 *   so a style that changes while the portal is already open — e.g. dynamic
 *   canvas-color theming while its color-picker popover is open — was
 *   captured one commit stale and stuck that way until the popover was
 *   closed and reopened (a fresh mount reads current DOM state). The
 *   `useLayoutEffect` runs after the commit, so it observes the live value;
 *   the shallow-equality check keeps it from looping once synced.
 *   The body portal cannot inherit the source workspace leaf's visibility, so
 *   the bridge mirrors whether the Excalidraw container has a layout box. This
 *   keeps the Radix content mounted and its open state intact while Obsidian
 *   hides the tab, then reveals the same content when the tab becomes visible.
 */
export declare const ObsidianRadixPortal: ({ children, container, portal: Portal, }: ObsidianRadixPortalProps) => import("react/jsx-runtime").JSX.Element;
export {};
