import { describe, it, expect } from "vitest";
import { formatToman } from "./currency";

describe("formatToman", () => {
  it("formats in Persian", () => {
    expect(formatToman(1000, "fa")).toContain("تومان");
  });

  it("formats in English", () => {
    expect(formatToman(1000, "en")).toContain("toman");
  });

  it("defaults to Persian", () => {
    expect(formatToman(1000)).toContain("تومان");
  });
});
