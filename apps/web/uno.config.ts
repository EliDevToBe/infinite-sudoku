import presetAttributify from "@unocss/preset-attributify";
import presetWind4 from "@unocss/preset-wind4";
import { defineConfig } from "unocss";

export default defineConfig({
  presets: [presetWind4(), presetAttributify()],
  theme: {
    colors: {
      lTheme: {
        surface: "#F5F6F4",
        light: "#c0caba",
        font: "#2f3e46",
        accent: "#228cdb",
      },
      dTheme: {
        font: "#F5F6F4",
        light: "#cad2c5",
        surface: "#2f3e46",
        accent: "#228cdb",
      },
    },
  },
});
