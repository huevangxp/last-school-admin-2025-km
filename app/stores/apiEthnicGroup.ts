import { defineStore } from "pinia";
import type { EthnicGroup } from "~/types/athnic.group";
export const useEthnicGroupStore = defineStore("ethnicGroup", {
  state: () => ({
    ethnicGroups: [] as EthnicGroup[],
    total: 0,
    ethnicGroup: {} as EthnicGroup,
  }),
  actions: {
    async fetchEthnicGroups(limit: number, offset: number) {
      const { $axios } = useNuxtApp();
      try {
        const response = await $axios.get(
          `/ethnic-group?limit=${limit}&offset=${offset}`
        );
        this.ethnicGroups = response.data.data;
        this.total = response.data.total;
      } catch (error) {
        console.log(error);
      }
    },
    async createEthnicGroup(data: { title: string }) {
      const { $axios } = useNuxtApp();
      try {
        await $axios.post("/ethnic-group", data);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async updateEthnicGroup(id: number, data: { title: string }) {
      const { $axios } = useNuxtApp();
      try {
        await $axios.put(`/ethnic-group/${id}`, data);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getEthnicGroupById(id: number) {
      const { $axios } = useNuxtApp();
      try {
        const response = await $axios.get(`/ethnic-group/${id}`);
        this.ethnicGroup = response.data.data;
        return response.data.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async deleteEthnicGroup(id: number) {
      const { $axios } = useNuxtApp();
      try {
        await $axios.delete(`/ethnic-group/${id}`);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
});
