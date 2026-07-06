import { defineStore } from 'pinia';
import type { Academic } from '../types/academic';  

export const useAcademicStore = defineStore('academic', {
    state: () => ({
        academics: [] as Academic[],
    }),
    actions: {
        async fetchAcademics() {
            const { $axios } = useNuxtApp();
            try {
                const response = await $axios.get('/get-all-academic-year');
                this.academics = response.data.data;
            } catch (error) {
                console.error(error);
            }
        },
        async updateAcademic(id: string, payload: Record<string, unknown>) {
            const { $axios } = useNuxtApp();
            // Backend requires: title, startDate, endDate, description, status
            const response = await $axios.put(`/update-academic-year/${id}`, payload);
            return response.data;
        },
        async deleteAcademic(id: string) {
            const { $axios } = useNuxtApp();
            const response = await $axios.delete(`/delete-academic-year/${id}`);
            return response.data;
        },
    },
});
