import presetAttributify from "@unocss/preset-attributify";
import presetWebFonts from "@unocss/preset-web-fonts";
import presetWind4 from "@unocss/preset-wind4";

import { defineConfig } from "unocss";
import { COLORS } from "./src/utils/constants";

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetWebFonts({
      provider: "fontshare",
      fonts: {
        nunito: "Nunito",
        supreme: "Supreme",
      },
    }),
  ],
  preflights: [
    {
      getCSS: ({ theme }) => `
        html {
          font-family: ${theme.fontFamily.supreme};
        }
      `,
    },
  ],

  theme: {
    fontFamily: {
      supreme:
        "Supreme, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    },
    colors: {
      lTheme: {
        ...COLORS.lTheme,
      },
      dTheme: {
        ...COLORS.dTheme,
      },
    },
  },
});
