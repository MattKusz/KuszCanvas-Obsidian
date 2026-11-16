import type { RenderEnvironment } from "@excalidraw/element";
import type { ChartElements, Spreadsheet } from "./charts.types";
export declare const renderBarChart: (spreadsheet: Spreadsheet, x: number, y: number, colorSeed?: number, renderEnvironment?: RenderEnvironment) => ChartElements;
