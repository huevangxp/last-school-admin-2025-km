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
    },
});
