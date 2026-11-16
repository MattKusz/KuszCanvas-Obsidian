import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { obsidianArtifacts } from "../excalidrawTypeSource.mjs";
import {
  trackedArtifacts,
  vendorExcalidraw,
  vendoredManifest,
} from "../vendor-excalidraw.mjs";

const forkManifest = {
  name: "@zsviczian/excalidraw",
  version: "0.18.147",
  type: "module",
  main: "./dist/prod/index.js",
  types: "types/excalidraw/index.d.ts",
  exports: {
    "./common/*": { types: "./types/common/src/*.d.ts" },
    "./index.css": { production: "./dist/prod/index.css" },
    ".": {
      types: "./types/excalidraw/index.d.ts",
      production: "./dist/prod/index.js",
      default: "./dist/prod/index.js",
    },
  },
  license: "MIT",
  peerDependencies: { react: "^19.0.0" },
  dependencies: { roughjs: "4.6.4" },
  devDependencies: { esbuild: "0.19.10" },
  scripts: { prepack: "yarn build:esm && yarn build:obsidian" },
  files: ["dist/*", "types/*"],
  publishConfig: { access: "public" },
  repository: { type: "git", url: "git+https://github.com/zsviczian/excalidraw.git" },
};

const git = (cwd, ...args) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
const write = (path, value) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
};
const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "vendor-excalidraw-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const fork = join(root, "excalidraw");
  const pkg = join(fork, "packages/excalidraw");
  write(join(pkg, "package.json"), JSON.stringify(forkManifest, null, 2));
  write(join(fork, ".gitignore"), "packages/excalidraw/dist\npackages/excalidraw/types\n");
  git(fork, "init", "-q", "-b", "kusch/whiteboard");
  git(fork, "-c", "user.name=t", "-c", "user.email=t@t", "add", ".");
  git(fork, "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "fixture");
  git(fork, "remote", "add", "origin", "https://github.com/example/excalidraw.git");
  for (const name of obsidianArtifacts) write(join(pkg, "dist/obsidian", name), `artifact ${name}`);
  write(join(pkg, "types/excalidraw/index.d.ts"), "export {};");
  write(join(pkg, "types/common/src/index.d.ts"), "export {};");
  const vendor = join(root, "plugin/vendor/excalidraw");
  return { root, fork, pkg, vendor };
}

test("vendored manifest keeps type resolution and drops publish and build hooks", () => {
  const manifest = vendoredManifest(forkManifest);
  assert.equal(manifest.name, "@zsviczian/excalidraw");
  assert.equal(manifest.version, "0.18.147");
  assert.equal(manifest.types, "types/excalidraw/index.d.ts");
  assert.deepEqual(manifest.exports, {
    "./common/*": { types: "./types/common/src/*.d.ts" },
    ".": { types: "./types/excalidraw/index.d.ts" },
  });
  assert.deepEqual(manifest.dependencies, { roughjs: "4.6.4" });
  assert.deepEqual(manifest.peerDependencies, { react: "^19.0.0" });
  for (const key of ["scripts", "devDependencies", "files", "publishConfig", "main", "module"])
    assert.equal(key in manifest, false, `${key} must not be vendored`);
});

test("vendored manifest rejects a package that is not the Excalidraw fork", () => {
  assert.throws(() => vendoredManifest({ ...forkManifest, name: "other" }), /@zsviczian\/excalidraw/);
  assert.throws(() => vendoredManifest(null), /manifest/);
});

test("only production artifacts are tracked in the vendor folder", () => {
  assert.deepEqual(trackedArtifacts, [
    "excalidraw.production.min.js",
    "excalidraw.production.min.css",
  ]);
});

test("copies artifacts, types and records the exact fork source", (t) => {
  const f = fixture(t);
  const builds = [];
  const record = vendorExcalidraw({
    forkRoot: f.fork,
    vendorRoot: f.vendor,
    build: true,
    runBuild: (cwd) => builds.push(cwd),
    now: () => new Date("2026-11-13T00:00:00.000Z"),
  });
  assert.deepEqual(builds, [f.pkg]);
  for (const name of obsidianArtifacts)
    assert.equal(
      readFileSync(join(f.vendor, "dist/obsidian", name), "utf8"),
      `artifact ${name}`,
    );
  assert.ok(existsSync(join(f.vendor, "types/excalidraw/index.d.ts")));
  assert.ok(existsSync(join(f.vendor, "types/common/src/index.d.ts")));
  const source = JSON.parse(readFileSync(join(f.vendor, "SOURCE.json"), "utf8"));
  assert.deepEqual(source, record);
  assert.equal(source.package, "@zsviczian/excalidraw");
  assert.equal(source.version, "0.18.147");
  assert.equal(source.repository, "https://github.com/example/excalidraw.git");
  assert.equal(source.branch, "kusch/whiteboard");
  assert.equal(source.commit, git(f.fork, "rev-parse", "HEAD"));
  assert.equal(source.builtAt, "2026-11-13T00:00:00.000Z");
  assert.equal(source.built, true);
  assert.deepEqual(
    source.artifacts.map(({ name, bytes, sha256: hash, tracked }) => ({ name, bytes, hash, tracked })),
    obsidianArtifacts.map((name) => ({
      name,
      bytes: Buffer.byteLength(`artifact ${name}`),
      hash: sha256(join(f.pkg, "dist/obsidian", name)),
      tracked: trackedArtifacts.includes(name),
    })),
  );
  assert.deepEqual(
    JSON.parse(readFileSync(join(f.vendor, "package.json"), "utf8")),
    vendoredManifest(forkManifest),
  );
});

test("replaces stale types rather than merging them", (t) => {
  const f = fixture(t);
  write(join(f.vendor, "types/stale/old.d.ts"), "export {};");
  vendorExcalidraw({ forkRoot: f.fork, vendorRoot: f.vendor, build: false });
  assert.equal(existsSync(join(f.vendor, "types/stale/old.d.ts")), false);
  assert.equal(JSON.parse(readFileSync(join(f.vendor, "SOURCE.json"), "utf8")).built, false);
});

test("refuses a dirty fork tree before building or copying", (t) => {
  const f = fixture(t);
  write(join(f.fork, "untracked.txt"), "dirty");
  let built = false;
  assert.throws(
    () =>
      vendorExcalidraw({
        forkRoot: f.fork,
        vendorRoot: f.vendor,
        build: true,
        runBuild: () => (built = true),
      }),
    /uncommitted changes/,
  );
  assert.equal(built, false);
  assert.equal(existsSync(f.vendor), false);
});

test("refuses when the build leaves the fork tree dirty", (t) => {
  const f = fixture(t);
  assert.throws(
    () =>
      vendorExcalidraw({
        forkRoot: f.fork,
        vendorRoot: f.vendor,
        build: true,
        runBuild: () => write(join(f.fork, "generated.txt"), "x"),
      }),
    /uncommitted changes/,
  );
  assert.equal(existsSync(f.vendor), false);
});

test("refuses a missing artifact or declaration without touching the vendor folder", (t) => {
  const f = fixture(t);
  rmSync(join(f.pkg, "dist/obsidian", obsidianArtifacts[1]));
  assert.throws(
    () => vendorExcalidraw({ forkRoot: f.fork, vendorRoot: f.vendor, build: false }),
    /excalidraw\.development\.js/,
  );
  assert.equal(existsSync(f.vendor), false);
});

test("refuses a vendor target outside vendor/excalidraw", (t) => {
  const f = fixture(t);
  assert.throws(
    () => vendorExcalidraw({ forkRoot: f.fork, vendorRoot: join(f.root, "plugin"), build: false }),
    /vendor[\\/]excalidraw/,
  );
});
