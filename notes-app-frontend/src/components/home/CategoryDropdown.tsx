"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import CategoryItem from "./CategoryItem";

interface Category {
  name: string;
  color: string;
}

interface CategoryDropdownProps {
  selected: Category;
  options: Category[];
  onSelect: (category: Category) => void;
}

export default function CategoryDropdown({ selected, options, onSelect }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (category: Category) => {
    onSelect(category);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-[7px] w-[225px]">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex flex-row items-center w-full px-[15px] py-[7px] gap-2 border border-brand-gold rounded-[6px]"
      >
        <span
          className="shrink-0 rounded-full"
          style={{ width: 11, height: 11, backgroundColor: selected.color }}
        />
        <span className="font-sans font-normal text-[12px] text-black flex-1 text-left">
          {selected.name}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-brand-gold shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-brand-gold shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col bg-brand-linen rounded-[8px] overflow-hidden w-full">
          {options.map((category) => (
            <CategoryItem
              key={category.name}
              name={category.name}
              color={category.color}
              onClick={() => handleSelect(category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
