import { Headphones } from "lucide-react";

interface VoiceButtonProps {
  onClick?: () => void;
}

export default function VoiceButton({ onClick }: VoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Voice input"
      className="absolute bottom-5 right-5 flex items-center justify-center w-[57px] h-[57px] rounded-[32px] bg-[#2C2C2C] border border-[#2C2C2C] text-white hover:opacity-80 transition-opacity"
    >
      <Headphones size={20} />
    </button>
  );
}
