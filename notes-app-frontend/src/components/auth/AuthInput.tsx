"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  type: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function AuthInput({
  type,
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  error,
}: AuthInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const resolvedType = type === "password" && passwordVisible ? "text" : type;

  const toggleVisibility = () => setPasswordVisible((prev) => !prev);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className="flex flex-row items-center w-full rounded-[6px] px-[20px] py-[10px] gap-2 border border-brand-gold"
      >
        <input
          type={resolvedType}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          className="flex-1 text-[12px] font-normal bg-transparent outline-none font-sans text-black placeholder:text-black/50"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="flex-shrink-0 text-brand-gold"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-red-500 text-[11px] font-sans">{error}</span>
      )}
    </div>
  );
}
