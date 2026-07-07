import { defineStore } from "pinia";

export const useClassroomStore = defineStore("classroom", {
  state: () => ({
    classrooms: [] as any[],
    total: 0,
    gradeLevels: [] as any[],
    academicYears: [] as any[],
    loading: false,
    error: "" as string,
  }),
  getters: {
    // The most recent academic year: prefer an "active" one, otherwise the one
    // with the latest start_date. Used to default selectors to the current year.
    latestAcademicYear: (state): any => {
      if (!state.academicYears.length) return null;
      const sorted = [...state.academicYears].sort((a: any, b: any) => {
        const activeA = a.status === "active" ? 1 : 0;
        const activeB = b.status === "active" ? 1 : 0;
        if (activeA !== activeB) return activeB - activeA;
        return (
          new Date(b.start_date || 0).getTime() -
          new Date(a.start_date || 0).getTime()
        );
      });
      return sorted[0];
    },
    latestAcademicYearId(): string | null {
      return this.latestAcademicYear?.id ?? null;
    },
  },
  actions: {
    async fetchClassrooms(limit = 100) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get(`/get-all-classrooms?limit=${limit}`);
        this.classrooms = res.data?.data?.classrooms ?? [];
        this.total = res.data?.data?.pagination?.total ?? this.classrooms.length;
      } catch (error: any) {
        console.error("fetchClassrooms error:", error);
        this.error =
          error.response?.data?.message || "Failed to load classrooms.";
      } finally {
        this.loading = false;
      }
    },

    async fetchGradeLevels() {
      const { $axios } = useNuxtApp();
      try {
        const res = await $axios.get("/get-all-grade-level");
        this.gradeLevels = res.data?.data ?? [];
      } catch (error) {
        console.error("fetchGradeLevels error:", error);
      }
    },

    async fetchAcademicYears() {
      const { $axios } = useNuxtApp();
      try {
        const res = await $axios.get("/get-all-academic-year");
        this.academicYears = res.data?.data ?? [];
      } catch (error) {
        console.error("fetchAcademicYears error:", error);
      }
    },

    async createClassroom(payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/create-classroom", payload);
      return res.data;
    },

    async updateClassroom(id: string, payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.put(`/update-classroom/${id}`, payload);
      return res.data;
    },

    async deleteClassroom(id: string) {
      const { $axios } = useNuxtApp();
      // Hard delete so the row is actually removed (delete-classroom only
      // soft-deletes by flipping status to inactive).
      const res = await $axios.delete(`/hard-delete-classroom/${id}`);
      return res.data;
    },
  },
});
