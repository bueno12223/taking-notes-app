---
trigger: always_on
---

Always use the design system color palette defined in `tailwind.config.ts` when writing styles in the Next.js app.

The `brand` palette tokens are:

| Token             | Value     | Semantic use                        |
|-------------------|-----------|-------------------------------------|
| `brand-peach`     | `#EF9C66` | Accents, highlights                 |
| `brand-cream`     | `#FCDC94` | Warm highlights                     |
| `brand-sage`      | `#C8CFA0` | Soft backgrounds, tags              |
| `brand-teal`      | `#78ABA8` | Secondary actions, icons            |
| `brand-linen`     | `#FAF1E3` | Page and surface backgrounds        |
| `brand-gold`      | `#957139` | Borders, interactive text, buttons  |
| `brand-walnut`    | `#88642A` | Headings and strong emphasis text   |

Rules:
- Always use a `brand-*` Tailwind class (e.g. `bg-brand-linen`, `text-brand-gold`, `border-brand-gold`) instead of arbitrary hex values or inline `style` attributes.
- Only use an arbitrary value (`bg-[#hex]` or `style={{ color: "#hex" }}`) when the color is genuinely one-off and explicitly approved as an exception — and document why in the code.
- If a needed color is missing from the palette, add it to `tailwind.config.ts` first, then use the token. Never add a color inline without adding it to the palette.
