/**
 * Mapping of category values to Tailwind classes for background (50% opacity) and borders.
 * As per Figma export (notes_form.css), both cards and editor use 0.5 opacity.
 */
export const CATEGORY_STYLES: Record<string, string> = {
  "brand-peach": "bg-brand-peach/50 border-brand-peach",
  "brand-cream": "bg-brand-cream/50 border-brand-cream",
  "brand-sage": "bg-brand-sage/50 border-brand-sage",
  "brand-teal": "bg-brand-teal/50 border-brand-teal",
};

/**
 * Mapping of category values to Tailwind classes for background (50% opacity) and borders.
 * Shared with editor styles as per Figma exports.
 */
export const CATEGORY_CARD_STYLES: Record<string, string> = {
  "brand-peach": "bg-brand-peach/50 border-brand-peach",
  "brand-cream": "bg-brand-cream/50 border-brand-cream",
  "brand-sage": "bg-brand-sage/50 border-brand-sage",
  "brand-teal": "bg-brand-teal/50 border-brand-teal",
};

/**
 * Debounce delay for the autosave logic in milliseconds.
 */
export const AUTOSAVE_DELAY = 1000;
