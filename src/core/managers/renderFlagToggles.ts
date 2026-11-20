/**
 * KuszCanvas: main-menu switches for the engine's render flags. A switch
 * writes the same plugin setting as the settings page, so it applies to every
 * drawing and persists; the engine reads the setting live through the common
 * host adapter (`obsidianCommonHostAdapter.ts`).
 */

/** Plugin settings the main menu can switch. */
export const RENDER_FLAG_SETTINGS = [
  "blackboardDarkMode",
  "renderMarkdownInText",
] as const;

export type RenderFlagSetting = (typeof RENDER_FLAG_SETTINGS)[number];

export interface RenderFlagPlugin {
  settings: Record<RenderFlagSetting, boolean>;
  saveSettings(): Promise<void>;
}

export interface RenderFlagView {
  redrawAfterRenderFlagChange(): boolean;
}

/**
 * Sets a render flag, redraws the open drawings at once, then saves.
 * `getViews` returns every open Excalidraw view, popouts included.
 */
export const setRenderFlagSetting = async (
  plugin: RenderFlagPlugin,
  key: RenderFlagSetting,
  value: boolean,
  getViews: () => readonly RenderFlagView[],
): Promise<void> => {
  if (!plugin || !plugin.settings || typeof plugin.saveSettings !== "function") {
    throw new Error("setRenderFlagSetting: plugin with settings is required");
  }
  if (!(RENDER_FLAG_SETTINGS as readonly string[]).includes(key)) {
    throw new Error(`setRenderFlagSetting: "${key}" is not a render flag`);
  }
  if (typeof value !== "boolean") {
    throw new Error(`setRenderFlagSetting: "${key}" must be true or false`);
  }
  if (typeof getViews !== "function") {
    throw new Error("setRenderFlagSetting: getViews is required");
  }
  plugin.settings[key] = value;
  for (const view of getViews()) {
    view.redrawAfterRenderFlagChange();
  }
  await plugin.saveSettings();
};
