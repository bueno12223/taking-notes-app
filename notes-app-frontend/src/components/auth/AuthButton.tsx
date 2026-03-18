interface AuthButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function AuthButton({ label, onClick, type = "button" }: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full flex items-center justify-center py-[12px] px-[16px] rounded-[46px] text-[16px] font-bold font-sans cursor-pointer bg-transparent border border-brand-gold text-brand-gold"
    >
      {label}
    </button>
  );
}
