import { defineStore } from "pinia";

export const useTeachingStore = defineStore("teaching", {
  state: () => ({
    assignments: [] as any[],
    myTeaching: [] as any[],
    loading: false,
    error: "" as string,
  }),
  actions: {
    // Admin: all teaching assignments (optionally filtered).
    async fetchAssignments(params: Record<string, string> = {}) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const query = new URLSearchParams(params).toString();
        const res = await $axios.get(`/get-teaching-assignments?${query}`);
        this.assignments = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchAssignments error:", error);
        this.error =
          error.response?.data?.message || "Failed to load assignments.";
      } finally {
        this.loading = false;
      }
    },

    // The logged-in user's teaching assignments (admins get all).
    async fetchMyTeaching(academicYearId?: string) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      try {
        const res = await $axios.get("/my-teaching", {
          params: academicYearId ? { academic_year_id: academicYearId } : {},
        });
        this.myTeaching = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchMyTeaching error:", error);
      } finally {
        this.loading = false;
      }
    },

    async createAssignment(payload: {
      teacher_id: string;
      subject_id: string;
      classroom_id: string;
      academic_year_id: string;
    }) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/create-teaching-assignment", payload);
      return res.data;
    },

    async deleteAssignment(id: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.delete(`/delete-teaching-assignment/${id}`);
      return res.data;
    },
  },
});
