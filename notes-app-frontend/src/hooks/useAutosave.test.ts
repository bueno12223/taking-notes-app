import { renderHook, act, waitFor } from "@testing-library/react";
import { useAutosave, AutosaveFields } from "./useAutosave";
import { useApi } from "./useApi";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

vi.mock("./useApi", () => ({
  useApi: vi.fn(),
}));

describe("useAutosave", () => {
  const mockApiExecute = vi.fn();
  const mockOnSaveSuccess = vi.fn();

  const defaultData: AutosaveFields = {
    title: "Test Note",
    content: { type: "doc", content: [{ type: "paragraph", text: "Hello" }] },
    category: "1",
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    (useApi as any).mockReturnValue({
      execute: mockApiExecute,
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not save when data is incomplete", async () => {
    const incompleteData: AutosaveFields = { title: " ", content: {}, category: "" };

    renderHook(() => useAutosave({
      noteId: null,
      data: incompleteData,
      onSaveSuccess: mockOnSaveSuccess
    }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(mockApiExecute).not.toHaveBeenCalled();
  });

  it("calls POST on mount when no noteId is provided", async () => {
    renderHook(() => useAutosave({
      noteId: null,
      data: defaultData,
      onSaveSuccess: mockOnSaveSuccess
    }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    expect(mockApiExecute).toHaveBeenCalled();
  });

  it("calls PATCH when data changes and noteId is provided", async () => {
    const { rerender } = renderHook(
      ({ data }) => useAutosave({ noteId: 123, data, onSaveSuccess: mockOnSaveSuccess }),
      { initialProps: { data: defaultData } }
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockApiExecute).not.toHaveBeenCalled();

    rerender({ data: { ...defaultData, title: "Updated Title" } });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    expect(mockApiExecute).toHaveBeenCalled();
  });

  it("debounces multiple changes", async () => {
    const { rerender } = renderHook(
      ({ data }) => useAutosave({ noteId: null, data, onSaveSuccess: mockOnSaveSuccess }),
      { initialProps: { data: defaultData } }
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    rerender({ data: { ...defaultData, title: "Updated Title" } });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    expect(mockApiExecute).toHaveBeenCalled();
  });

  it("transitions saveStatus correctly", async () => {
    mockApiExecute.mockResolvedValue({ id: 123, updated_at: new Date().toISOString() });

    const { result, rerender } = renderHook(
      ({ data }) => useAutosave({ noteId: 123, data, onSaveSuccess: mockOnSaveSuccess }),
      { initialProps: { data: defaultData } }
    );

    expect(result.current.saveStatus).toBe("idle");

    rerender({ data: { ...defaultData, title: "Changed" } });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    expect(result.current.saveStatus).toBe("saved");
  });
});
