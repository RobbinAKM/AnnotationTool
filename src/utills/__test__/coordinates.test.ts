import { describe, it, expect } from "vitest";
import { toPercentage, toPixel } from "../coordinates";

describe("Coordinate Math Utilities", () => {
  describe("toPercentage", () => {
    it("should correctly convert a pixel value to a relative percentage", () => {
      expect(toPercentage(500, 1000)).toBe(0.5);
    });

    it("should handle zero values safely", () => {
      expect(toPercentage(0, 1000)).toBe(0);
    });

    it("should round to 4 decimal places for clean telemetry data", () => {
      expect(toPercentage(100, 300)).toBe(0.3333333333333333);
    });
  });

  describe("toPixel", () => {
    it("should correctly convert a percentage back to absolute pixels", () => {
      expect(toPixel(0.5, 1000)).toBe(500);
    });

    it("should handle zero values safely", () => {
      expect(toPixel(0, 1000)).toBe(0);
    });
  });
});
