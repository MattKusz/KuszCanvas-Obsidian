import assert from "node:assert/strict";
import { join, resolve } from "node:path";
import test from "node:test";
import { FORK_SIBLING_DIRNAME, siblingForkRoot } from "../forkLocation.mjs";

test("the Excalidraw fork is checked out beside the plugin as KuszCanvas", () => {
  assert.equal(FORK_SIBLING_DIRNAME, "KuszCanvas");
  const plugin = resolve("/work/KuszCanvas-Obsidian");
  assert.equal(siblingForkRoot(plugin), join(resolve("/work"), "KuszCanvas"));
});

test("sibling fork root rejects a missing plugin root", () => {
  assert.throws(() => siblingForkRoot(""), /pluginRoot/);
  assert.throws(() => siblingForkRoot(undefined), /pluginRoot/);
});
