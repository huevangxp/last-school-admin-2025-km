import { defineStore } from "pinia";

export const useEnrollmentStore = defineStore("enrollment", {
  state: () => ({
    enrollments: [] as any[],
    loading: false,
    error: "" as string,
  }),
  actions: {
    async fetchEnrollments(params: {
      class_id?: string;
      academic_year_id?: string;
      status?: string;
    }) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const query = new URLSearchParams(
          params as Record<string, string>
        ).toString();
        const res = await $axios.get(`/enrollments?${query}`);
        this.enrollments = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchEnrollments error:", error);
        this.error =
          error.response?.data?.message || "Failed to load enrollments.";
      } finally {
        this.loading = false;
      }
    },

    async enroll(payload: {
      student_id: string;
      class_id: string;
      academic_year_id: string;
    }) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/enroll", payload);
      return res.data;
    },

    async promote(payload: {
      student_ids: string[];
      to_class_id: string;
      academic_year_id: string;
    }) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/promote-students", payload);
      return res.data;
    },
  },
});
