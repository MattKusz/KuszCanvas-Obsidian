import assert from "node:assert/strict";
import test, { after } from "node:test";
import { sourceHarness } from "./sourceHarness.mjs";

// Boundary substitutes for the modules dynamicStyling.ts imports at runtime;
// only the pure frame-colour predicate is exercised here.
const graph = sourceHarness({
  "@zsviczian/colormaster": { default: () => { throw Error("colormaster is not used by this test"); } },
  "./excalidrawViewHelpers": { cloneElement: (element) => structuredClone(element) },
  "./utils": { addAppendUpdateCustomData: () => {} },
  "src/constants/constants": { CaptureUpdateAction: { NEVER: "NEVER" } },
  "./coreUtils": { errorlog: () => {} },
  "./styleUtils": { removeStyle: () => {}, setStyle: () => {} },
});
const { needsDynamicFrameColor } = await graph.importModule("src/utils/dynamicStyling.ts");
after(() => graph.close());

const frameColor = { stroke: "#111111", fill: "rgba(1, 2, 3, 0.2)", nameColor: "#222222" };
const frame = (customData, extra = {}) => ({ id: "f", type: "frame", customData, ...extra });

test("legacy frames take the dynamic frame colour until it matches", () => {
  assert.equal(needsDynamicFrameColor(frame(undefined), frameColor), true);
  assert.equal(needsDynamicFrameColor(frame({ frameColor: { ...frameColor, stroke: "#333333" } }), frameColor), true);
  assert.equal(needsDynamicFrameColor(frame({ frameColor: { ...frameColor } }), frameColor), false);
  assert.equal(needsDynamicFrameColor(frame(undefined, { frameRole: "marker" }), frameColor), true);
});

test("frames styled like rectangles keep their own colours", () => {
  assert.equal(needsDynamicFrameColor(frame({ frameStyle: "shape" }), frameColor), false);
  assert.equal(needsDynamicFrameColor(frame({ frameStyle: "shape", frameColor: { stroke: "#333333" } }), frameColor), false);
});

test("non-frames are never recoloured", () => {
  for (const element of [null, undefined, "frame", { type: "magicframe" }, { type: "rectangle", customData: {} }]) {
    assert.equal(needsDynamicFrameColor(element, frameColor), false);
  }
});
