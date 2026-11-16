import type { ChartType } from "@excalidraw/element/types";
import type { RenderEnvironment } from "@excalidraw/element";
import { tryParseCells, tryParseNumber, tryParseSpreadsheet } from "./charts.parse";
import type { ChartElements, Spreadsheet } from "./charts.types";
export { type ParseSpreadsheetResult, type Spreadsheet, type SpreadsheetSeries, type ChartElements, } from "./charts.types";
export { isSpreadsheetValidForChartType } from "./charts.helpers";
export { tryParseCells, tryParseNumber, tryParseSpreadsheet };
export declare const renderSpreadsheet: (chartType: ChartType, spreadsheet: Spreadsheet, x: number, y: number, colorSeed?: number, renderEnvironment?: RenderEnvironment) => ChartElements | null;
