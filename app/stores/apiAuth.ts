import { navigateTo, useCookie } from 'nuxt/app';
import { defineStore } from 'pinia'

interface Profile {
    id: number;
    username: string;
    email: string;
    phone: string;
    status: string;
    avatar: string;
    role: string;
    code: string;
}

export const useApiAuthStore = defineStore('apiAuth', {
    state: () => ({
        authenticated: false,
        profile: {} as Profile,
    }),
    actions: {
        async login(user: any, password: any) {
           
            try {
                  const token = useCookie('token');
                    const userId = useCookie('id');
                    const userRole = useCookie('role');
                    const userPhone = useCookie('phone');
                    const email = useCookie('email');

                const {$axios} = useNuxtApp();

                const response = await $axios.post('/login', {
                    user: user,
                    password: password,
                });


                if (response.status === 200) {
                    this.authenticated = true;
                    this.profile = response.data;
                   
                  
                    // Clear all cookies
                    token.value = response.data.token;
                    userId.value = response.data.id;
                    userRole.value = response.data.role;
                    userPhone.value = response.data.phone;
                    email.value = response.data.email;

                    this.authenticated = false;
                    this.profile = {} as Profile;
                     navigateTo('/');


                    return navigateTo('/');
                }
                else {
                    this.authenticated = false;
                    this.profile = {} as Profile;
                    navigateTo('/login');
                }

                
            } catch (error) {
                
            }
             
        },

        logout() {
            const token = useCookie('token');
            const userId = useCookie('id');
            const userRole = useCookie('role');
            const userPhone = useCookie('phone');
            const email = useCookie('email');
            // Clear all cookies
            token.value = null;
            userId.value = null;
            userRole.value = null;
            userPhone.value = null;
            email.value = null;

            this.authenticated = false;
            this.profile = {} as Profile;

            return navigateTo('/login');
        },
    },
})