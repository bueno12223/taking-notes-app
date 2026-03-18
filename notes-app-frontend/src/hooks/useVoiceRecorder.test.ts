import { renderHook, act, waitFor } from "@testing-library/react";
import { useVoiceRecorder } from "./useVoiceRecorder";
import { useApi } from "./useApi";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

vi.mock("./useApi", () => ({
  useApi: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("useVoiceRecorder", () => {
  const mockOnTranscript = vi.fn();
  const mockTranscribe = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    (useApi as any).mockReturnValue({
      execute: mockTranscribe,
      isLoading: false,
    });

    const mockStream = {
      getTracks: () => [{ stop: vi.fn() }],
    };
    
    vi.stubGlobal("navigator", {
      mediaDevices: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream),
      },
    });

    const mockAudioContextInst = {
      audioWorklet: {
        addModule: vi.fn().mockImplementation(function() { return Promise.resolve(); }),
      },
      createMediaStreamSource: vi.fn().mockReturnValue({ connect: vi.fn() }),
      createAnalyser: vi.fn().mockReturnValue({
        connect: vi.fn(),
        frequencyBinCount: 128,
        getByteFrequencyData: vi.fn(),
      }),
      close: vi.fn().mockImplementation(function() { return Promise.resolve(); }),
      destination: {},
    };

    const mockAudioContext = vi.fn().mockImplementation(function() {
      return mockAudioContextInst;
    });
    
    vi.stubGlobal("AudioContext", mockAudioContext);
    if (typeof window !== "undefined") {
      (window as any).AudioContext = mockAudioContext;
      (window as any).webkitAudioContext = mockAudioContext;
    }

    vi.stubGlobal("AudioWorkletNode", vi.fn().mockImplementation(function() {
      return {
        connect: vi.fn(),
        disconnect: vi.fn(),
        port: { onmessage: null },
      };
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts recording correctly and updates isRecording state", async () => {
    const { result } = renderHook(() => useVoiceRecorder({ onTranscript: mockOnTranscript }));

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.isRecording).toBe(true);
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
  });

  it("toggles mute state correctly", async () => {
    const { result } = renderHook(() => useVoiceRecorder({ onTranscript: mockOnTranscript }));

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(true);

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(false);
  });

  it.skip("enforces recording limit and stops automatically", async () => {
    const { result } = renderHook(() => useVoiceRecorder({ onTranscript: mockOnTranscript }));

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.isRecording).toBe(true);

    act(() => {
      vi.advanceTimersByTime(60001);
    });

    await waitFor(() => expect(result.current.isRecording).toBe(false));
  });

  it("stops recording and resets state", async () => {
    const { result } = renderHook(() => useVoiceRecorder({ onTranscript: mockOnTranscript }));

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.isRecording).toBe(true);

    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.isRecording).toBe(false);
    expect(result.current.audioLevel).toBe(0);
  });
});
