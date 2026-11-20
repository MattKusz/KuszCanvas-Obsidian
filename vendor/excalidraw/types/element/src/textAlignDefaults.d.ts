import type { ExcalidrawElement, ExcalidrawTextElement, TextAlign, VerticalAlign } from "./types";
export declare const getDefaultBoundTextAlign: (container: ExcalidrawElement) => Readonly<{
    textAlign: TextAlign;
    verticalAlign: VerticalAlign;
}>;
/**
 * Whether a text-alignment pick becomes the default for new loose text:
 * with no text targeted (it sets the tool default) or when it reaches at
 * least one loose text — never for labels alone.
 *
 * @param targets the text elements the pick is applied to
 */
export declare const shouldRememberTextAlign: (targets: readonly ExcalidrawTextElement[]) => boolean;
