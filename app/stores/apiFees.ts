import { defineStore } from "pinia";

export const useFeesStore = defineStore("fees", {
  state: () => ({
    fees: [] as any[],
    structures: [] as any[],
    summary: { students: 0, due: 0, collected: 0, outstanding: 0, unpaid: 0 } as any,
    loading: false,
    error: "" as string,
  }),
  actions: {
    async fetchStructures(academicYearId: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.get("/fee-structures", {
        params: { academic_year_id: academicYearId },
      });
      this.structures = res.data?.data ?? [];
      return this.structures;
    },

    async saveStructure(payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/fee-structure", payload);
      return res.data;
    },

    async generateFees(academicYearId: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/generate-fees", {
        academic_year_id: academicYearId,
      });
      return res.data?.data;
    },

    async fetchStudentFees(academicYearId: string, classId?: string) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/student-fees", {
          params: { academic_year_id: academicYearId, class_id: classId || undefined },
        });
        this.fees = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchStudentFees error:", error);
        this.error = error.response?.data?.message || "Failed to load fees.";
      } finally {
        this.loading = false;
      }
    },

    async fetchSummary(academicYearId: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.get("/fees-summary", {
        params: { academic_year_id: academicYearId },
      });
      this.summary = res.data?.data ?? this.summary;
      return this.summary;
    },

    async collectPayment(id: string, payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post(`/collect-fee/${id}`, payload);
      return res.data;
    },
  },
});
