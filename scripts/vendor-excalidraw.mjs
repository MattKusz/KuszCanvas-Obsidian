/**
 * Vendor the KuszCanvas Excalidraw fork build into vendor/excalidraw.
 *
 * Usage: npm run vendor:excalidraw -- [--fork <path>] [--skip-build]
 *
 * The fork (default ../KuszCanvas) must have a clean working tree so the
 * recorded commit identifies the vendored bytes exactly. By default the
 * script runs `yarn build:obsidian` in packages/excalidraw first.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { obsidianArtifacts } from "./excalidrawTypeSource.mjs";
import { siblingForkRoot } from "./forkLocation.mjs";
import { packageManagerInvocation } from "./testing/host/processTools.mjs";

const PACKAGE_NAME = "@zsviczian/excalidraw";

/** Artifacts committed to KuszCanvas; development builds are regenerated locally. */
export const trackedArtifacts = obsidianArtifacts.filter((name) =>
  name.includes(".production."),
);

// Keys copied verbatim. Scripts (prepack runs yarn), devDependencies, files and
// publish settings are deliberately excluded: npm must never build or publish
// the vendored copy.
const MANIFEST_KEYS = [
  "name",
  "version",
  "type",
  "types",
  "description",
  "license",
  "repository",
  "peerDependencies",
  "dependencies",
];

/** Return the manifest for vendor/excalidraw: type entry points only. */
export function vendoredManifest(manifest) {
  if (!manifest || typeof manifest !== "object")
    throw new Error("Fork package manifest must be an object");
  if (manifest.name !== PACKAGE_NAME)
    throw new Error(`Fork package must be ${PACKAGE_NAME}, found ${manifest.name}`);
  if (typeof manifest.version !== "string" || !manifest.version)
    throw new Error("Fork package manifest has no version");
  const result = {};
  for (const key of MANIFEST_KEYS) if (key in manifest) result[key] = manifest[key];
  // Only the obsidian IIFE artifact is vendored; ESM dist/prod and dist/dev
  // entries would point at files that do not exist.
  const exports = {};
  for (const [path, conditions] of Object.entries(manifest.exports ?? {}))
    if (conditions && typeof conditions === "object" && conditions.types)
      exports[path] = { types: conditions.types };
  result.exports = exports;
  return result;
}

function git(cwd, ...args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`git ${args.join(" ")} failed in ${cwd}: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

function assertClean(forkRoot, stage) {
  const status = git(forkRoot, "status", "--porcelain");
  if (status)
    throw new Error(
      `Fork at ${forkRoot} has uncommitted changes ${stage}; commit or stash them first:\n${status}`,
    );
}

function defaultRunBuild(packageRoot) {
  const { file, args } = packageManagerInvocation("yarn", ["build:obsidian"]);
  const result = spawnSync(file, args, {
    cwd: packageRoot,
    stdio: "inherit",
    windowsHide: true,
    env: { ...process.env, COREPACK_ENABLE_DOWNLOAD_PROMPT: "0" },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`yarn build:obsidian exited with ${result.status}`);
}

const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

/**
 * Build (optionally) and copy the fork's Obsidian artifacts and declarations.
 * Returns the SOURCE.json record that was written.
 */
export function vendorExcalidraw({
  forkRoot,
  vendorRoot,
  build = true,
  runBuild = defaultRunBuild,
  now = () => new Date(),
}) {
  if (typeof forkRoot !== "string" || !forkRoot) throw new Error("forkRoot is required");
  if (typeof vendorRoot !== "string" || !vendorRoot) throw new Error("vendorRoot is required");
  const fork = resolve(forkRoot);
  const vendor = resolve(vendorRoot);
  // Guard the recursive deletes below against a mistyped target.
  if (basename(vendor) !== "excalidraw" || basename(dirname(vendor)) !== "vendor")
    throw new Error(`Vendor target must end in vendor/excalidraw, got ${vendor}`);
  const pkg = join(fork, "packages/excalidraw");
  const manifestPath = join(pkg, "package.json");
  if (!existsSync(manifestPath)) throw new Error(`No fork package at ${pkg}`);
  const manifest = vendoredManifest(JSON.parse(readFileSync(manifestPath, "utf8")));

  assertClean(fork, "before vendoring");
  if (build) {
    runBuild(pkg);
    assertClean(fork, "after building");
  }

  const sources = obsidianArtifacts.map((name) => join(pkg, "dist/obsidian", name));
  const required = [...sources, join(pkg, "types/excalidraw/index.d.ts")];
  const missing = required.filter((path) => !existsSync(path));
  if (missing.length) throw new Error(`Fork build output missing: ${missing.join(", ")}`);

  const record = {
    package: manifest.name,
    version: manifest.version,
    repository: git(fork, "remote", "get-url", "origin"),
    branch: git(fork, "rev-parse", "--abbrev-ref", "HEAD"),
    commit: git(fork, "rev-parse", "HEAD"),
    built: Boolean(build),
    builtAt: now().toISOString(),
    artifacts: obsidianArtifacts.map((name, index) => ({
      name,
      bytes: statSync(sources[index]).size,
      sha256: sha256(sources[index]),
      tracked: trackedArtifacts.includes(name),
    })),
  };

  rmSync(join(vendor, "types"), { recursive: true, force: true });
  rmSync(join(vendor, "dist"), { recursive: true, force: true });
  mkdirSync(join(vendor, "dist/obsidian"), { recursive: true });
  obsidianArtifacts.forEach((name, index) =>
    copyFileSync(sources[index], join(vendor, "dist/obsidian", name)),
  );
  cpSync(join(pkg, "types"), join(vendor, "types"), { recursive: true });
  writeFileSync(join(vendor, "package.json"), JSON.stringify(manifest, null, 2) + "\n");
  writeFileSync(join(vendor, "SOURCE.json"), JSON.stringify(record, null, 2) + "\n");
  return record;
}

function parseArgs(argv) {
  const options = { fork: undefined, build: true };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--skip-build") options.build = false;
    else if (argv[i] === "--fork" && argv[i + 1]) options.fork = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return options;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const options = parseArgs(process.argv.slice(2));
  const record = vendorExcalidraw({
    forkRoot: options.fork ? resolve(root, options.fork) : siblingForkRoot(root),
    vendorRoot: join(root, "vendor/excalidraw"),
    build: options.build,
  });
  process.stdout.write(
    `Vendored ${record.package}@${record.version} from ${record.branch} ${record.commit.slice(0, 10)}\n`,
  );
  for (const artifact of record.artifacts)
    process.stdout.write(`  ${artifact.name} ${artifact.bytes} B${artifact.tracked ? "" : " (untracked)"}\n`);
}
