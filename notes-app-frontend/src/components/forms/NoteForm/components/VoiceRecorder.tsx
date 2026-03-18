"use client";

import React, { useEffect } from "react";
import { Mic, MicOff, Phone, Headphones, Loader2 } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { CATEGORY_DOT_COLORS } from "@/constants";

interface VoiceRecorderProps {
  category: string;
  onTranscript: (text: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

export default function VoiceRecorder({
  category,
  onTranscript,
  isActive,
  setIsActive
}: VoiceRecorderProps) {
  const {
    isRecording,
    isMuted,
    audioLevel,
    isTranscribing,
    startRecording,
    stopRecording,
    toggleMute,
  } = useVoiceRecorder({ onTranscript });

  useEffect(() => {
    if (isActive && !isRecording && !isTranscribing) {
      const timer = setTimeout(() => {
        setIsActive(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isActive, isRecording, isTranscribing, setIsActive]);

  const handleStart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(true);
    await startRecording();
  };

  const handleStop = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await stopRecording();
  };

  const bgColor = CATEGORY_DOT_COLORS[category] || "bg-brand-peach";
  const bars = Array.from({ length: 12 });

  if (!isActive && !isTranscribing) {
    return (
      <div 
        onClick={handleStart}
        className="absolute bottom-5 right-5 flex items-center justify-center w-[57px] h-[57px] bg-[#2C2C2C] border border-[#2C2C2C] rounded-[32px] shadow-lg transition-all duration-300 z-50 pointer-events-auto cursor-pointer hover:opacity-80 text-white"
      >
        <Headphones size={20} />
      </div>
    );
  }

  return (
    <div
      className={`absolute bottom-5 right-5 flex items-center overflow-hidden h-[57px] w-[251px] px-3 ${bgColor} justify-between text-white border border-[#2C2C2C] rounded-[32px] shadow-lg transition-all duration-300 z-50 pointer-events-auto cursor-pointer`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/10"
      >
        {isMuted ? (
          <MicOff size={20} className="text-white/60" />
        ) : (
          <Mic size={20} className={isRecording ? 'animate-pulse' : ''} />
        )}
      </button>

      <button
        onClick={handleStop}
        className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/10"
      >
        <Phone
          size={20}
          className="text-[#EB1C10] fill-[#EB1C10]"
          style={{ transform: 'rotate(135deg)' }}
        />
      </button>

      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden h-full">
        {isTranscribing ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <div className="flex items-center gap-[3px] h-6 w-full justify-center">
            {bars.map((_, i) => (
              <div
                key={i}
                className="w-[3px] bg-white rounded-full transition-all duration-75"
                style={{ 
                  height: isRecording && !isMuted
                    ? `${Math.max(20, Math.min(100, audioLevel * (0.3 + Math.random() * 0.7)))}%`
                    : "2px"
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center w-8 h-8">
        <Headphones size={20} />
      </div>
    </div>
  );
}
