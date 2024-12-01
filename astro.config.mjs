// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false }), solidJs()],
  base: import.meta.env.MODE === "development" ? "" : "quiz",
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
  },
});
