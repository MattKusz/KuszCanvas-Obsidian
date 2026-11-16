/** a lazy-loaded chunk (e.g. one of Pele's diagram chunks) failed to load */
export declare const isModuleLoadError: (error: unknown) => boolean;
export declare const isMermaidParseSyntaxError: (message: string) => boolean;
/** the definition doesn't start with a (known) diagram type */
export declare const isMermaidUnknownDiagramError: (message: string) => boolean;
export declare const isMermaidAutoFixableError: (message: string) => boolean;
export type MermaidDiagramType = "flowchart" | "sequence" | "class" | "state" | "er";
/**
 * Index of the line that declares the diagram type: the first one that isn't
 * empty, a comment, a directive (`%%{...}%%`) or front matter (`---` block).
 */
export declare const getMermaidHeaderLineIndex: (sourceText: string) => number | null;
/** The diagram type the definition declares (of those Excalidraw converts). */
export declare const getMermaidDiagramType: (sourceText: string) => MermaidDiagramType | null;
export declare const isMermaidCaretLine: (line: string) => boolean;
export declare const getMermaidInactiveParticipant: (message: string) => string | null;
export declare const getMermaidErrorLineNumber: (message: string, sourceText?: string) => number | null;
/** A line closing a block that `end`s */
export declare const MERMAID_END_LINE: RegExp;
export declare const getMermaidEndBlockOpener: (type: MermaidDiagramType | null) => RegExp | null;
export declare const getMermaidSyntaxErrorGuidance: (message: string, sourceText?: string) => {
    summary: string;
    likelyCauses: string[];
} | null;
/** The parse error, without the tokens it expected */
export declare const formatMermaidParseErrorMessage: (message: string) => string;
