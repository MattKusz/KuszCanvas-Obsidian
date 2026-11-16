import { Emitter } from "@excalidraw/common";
export type HeldModifiers = Readonly<{
    alt: boolean;
    shift: boolean;
    /** Ctrl, or Cmd on macOS */
    ctrlOrCmd: boolean;
}>;
/**
 * The modifier keys held over the editor, synced from the flags of its
 * keyboard and pointer events. Kept out of appState so that pressing one
 * re-renders only its subscribers (e.g. the hint).
 */
export declare class AppModifiers {
    private held;
    /** fires with a new snapshot whenever a modifier is pressed or released */
    readonly onChange: Emitter<[held: Readonly<{
        alt: boolean;
        shift: boolean;
        /** Ctrl, or Cmd on macOS */
        ctrlOrCmd: boolean;
    }>]>;
    get: () => HeldModifiers;
    /**
     * A hook re-rendering on the held modifiers: all of them, or with
     * `modifier`, only on that one being pressed or released.
     */
    useHeld(): HeldModifiers;
    useHeld(modifier: keyof HeldModifiers): boolean;
    sync: (event: {
        altKey: boolean;
        shiftKey: boolean;
        ctrlKey: boolean;
        metaKey: boolean;
    }) => void;
    /** releases them all — e.g. on blur, as Alt+Tab never delivers the keyup */
    reset: () => void;
    private set;
}
