import { defineStore } from "pinia";

export const useClassRoleStore = defineStore("classRole", {
  state: () => ({
    roles: [] as any[],
    loading: false,
    error: "" as string,
  }),
  actions: {
    async fetchClassRoles(params: {
      classroom_id?: string;
      academic_year_id?: string;
    }) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const query = new URLSearchParams(
          params as Record<string, string>
        ).toString();
        const res = await $axios.get(`/get-class-roles?${query}`);
        this.roles = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchClassRoles error:", error);
        this.error =
          error.response?.data?.message || "Failed to load class roles.";
      } finally {
        this.loading = false;
      }
    },

    async assignClassRole(payload: {
      classroom_id: string;
      student_id: string;
      academic_year_id: string;
      role: "monitor" | "committee" | "unit_head";
      unit_label?: string | null;
    }) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/assign-class-role", payload);
      return res.data;
    },

    async updateClassRole(id: string, payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.put(`/update-class-role/${id}`, payload);
      return res.data;
    },

    async deleteClassRole(id: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.delete(`/delete-class-role/${id}`);
      return res.data;
    },
  },
});
