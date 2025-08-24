import presetAttributify from "@unocss/preset-attributify";
import presetWind4 from "@unocss/preset-wind4";
import { defineConfig } from "unocss";
import { COLORS } from "./src/utils/constants";

export default defineConfig({
  presets: [presetWind4(), presetAttributify()],
  theme: {
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
