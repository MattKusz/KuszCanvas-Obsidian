/**
 * KuszCanvas: the common host adapter exposes the blackboard and Markdown-text
 * render flags (common host protocol 2) as live reads of plugin settings.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { createObsidianCommonHostAdapter } from "../../src/core/managers/obsidianCommonHostAdapter.ts";

const fakePlugin = (settings) => ({
  settings,
  excalidrawConfig: null,
  getObsidianDevice: () => null,
  getPreferredUIMode: () => "tray",
  getHighlightColor: () => "#0076ff",
});

test("adapter passes the engine protocol through unchanged", () => {
  const adapter = createObsidianCommonHostAdapter(
    fakePlugin({ blackboardDarkMode: true, renderMarkdownInText: true }),
    2,
  );
  assert.equal(adapter.protocolVersion, 2);
});

test("render flags are read live from the current settings object", () => {
  const plugin = fakePlugin({
    blackboardDarkMode: false,
    renderMarkdownInText: false,
  });
  const adapter = createObsidianCommonHostAdapter(plugin, 2);

  assert.equal(adapter.isBlackboardModeEnabled(), false);
  assert.equal(adapter.isMarkdownTextRenderingEnabled(), false);

  plugin.settings.blackboardDarkMode = true;
  assert.equal(adapter.isBlackboardModeEnabled(), true);
  assert.equal(adapter.isMarkdownTextRenderingEnabled(), false);

  // settings reloads replace the whole object; the adapter must follow
  plugin.settings = { blackboardDarkMode: false, renderMarkdownInText: true };
  assert.equal(adapter.isBlackboardModeEnabled(), false);
  assert.equal(adapter.isMarkdownTextRenderingEnabled(), true);
});

test("render flags are strict booleans even for malformed settings", () => {
  const adapter = createObsidianCommonHostAdapter(
    fakePlugin({ blackboardDarkMode: "yes", renderMarkdownInText: undefined }),
    2,
  );
  assert.equal(adapter.isBlackboardModeEnabled(), false);
  assert.equal(adapter.isMarkdownTextRenderingEnabled(), false);
});
