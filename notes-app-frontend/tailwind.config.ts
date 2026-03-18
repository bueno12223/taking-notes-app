import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          peach: "#EF9C66",
          cream: "#FCDC94",
          sage: "#C8CFA0",
          teal: "#78ABA8",
          linen: "#FAF1E3",
          gold: "#957139",
          walnut: "#88642A",
        },
      },
      fontFamily: {
        serif: ["Inria Serif", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};

export default config;
