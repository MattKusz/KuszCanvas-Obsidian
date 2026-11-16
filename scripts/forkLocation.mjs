/** Default sibling checkout of the Excalidraw fork (GitHub: MattKusz/KuszCanvas). */
import { join, resolve } from "node:path";

export const FORK_SIBLING_DIRNAME = "KuszCanvas";

export function siblingForkRoot(pluginRoot) {
  if (typeof pluginRoot !== "string" || !pluginRoot)
    throw new Error("pluginRoot is required to locate the sibling fork");
  return join(resolve(pluginRoot, ".."), FORK_SIBLING_DIRNAME);
}
