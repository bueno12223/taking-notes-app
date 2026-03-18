import { describe, it, expect, vi } from "vitest";
import { 
  extractPlainText, 
  formatCardDate, 
  formatLastEdited, 
  isContentEmpty 
} from "./note-utils";

describe("note-utils", () => {
  describe("extractPlainText", () => {
    it("returns empty string for null or undefined", () => {
      expect(extractPlainText(null as any)).toBe("");
      expect(extractPlainText(undefined as any)).toBe("");
    });

    it("returns text if node has text property", () => {
      expect(extractPlainText({ text: "Hello world" })).toBe("Hello world");
    });

    it("extracts text from nested content", () => {
      const node = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Hello " }, { type: "text", text: "world" }]
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "!" }]
          }
        ]
      };
      expect(extractPlainText(node)).toBe("Hello world!");
    });

    it("returns empty string if no text or content", () => {
      expect(extractPlainText({ type: "paragraph" })).toBe("");
    });
  });

  describe("formatCardDate", () => {
    it('returns "today" for current date', () => {
      const today = new Date().toISOString();
      expect(formatCardDate(today)).toBe("today");
    });

    it('returns "yesterday" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatCardDate(yesterday.toISOString())).toBe("yesterday");
    });

    it("returns formatted month and day for older dates", () => {
      // Use a fixed date to avoid flakiness
      const olderDate = "2026-06-12T10:00:00Z";
      expect(formatCardDate(olderDate)).toBe("June 12");
    });
  });

  describe("formatLastEdited", () => {
    it("formats date with full month, day, year and time", () => {
      const date = "2026-06-12T10:30:00Z";
      // This might depend on the local timezone where tests run, 
      // but formatCardDate/formatLastEdited use new Date() which might be UTC in CI or local in dev.
      // We'll check the structure.
      const result = formatLastEdited(date);
      expect(result).toMatch(/June 12, 2026 at \d{1,2}:\d{2}[ap]m/);
    });
  });

  describe("isContentEmpty", () => {
    it("returns true for empty content", () => {
      expect(isContentEmpty({})).toBe(true);
      expect(isContentEmpty({ content: [] })).toBe(true);
    });

    it("returns true for nodes with only whitespace", () => {
      const node = {
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "   " }]
          }
        ]
      };
      expect(isContentEmpty(node)).toBe(true);
    });

    it("returns true for nested empty nodes", () => {
      const node = {
        content: [
          {
            type: "paragraph",
            content: [
              { 
                type: "bold", 
                content: [{ type: "text", text: "" }] 
              }
            ]
          }
        ]
      };
      expect(isContentEmpty(node)).toBe(true);
    });

    it("returns false for actual text", () => {
      const node = {
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Not empty" }]
          }
        ]
      };
      expect(isContentEmpty(node)).toBe(false);
    });

    it("returns false for nested actual text", () => {
      const node = {
        content: [
          {
            type: "paragraph",
            content: [
              { 
                type: "bold", 
                content: [{ type: "text", text: "Hi" }] 
              }
            ]
          }
        ]
      };
      expect(isContentEmpty(node)).toBe(false);
    });
  });
});
