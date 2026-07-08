import { defineStore } from "pinia";

// Weekly class timetable. Admins save/clear cells; teachers & students only read.
export const useScheduleStore = defineStore("schedule", {
  state: () => ({
    periods: [] as any[],
    cells: [] as any[],
    loading: false,
    error: "" as string,
  }),
  actions: {
    // Period rows (P1..Pn) — the "hours" down the left of the grid.
    async fetchPeriods() {
      const { $axios } = useNuxtApp();
      try {
        const res = await $axios.get("/get-all-periods");
        this.periods = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchPeriods error:", error);
      }
    },

    // All timetable cells for one class + academic year.
    async fetchSchedule(classroom_id: string, academic_year_id: string) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/get-class-schedule", {
          params: { classroom_id, academic_year_id },
        });
        this.cells = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchSchedule error:", error);
        this.error =
          error.response?.data?.message || "Failed to load schedule.";
        this.cells = [];
      } finally {
        this.loading = false;
      }
    },

    // All timetable cells for one teacher (across their classes) + year. Each
    // cell also carries its classroom (tb_classroom) so the grid can show which
    // room/class the teacher teaches each period.
    async fetchTeacherSchedule(teacher_id: string, academic_year_id: string) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/get-teacher-schedule", {
          params: { teacher_id, academic_year_id },
        });
        this.cells = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchTeacherSchedule error:", error);
        this.error =
          error.response?.data?.message || "Failed to load schedule.";
        this.cells = [];
      } finally {
        this.loading = false;
      }
    },

    async saveCell(payload: {
      classroom_id: string;
      academic_year_id: string;
      period_id: string;
      day_of_week: string;
      teaching_assignment_id: string;
    }) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/save-class-schedule", payload);
      return res.data;
    },

    async deleteCell(id: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.delete(`/delete-class-schedule/${id}`);
      return res.data;
    },
  },
});
