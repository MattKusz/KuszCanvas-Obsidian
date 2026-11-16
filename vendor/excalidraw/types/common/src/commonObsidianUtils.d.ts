import type { EditorInterface, StylesPanelMode } from "./editorInterface";
export type { ObsidianDeviceType } from "./commonObsidianHost";
export declare const getObsidianDeviceInfo: () => Readonly<{
    isDesktop: boolean;
    isPhone: boolean;
    isTablet: boolean;
    isMobile: boolean;
    isLinux: boolean;
    isMacOS: boolean;
    isWindows: boolean;
    isIOS: boolean;
    isAndroid: boolean;
}> | null;
export declare const getDesktopUIMode: () => StylesPanelMode;
export declare const getPreferredUIMode: (formFactor: EditorInterface["formFactor"]) => StylesPanelMode;
export declare function getAreaLimit(): number;
export declare function getWidthHeightLimit(): number;
export declare function getHighlightColor(sceneBgColor: string, opacity?: number): string;
