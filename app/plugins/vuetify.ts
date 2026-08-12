// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app: any) => {
  const vuetify = createVuetify({
    // Corner radius is set once here rather than per-component. Everything
    // shares the "lg" (8px) radius; change these lines to reshape the whole app.
    defaults: {
      VBtn: {
        style: "text-transform: none;",
        fontWeight: "bold",
        letterSpacing: "0.5px",
        rounded: "lg",
      },
      VCard: {
        elevation: 0,
        rounded: "lg",
      },
      VSheet: { rounded: "lg" },
      VSnackbar: { rounded: "lg" },
      VBtnToggle: { rounded: "lg" },
      VAlert: { rounded: "lg" },
      VChip: { rounded: "lg" },
      VList: { rounded: "lg" },
      VListItem: { rounded: "lg" },
      VImg: { rounded: "lg" },
      VTable: { rounded: "lg" },
      VToolbar: { rounded: "lg" },
      VBanner: { rounded: "lg" },
      VExpansionPanel: { rounded: "lg" },
      VSkeletonLoader: { rounded: "lg" },
      VProgressLinear: { rounded: "lg" },
      // Form controls: Vuetify reads `rounded` on the field wrapper.
      VTextField: { rounded: "lg" },
      VTextarea: { rounded: "lg" },
      VSelect: { rounded: "lg" },
      VAutocomplete: { rounded: "lg" },
      VCombobox: { rounded: "lg" },
      VFileInput: { rounded: "lg" },
      // Avatars were square (rounded="0") across the app; "lg" softens them to
      // match everything else. Switch to "circle" here for round profile photos.
      VAvatar: { rounded: "lg" },
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
