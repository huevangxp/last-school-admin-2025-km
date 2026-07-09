import { defineStore } from "pinia";

export interface AppSettings {
  id?: string;
  school_name: string;
  address: string;
  phone: string;
  semester: string;
  notif_email: boolean;
  notif_sms: boolean;
  notif_push: boolean;
  two_factor: boolean;
}

// Global, single-row app settings (school profile, notification prefs, 2FA
// flag). Read by any authenticated user; writes are admin-only on the backend.
export const useSettingStore = defineStore("setting", {
  state: () => ({
    settings: {
      school_name: "",
      address: "",
      phone: "",
      semester: "",
      notif_email: true,
      notif_sms: false,
      notif_push: true,
      two_factor: false,
    } as AppSettings,
    loading: false,
    error: "" as string,
  }),
  actions: {
    async fetchSettings() {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/settings");
        if (res.data?.data) this.settings = res.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to load settings.";
      } finally {
        this.loading = false;
      }
    },

    async updateSettings(payload: Partial<AppSettings>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.put("/settings", payload);
      if (res.data?.data) this.settings = res.data.data;
      return res.data;
    },
  },
});
