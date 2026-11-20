/** Load actual drawing data; separators edited by linters must not eat text (#3013). */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../../src/shared/ExcalidrawData.ts", import.meta.url), "utf8");
const exports = {};
const dependencies = {
  "../constants/constants": { JSON_parse: JSON.parse, loadSceneFonts: async () => {} },
  "../utils/sceneDataUtils": { hasExportTheme: () => false },
  "./excalidrawMarkdownParsing": {
    getJSON: data => ({ pos: data.indexOf("# Drawing"), scene: data.slice(data.indexOf("# Drawing") + 10) }),
    parseMarkdownImages: () => new Map(),
    RE_EXCALIDRAWDATA_NOSECTION_OK: /^# Excalidraw Data/m,
    RE_TEXTELEMENTS_NOSECTION_OK: /^##? Text Elements/m,
    RE_EXCALIDRAWDATA_FALLBACK_2: /^# Excalidraw Data/m,
    RE_TEXTELEMENTS_FALLBACK_2: /^##? Text Elements/m,
  },
};
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports, require: name => dependencies[name] ?? {}, window: { setTimeout: () => 1, clearTimeout() {} } });

async function load(entries, separator) {
  const model = Object.create(exports.ExcalidrawData.prototype);
  Object.assign(model, {
    plugin: { settings: {} }, markdownImages: new Map(), files: new Map(), equations: new Map(), mermaids: new Map(),
    parse: async text => ({ parsed: text }), setTextMode: async () => true,
  });
  for (const method of ["setShowLinkBrackets", "setLinkPrefix", "setUrlPrefix", "setAutoexportPreferences", "setembeddableThemePreference", "initializeNonInitializedFields", "findNewTextElementsInScene", "findNewElementLinksInScene"]) model[method] = () => {};
  const elements = entries.map(([id, text]) => ({ id, type: "text", text, rawText: text }));
  const data = "# Excalidraw Data\n\n## Text Elements\n" + entries.map(([id, text]) => `${text} ^${id}${separator}`).join("") + "# Drawing\n" + JSON.stringify({ elements, appState: {} });
  assert.equal(await model.loadData(data, { path: "fixture.md" }, "raw"), true);
  return model;
}

for (const separator of ["\n", "\n\n", "\n\n\n\n"]) {
  test(`text survives ${separator.length} newline separator(s), including single-character list markers`, async () => {
    const entries = [["abcd1234", "+"], ["efgh5678", "+"], ["ijkl9012", "- item\n* item\n1. item"], ["mnop3456", "[[note|label]]"]];
    const model = await load(entries, separator);
    for (const [id, text] of entries) {
      assert.equal(model.textElements.get(id).raw, text);
      assert.equal(model.scene.elements.find(el => el.id === id).rawText, text);
    }
  });
}

/** KuszCanvas: the engine renders inline Markdown, so the plugin must hand its markers through untouched. */
const MARKDOWN_SAMPLE = "**bold** __strong__ *it* _em_ ~~gone~~ ==mark== <u>under</u> `code` #tag snake_case_name\n- item\n> quote";

const textUtilsExports = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL("../../src/utils/textUtils.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: textUtilsExports, require: () => ({}) });

const parserModel = () => Object.assign(Object.create(exports.ExcalidrawData.prototype), {
  plugin: { settings: { parseTODO: false } }, linkPrefix: "", urlPrefix: "", showLinkBrackets: true,
});

test("load keeps inline Markdown markers in raw and scene text", async () => {
  const model = await load([["mdmd1234", MARKDOWN_SAMPLE]], "\n\n");
  assert.equal(model.textElements.get("mdmd1234").raw, MARKDOWN_SAMPLE);
  assert.equal(model.scene.elements.find(el => el.id === "mdmd1234").rawText, MARKDOWN_SAMPLE);
});

test("quickParse and parse keep inline Markdown markers", async () => {
  const model = parserModel();
  // results come from the vm realm: compare fields, not prototypes
  const [quick, quickLink] = model.quickParse(MARKDOWN_SAMPLE);
  assert.equal(quick, MARKDOWN_SAMPLE);
  assert.equal(quickLink, null);
  const { parsed, link } = await model.parse(MARKDOWN_SAMPLE);
  assert.equal(parsed, MARKDOWN_SAMPLE);
  assert.equal(link, null);
});

test("quickParse keeps markers around a link", () => {
  const [parsed, link] = parserModel().quickParse("**see [[note|label]]** ==now==");
  assert.equal(parsed, "**see [[label]]** ==now==");
  assert.equal(link, "[[note]]");
});

// Tokens longer than lineLen are split mid-word (any word, not only Markdown): keep them shorter here.
test("wrapTextAtCharLength breaks only at whitespace, leaving markers whole", () => {
  const text = "**bold words here** and ==highlighted text== with <u>underline</u> #tag";
  const wrapped = textUtilsExports.wrapTextAtCharLength(text, 20, false);
  assert.ok(wrapped.includes("\n"));
  assert.equal(wrapped.replaceAll("\n", " "), text);
});
