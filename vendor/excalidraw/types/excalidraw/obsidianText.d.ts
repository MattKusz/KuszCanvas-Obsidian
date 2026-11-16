import type { ElementsMap, ExcalidrawTextElement, NonDeleted } from "@excalidraw/element/types";
import type App from "./components/App";
/**
 * Prepare an editor session with Obsidian's unparsed Markdown source.
 * Author: zsviczian. References: excalidraw#12186 / fork PR #455 and
 * obsidian-excalidraw-plugin/src/view/ExcalidrawView.ts:onBeforeTextEdit.
 * The rendered scene text can differ from the Markdown that the user edits,
 * so this must run before the shared WYSIWYG editor receives the element.
 */
export declare function prepareObsidianTextForEditing(app: App, element: NonDeleted<ExcalidrawTextElement>, isExistingElement: boolean, elementsMap: ElementsMap): NonDeleted<ExcalidrawTextElement>;
/**
 * Convert submitted Markdown into the host's display text and link metadata.
 * Author: zsviczian. References: excalidraw#12186 / fork PR #455 and
 * obsidian-excalidraw-plugin/src/view/ExcalidrawView.ts:onBeforeTextSubmit.
 * Keep the raw source even when Obsidian returns parsed display text. The
 * host setting is read at submission time so an open editor sees live changes.
 */
export declare function getObsidianTextSubmission(app: App, element: NonDeleted<ExcalidrawTextElement>, nextOriginalText: string, isDeleted: boolean, elementsMap: ElementsMap): {
    nextOriginalText: string;
    rawText: string;
    link: string | undefined;
    hasTextLink: boolean;
};
/**
 * Discard version-only changes from a raw-to-parsed Markdown round trip.
 * Author: zsviczian. Reference:
 * https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/2976
 * Preparing raw Markdown temporarily changes scene text and dimensions. Even
 * when submission restores every content property, the new version would make
 * history record an element delta and erase redo. Restore the pre-edit snapshot
 * only when all non-metadata properties match; actual edits, link changes and
 * geometry changes must retain normal history. Standalone editing is untouched.
 */
export declare function restoreObsidianTextAfterEditing(app: App, original: NonDeleted<ExcalidrawTextElement>): void;
/**
 * Merge explicit links when text changes container ownership.
 * Author: zsviczian. Reference: https://github.com/zsviczian/excalidraw/pull/465
 * Preserve the existing fork binding rule: distinct links retain container-first
 * order, equal links have one owner, and nullish fallback keeps empty strings.
 * The wrap action deletes/restores containers within its own undo transaction,
 * so the component must move their links along with the surviving text.
 */
export declare function mergeObsidianElementLinks(containerLink: string | null, textLink: string | null): string | null;
