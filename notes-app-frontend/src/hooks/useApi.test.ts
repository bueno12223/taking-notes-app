import { renderHook, waitFor } from "@testing-library/react";
import { useApi } from "./useApi";
import { fetchAuthSession } from "aws-amplify/auth";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("aws-amplify/auth", () => ({
  fetchAuthSession: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/lib/error-mapping", () => ({
  getFriendlyErrorMessage: vi.fn((err) => (err instanceof Error ? err.message : "Friendly Error")),
}));

describe("useApi", () => {
  const mockToken = "fake-token";
  const mockData = { id: 1, title: "Test Note" };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    (fetchAuthSession as any).mockResolvedValue({
      tokens: {
        accessToken: {
          toString: () => mockToken,
        },
      },
    });
  });

  it("attaches Authorization header to every request", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });
    vi.stubGlobal("fetch", mockFetch);

    renderHook(() => useApi("/test-endpoint/"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/test-endpoint/"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });
  });

  it("sets isLoading to true during fetch and false after", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => mockData
      }), 10))
    ));

    const { result } = renderHook(() => useApi("/test-endpoint/"));

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 1000 });
    expect(result.current.data).toEqual(mockData);
  });

  it("sets error when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      statusText: "Not Found",
      json: async () => ({ error: "Specific Backend Error" }),
    }));

    const { result } = renderHook(() => useApi("/test-endpoint/"));

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("does not call execute on mount when lazy: true", () => {
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useApi("/test-endpoint/", { lazy: true }));

    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
