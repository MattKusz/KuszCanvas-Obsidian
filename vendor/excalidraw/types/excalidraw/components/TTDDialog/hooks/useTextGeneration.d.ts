import type { MermaidToExcalidrawLibProps, TTTDDialog } from "../types";
export declare const useTextGeneration: ({ onTextSubmit, mermaidToExcalidrawLib, }: {
    onTextSubmit: (props: TTTDDialog.OnTextSubmitProps) => Promise<TTTDDialog.OnTextSubmitRetValue>;
    mermaidToExcalidrawLib: MermaidToExcalidrawLibProps;
}) => {
    onGenerate: TTTDDialog.OnGenerate;
    handleAbort: () => void;
};
