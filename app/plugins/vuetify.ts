// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app: any) => {
  const vuetify = createVuetify({
    defaults: {
      VBtn: {
        style: "text-transform: none;",
        fontWeight: "bold",
        letterSpacing: "0.5px",
        rounded: "0", // square buttons (no rounded corners)
      },
      VCard: {
        elevation: 0,
      },
    },
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            primary: "#14b8a5", // Teal 500 (brand)
            // Light/dark teal tints kept consistent with the primary so accent
            // backgrounds (avatars, chips) read as teal, not blue.
            "primary-lighten-5": "#CCFBF1", // Teal 100
            "primary-lighten-4": "#99F6E4", // Teal 200
            "primary-darken-1": "#0D9488", // Teal 600
            "primary-darken-2": "#0F766E", // Teal 700
            secondary: "#1E293B", // Slate 800
            ts: "#64748B", // Slate 500
            bg: "#F8FAFC", // Slate 50
            surface: "#FFFFFF",
            accent: "#2DD4BF", // Teal 400 (was stray blue)
            error: "#EF4444",
            info: "#3B82F6",
            success: "#10B981",
            warning: "#F59E0B",
          },
        },
      },
    },
    // ... your configuration
  });
  app.vueApp.use(vuetify);
});
