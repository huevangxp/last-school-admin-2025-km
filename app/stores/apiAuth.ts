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
     async login(user: string, password: string) {
    try {
        const { $axios } = useNuxtApp();

        const token = useCookie('token');
        const userId = useCookie('id');
        const userRole = useCookie('role');
        const userPhone = useCookie('phone');
        const email = useCookie('email');

        const response = await $axios.post('/login-teacher', {
            username: user,
            password: password,
        });
        

        if (response.status === 200 && response.data) {
            // Set authentication state
            this.authenticated = true;
            this.profile = response.data;
            
            // Store credentials in httpOnly cookies (server-side)
            const token = useCookie('token', {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                secure: true, // HTTPS only
                httpOnly: true, // Not accessible via JavaScript
                sameSite: 'strict' // CSRF protection
            });
            
            const userId = useCookie('id', {
                maxAge: 60 * 60 * 24 * 7,
                secure: true,
                httpOnly: true,
                sameSite: 'strict'
            });
            
            const userRole = useCookie('role', {
                maxAge: 60 * 60 * 24 * 7,
                secure: true,
                httpOnly: true,
                sameSite: 'strict'
            });
            
            const userPhone = useCookie('phone', {
                maxAge: 60 * 60 * 24 * 7,
                secure: true,
                httpOnly: true,
                sameSite: 'strict'
            });
            
            const email = useCookie('email', {
                maxAge: 60 * 60 * 24 * 7,
                secure: true,
                httpOnly: true,
                sameSite: 'strict'
            });

            console.log(response.data.token);

            // Set cookie values
            token.value = response.data.token;
            userId.value = response.data.id;
            userRole.value = response.data.role;
            userPhone.value = response.data.phone;
            email.value = response.data.email;

            // Navigate to home page
            navigateTo('/');
        } else {
            // Login failed
            this.authenticated = false;
            this.profile = {} as Profile;
            throw new Error('Login failed');
        }
        
    } catch (error) {
        // Handle error properly
        console.error('Login error:', error);
        
        // Clear authentication state
        this.authenticated = false;
        this.profile = {} as Profile;
        
        // Clear cookies on error
        const token = useCookie('token');
        const userId = useCookie('id');
        const userRole = useCookie('role');
        const userPhone = useCookie('phone');
        const email = useCookie('email');
        
        token.value = null;
        userId.value = null;
        userRole.value = null;
        userPhone.value = null;
        email.value = null;
        
        // Show error to user or navigate to login
        throw error; // Re-throw to allow caller to handle
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