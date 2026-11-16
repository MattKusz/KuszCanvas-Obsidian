import type { MermaidConfig } from "@excalidraw/mermaid-to-excalidraw";
/**
 * How Mermaid diagrams are converted: flowchart edges as elbow arrows, which
 * are easier to edit (unless the definition sets its own curve in its front
 * matter or `%%{init}%%`).
 */
export declare const MERMAID_TO_EXCALIDRAW_CONFIG: MermaidConfig;
/** heuristically checks whether the text may be a mermaid diagram definition */
export declare const isMaybeMermaidDefinition: (text: string) => boolean;
