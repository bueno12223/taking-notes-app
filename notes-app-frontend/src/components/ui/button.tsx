import { cn } from "@/lib/utils";
import React from "react";

/**
 * Interface for the Button component props.
 */
interface ButtonProps {
  /** The text displayed on the button. */
  label: string;
  /** Callback function executed when the button is clicked. */
  onClick?: () => void;
  /** If true, the button will take up the full width of its container. */
  fullWidth?: boolean;
  /** Optional icon element to display. */
  icon?: React.ReactNode;
  /** The position of the icon relative to the label. */
  iconPosition?: "left" | "right";
  /** The visual style variant of the button. */
  variant?: "default" | "ghost";
  /** If true, the button will be disabled. */
  disabled?: boolean;
  /** The HTML type attribute for the button. */
  type?: "button" | "submit";
}

/**
 * A reusable Button component designed for the notes app.
 */
export default function Button({
  label,
  onClick,
  fullWidth = false,
  icon,
  iconPosition = "left",
  variant = "default",
  disabled = false,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-[6px] rounded-[46px] px-4 py-3 font-sans font-bold text-[16px] transition-colors whitespace-nowrap",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "hover:bg-brand-gold/20 text-brand-gold",
        fullWidth ? "w-full" : "w-auto",
        variant === "default" ? "border border-brand-gold" : "border-none"
      )}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      {label}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}
