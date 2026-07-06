import { defineStore } from "pinia";
import type { Student } from "~/types/student";

export const useStudentStore = defineStore("student", {
  state: () => ({
    students: [] as Student[],
    total: 0,
    loading: false,
    error: "" as string,
  }),
  getters: {
    activeCount: (state) =>
      state.students.filter((s) => s.status?.toLowerCase() === "active").length,
  },
  actions: {
    async fetchStudents() {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const response = await $axios.get("/get-all-students");
        // API shape: { data: [...] } (may be an array or { students: [...] })
        const payload = response.data?.data ?? [];
        this.students = Array.isArray(payload)
          ? payload
          : (payload.students ?? []);
        this.total = response.data?.total ?? this.students.length;
      } catch (error: any) {
        console.error("fetchStudents error:", error);
        this.error =
          error.response?.data?.message || "Failed to load students.";
      } finally {
        this.loading = false;
      }
    },

    async fetchStudentById(id: string) {
      const { $axios } = useNuxtApp();
      const response = await $axios.get(`/get-student-by-id/${id}`);
      return response.data?.data ?? null;
    },

    async createStudent(payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      // Backend requires: username, password, role, avatar, gender, status,
      // phone_number, dob, blood_group, height, weight, ethnicity,
      // first_name, last_name, parent_name, parent_number
      const response = await $axios.post("/register-student", payload);
      return response.data;
    },

    async updateStudent(id: string, payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const response = await $axios.put(`/update-student/${id}`, payload);
      return response.data;
    },

    async deleteStudent(id: string) {
      const { $axios } = useNuxtApp();
      const response = await $axios.delete(`/delete-student/${id}`);
      return response.data;
    },
  },
});
