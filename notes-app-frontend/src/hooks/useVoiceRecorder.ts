"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useApi } from "./useApi";

interface UseVoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export interface UseVoiceRecorderReturn {
  isRecording: boolean;
  isMuted: boolean;
  audioLevel: number;
  isTranscribing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  toggleMute: () => void;
}

export function useVoiceRecorder({ onTranscript }: UseVoiceRecorderProps): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const apiOptions = useMemo(() => ({ lazy: true }), []);
  const { execute: transcribe, isLoading: isTranscribing } = useApi<{ transcript: string }>("/api/transcribe/", apiOptions);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const pcmBufferRef = useRef<ArrayBuffer[]>([]);
  const isMutedRef = useRef(false);
  const isRecordingRef = useRef(false);

  const stopRecordingAction = useCallback(async () => {
    if (!isRecordingRef.current) return;

    isRecordingRef.current = false;
    setIsRecording(false);
    setAudioLevel(0);

    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    workletNodeRef.current?.disconnect();
    audioContextRef.current?.close();

    const totalLength = pcmBufferRef.current.reduce((acc, curr) => acc + curr.byteLength, 0);
    if (totalLength < 16000) {
      toast.error("Recording too short");
      pcmBufferRef.current = [];
      return;
    }

    const finalPcm = new Uint8Array(totalLength);
    let offset = 0;
    pcmBufferRef.current.forEach((buffer) => {
      finalPcm.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    });

    const result = await transcribe({
      method: "POST",
      body: finalPcm.buffer,
    });

    if (result?.transcript) {
      onTranscript(result.transcript);
    }

    pcmBufferRef.current = [];
  }, [onTranscript, transcribe]);

  const stopRecordingRef = useRef(stopRecordingAction);
  useEffect(() => {
    stopRecordingRef.current = stopRecordingAction;
  }, [stopRecordingAction]);

  const MAX_RECORDING_TIME = 60000; // 60 seconds
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      await audioContext.audioWorklet.addModule('/audio-processor.js');

      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioContext, 'audio-processor');
      workletNodeRef.current = workletNode;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      pcmBufferRef.current = [];

      workletNode.port.onmessage = (event) => {
        if (!isRecordingRef.current || isMutedRef.current) return;

        if (event.data.type === 'audioData') {
          pcmBufferRef.current.push(event.data.pcm);

          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, curr) => acc + curr, 0) / dataArray.length;
          const normalizedLevel = Math.min(100, Math.floor((average / 128) * 100));
          setAudioLevel(normalizedLevel);
        } else if (event.data.type === 'silence') {
          stopRecordingRef.current();
        }
      };

      source.connect(analyser);
      analyser.connect(workletNode);
      workletNode.connect(audioContext.destination);

      setIsRecording(true);
      isRecordingRef.current = true;
      setIsMuted(false);
      isMutedRef.current = false;

      recordingTimeoutRef.current = setTimeout(() => {
        if (isRecordingRef.current) {
          toast.info("Recording reached 60s limit. Processing...");
          stopRecordingRef.current();
        }
      }, MAX_RECORDING_TIME);

    } catch (err) {
      toast.error("Could not access microphone");
      console.error(err);
    }
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      if (isRecordingRef.current) {
        stopRecordingRef.current();
      }
    };
  }, []);

  return {
    isRecording,
    isMuted,
    audioLevel,
    isTranscribing,
    startRecording,
    stopRecording: stopRecordingAction,
    toggleMute,
  };
}
