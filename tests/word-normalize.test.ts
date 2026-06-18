import { describe, expect, it } from "vitest";
import { normalizeTarget } from "@/lib/word-normalize";

describe("normalizeTarget", () => {
  it("keeps lowercase letters and hyphens when input has mixed punctuation", () => {
    expect(normalizeTarget("  Re-Define!!  ")).toBe("re-define");
  });

  it("returns an empty string when input has no valid target characters", () => {
    expect(normalizeTarget("!!! 123")).toBe("");
  });
});
