/**
 * KuszCanvas: the main-menu switches for blackboard mode and Markdown text
 * write the plugin setting, redraw every open drawing and save, the same as
 * the settings page.
 */
import assert from "node:assert/strict";
import test from "node:test";
import {
  RENDER_FLAG_SETTINGS,
  setRenderFlagSetting,
} from "../../src/core/managers/renderFlagToggles.ts";

const fakePlugin = () => {
  const calls = [];
  return {
    calls,
    settings: { blackboardDarkMode: true, renderMarkdownInText: true },
    saveSettings: async () => {
      calls.push("save");
    },
  };
};
const fakeView = (plugin, name) => ({
  redrawAfterRenderFlagChange: () => {
    plugin.calls.push(
      `redraw ${name} bb=${plugin.settings.blackboardDarkMode} md=${plugin.settings.renderMarkdownInText}`,
    );
    return true;
  },
});

test("lists the two switchable render settings", () => {
  assert.deepEqual([...RENDER_FLAG_SETTINGS], [
    "blackboardDarkMode",
    "renderMarkdownInText",
  ]);
});

test("sets the flag, redraws every open drawing, then saves", async () => {
  const plugin = fakePlugin();
  const views = [fakeView(plugin, "a"), fakeView(plugin, "b")];
  await setRenderFlagSetting(plugin, "blackboardDarkMode", false, () => views);
  assert.equal(plugin.settings.blackboardDarkMode, false);
  assert.equal(plugin.settings.renderMarkdownInText, true);
  assert.deepEqual(plugin.calls, [
    "redraw a bb=false md=true",
    "redraw b bb=false md=true",
    "save",
  ]);

  plugin.calls.length = 0;
  await setRenderFlagSetting(plugin, "renderMarkdownInText", false, () => views);
  assert.deepEqual(plugin.calls, [
    "redraw a bb=false md=false",
    "redraw b bb=false md=false",
    "save",
  ]);
});

test("rejects an unknown setting, a non-boolean value or a missing plugin", async () => {
  const plugin = fakePlugin();
  await assert.rejects(
    setRenderFlagSetting(plugin, "dynamicStyling", true, () => []),
    /not a render flag/,
  );
  await assert.rejects(
    setRenderFlagSetting(plugin, "blackboardDarkMode", "yes", () => []),
    /true or false/,
  );
  await assert.rejects(
    setRenderFlagSetting(null, "blackboardDarkMode", true, () => []),
    /plugin/,
  );
  assert.deepEqual(plugin.calls, []);
  assert.equal(plugin.settings.blackboardDarkMode, true);
});
