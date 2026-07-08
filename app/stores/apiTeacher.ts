import { defineStore } from "pinia";
import type { Teacher } from "~/types/teacher";

export const useTeacherStore = defineStore("teacher", {
  state: () => ({
    teachers: [] as Teacher[],
    total: 0,
    loading: false,
    error: "" as string,
  }),
  getters: {
    activeCount: (state) =>
      state.teachers.filter((t) => t.status?.toLowerCase() === "active").length,
  },
  actions: {
    async fetchTeachers(limit = 10, page = 1) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const response = await $axios.get(
          `/get-all-teachers?limit=${limit}&page=${page}`
        );
        // API shape: { data: { teachers: [...], pagination: { total } } }
        const payload = response.data?.data ?? {};
        this.teachers = payload.teachers ?? [];
        this.total = payload.pagination?.total ?? this.teachers.length;
      } catch (error: any) {
        console.error("fetchTeachers error:", error);
        this.error =
          error.response?.data?.message || "Failed to load teachers.";
      } finally {
        this.loading = false;
      }
    },

    async fetchTeacherById(id: string) {
      const { $axios } = useNuxtApp();
      const response = await $axios.get(`/get-teacher-by-id/${id}`);
      return response.data?.data;
    },

    async createTeacher(payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      // Backend requires: full_name, gender, dob, password, username
      const response = await $axios.post("/register-teacher", payload);
      return response.data;
    },

    async updateTeacher(id: string, payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      // Backend accepts: full_name, gender, dob, phone_number, avatar, role, status
      const response = await $axios.put(`/update-teacher/${id}`, payload);
      return response.data;
    },

    async deleteTeacher(id: string) {
      const { $axios } = useNuxtApp();
      const response = await $axios.delete(`/delete-teacher/${id}`);
      return response.data;
    },
  },
});
