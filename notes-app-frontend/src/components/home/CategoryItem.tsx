interface CategoryItemProps {
  name: string;
  color: string;
  onClick?: () => void;
}

export default function CategoryItem({ name, color, onClick }: CategoryItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-row items-center w-full px-4 py-2 gap-2 hover:bg-black/5 transition-colors"
    >
      <span
        className="shrink-0 rounded-full"
        style={{ width: 11, height: 11, backgroundColor: color }}
      />
      <span className="font-sans font-normal text-[12px] text-black flex-1 text-left">
        {name}
      </span>
    </button>
  );
}
