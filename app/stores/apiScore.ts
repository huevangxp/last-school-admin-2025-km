import { defineStore } from "pinia";

export const useScoreStore = defineStore("score", {
  state: () => ({
    scores: [] as any[],
    loading: false,
    saving: false,
    error: "" as string,
  }),
  actions: {
    async fetchScores(params: {
      academic_year_id?: string;
      subject_id?: string;
      student_id?: string;
      enrollment_id?: string;
      semester?: string;
      month?: string;
    }) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const query = new URLSearchParams(
          params as Record<string, string>
        ).toString();
        const res = await $axios.get(`/get-all-scores?${query}`);
        this.scores = res.data?.data?.scores ?? [];
      } catch (error: any) {
        console.error("fetchScores error:", error);
        this.error = error.response?.data?.message || "Failed to load scores.";
      } finally {
        this.loading = false;
      }
    },

    // Aggregate score sheet for a whole class (homeroom / admin report view).
    async fetchClassSheet(params: {
      classroom_id: string;
      academic_year_id: string;
      semester?: string;
      month?: string;
    }) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const query = new URLSearchParams(
          params as Record<string, string>
        ).toString();
        const res = await $axios.get(`/class-score-sheet?${query}`);
        return res.data?.data ?? { subjects: [], students: [] };
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to load sheet.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Save a whole grade sheet in one request (create or update per cell).
    async bulkUpsertScores(scores: Record<string, unknown>[]) {
      const { $axios } = useNuxtApp();
      this.saving = true;
      try {
        const res = await $axios.post("/bulk-upsert-scores", { scores });
        return res.data;
      } finally {
        this.saving = false;
      }
    },
  },
});
