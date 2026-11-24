/**
 * KuszCanvas: the plugin installs as "kuszcanvas", not the official
 * Excalidraw plugin's "obsidian-excalidraw-plugin", so it never replaces (or
 * is replaced by) the official plugin in a vault. Obsidian IDs are lowercase
 * letters and hyphens and must match the plugin folder name.
 */
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ID = "kuszcanvas";
const OLD_ID = "obsidian-excalidraw-plugin";
const root = new URL("../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

test("manifests carry the KuszCanvas ID and name", () => {
  for (const file of ["manifest.json", "manifest-beta.json"]) {
    const manifest = JSON.parse(read(file));
    assert.equal(manifest.id, ID, file);
    assert.equal(manifest.name, "KuszCanvas", file);
    assert.match(manifest.id, /^[a-z-]+$/, `${file}: Obsidian IDs are lowercase letters and hyphens`);
  }
});

test("source constant and native test runner use the manifest ID", () => {
  assert.match(read("src/constants/constants.ts"), new RegExp(`export const PLUGIN_ID = "${ID}";`));
  assert.match(read("scripts/testing/host/runner.mjs"), new RegExp(`export const PLUGIN_ID = "${ID}";`));
});

test("no source file addresses the plugin by the old ID", () => {
  // Links to the upstream GitHub repo and docs site keep the old name; only
  // plugin lookups, command IDs and the CLI root are forbidden.
  const usage = new RegExp(`["'\`]${OLD_ID}["'\`:]|${OLD_ID}:[a-z]|Native root: ${OLD_ID}`);
  const offenders = walk(fileURLToPath(new URL("src", root)))
    .filter((path) => /\.(ts|tsx|md)$/.test(path))
    .filter((path) => usage.test(readFileSync(path, "utf8")));
  assert.deepEqual(offenders, []);
});
