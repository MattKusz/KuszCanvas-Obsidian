import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { ObsidianMermaidConfig } from "../../obsidianMermaidConfig";
import type { ObsidianMermaidService } from "../../obsidianExcalidrawHost";
import type { MermaidToExcalidrawLibProps } from "./types";
import type { BinaryFiles } from "../../types";
export declare const loadMermaidToExcalidrawLib: () => Promise<ObsidianMermaidService>;
export declare const loadMermaidLib: () => Promise<ObsidianMermaidService>;
/** zsviczian -- PR #472: yield to the plugin prompt when activation fails. */
export declare class MermaidHostUnavailableError extends Error {
}
/**
 * Adapts the stable host service to upstream's retryable dialog API.
 * Author: zsviczian. PR #472: Mermaid must remain Extras-provided, never imported
 * into the component. Keep host activation failure distinct from parse/chunk
 * failures and release a rejected cached API so the next attempt can recover.
 */
export declare const loadMermaidDialogAPI: (onChunkLoadError: (api: MermaidToExcalidrawLibProps["api"]) => void) => MermaidToExcalidrawLibProps["api"];
export declare const mermaidToExcalidraw: (mermaidDefinition: string, opts: ObsidianMermaidConfig) => Promise<{
    elements?: ExcalidrawElement[];
    files?: BinaryFiles;
    error?: string;
} | undefined>;
