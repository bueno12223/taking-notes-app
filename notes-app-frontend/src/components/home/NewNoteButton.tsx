interface NewNoteButtonProps {
  onClick?: () => void;
}

export default function NewNoteButton({ onClick }: NewNoteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-[39px] right-[23px] flex flex-row items-center px-4 py-3 gap-[6px] border border-brand-gold rounded-[46px] font-sans font-bold text-[16px] text-brand-gold hover:bg-brand-gold/20 transition-colors z-10"
    >
      + New Note
    </button>
  );
}
