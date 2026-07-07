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
            primary: "#0A3154", // Navy (brand)
            // Navy tints kept consistent with the primary so accent backgrounds
            // (avatars, chips, logo tile) read as navy, not teal.
            "primary-lighten-5": "#E6ECF2", // Very light navy
            "primary-lighten-4": "#C2D0DE", // Light navy
            "primary-darken-1": "#082741", // Darker navy
            "primary-darken-2": "#06202F", // Darkest navy
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
