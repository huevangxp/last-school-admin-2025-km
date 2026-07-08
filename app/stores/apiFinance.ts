import { defineStore } from "pinia";

export const useFinanceStore = defineStore("finance", {
  state: () => ({
    finances: [] as any[],
    loading: false,
    error: "" as string,
  }),
  getters: {
    totalIncome(state): number {
      return state.finances
        .filter((f) => f.type === "income")
        .reduce((sum, f) => sum + Number(f.amount || 0), 0);
    },
    totalExpense(state): number {
      return state.finances
        .filter((f) => f.type === "expense")
        .reduce((sum, f) => sum + Number(f.amount || 0), 0);
    },
    balance(): number {
      return this.totalIncome - this.totalExpense;
    },
    pendingCount(state): number {
      return state.finances.filter((f) => f.status === "pending").length;
    },
  },
  actions: {
    async fetchFinances() {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/get-all-finances");
        this.finances = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchFinances error:", error);
        this.error =
          error.response?.data?.message || "Failed to load records.";
      } finally {
        this.loading = false;
      }
    },

    async getFinance(id: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.get(`/get-finance/${id}`);
      return res.data?.data;
    },

    async createFinance(payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/create-finance", payload);
      return res.data;
    },

    async updateFinance(id: string, payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.put(`/update-finance/${id}`, payload);
      return res.data;
    },

    async deleteFinance(id: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.delete(`/delete-finance/${id}`);
      return res.data;
    },
  },
});
