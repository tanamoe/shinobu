import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["docs/content/**/*.md"],
  theme: {
    fontFamily: {
      sans: [
        ["Inter", ...defaultTheme.fontFamily.sans],
        {
          fontFeatureSettings: "'cv11'",
        },
      ],
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
