import { render, screen } from "@testing-library/react";
import AuthGuard from "./AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("AuthGuard", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
  });

  it("renders loading state while session is being checked", () => {
    (useAuth as any).mockReturnValue({ user: null, isLoading: true });

    render(
      <AuthGuard>
        <div data-testid="child">Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText(/Loading.../i)).toBeDefined();
    expect(screen.queryByTestId("child")).toBeNull();
  });

  it("redirects unauthenticated users to /login", () => {
    (useAuth as any).mockReturnValue({ user: null, isLoading: false });

    render(
      <AuthGuard>
        <div data-testid="child">Protected Content</div>
      </AuthGuard>
    );

    expect(mockPush).toHaveBeenCalledWith("/login");
    expect(screen.queryByTestId("child")).toBeNull();
  });

  it("renders children for authenticated users", () => {
    (useAuth as any).mockReturnValue({ user: { id: "1" }, isLoading: false });

    render(
      <AuthGuard>
        <div data-testid="child">Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.getByText(/Protected Content/i)).toBeDefined();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
