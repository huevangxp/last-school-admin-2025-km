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

        const response = await $axios.post('/login-teacher', {
            username: user,
            password: password,
        });

        if (response.status === 200 && response.data) {
            // Set authentication state
            this.authenticated = true;
            this.profile = response.data;
            
            // Define cookie options once
            const cookieOptions = {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                secure: true, // HTTPS only in production
                sameSite: 'lax' as const, // 'strict' might cause issues with redirects
                path: '/'
            };
            
            // Store credentials in cookies
            // Note: httpOnly can only be set server-side in Nuxt
            const token = useCookie('token', cookieOptions);
            const userId = useCookie('id', cookieOptions);
            const userRole = useCookie('role', cookieOptions);
            const userPhone = useCookie('phone', cookieOptions);
            const email = useCookie('email', cookieOptions);

            // Set cookie values
            token.value = response.data.token;
            userId.value = String(response.data.id);
            userRole.value = response.data.role;
            userPhone.value = response.data.phone;
            email.value = response.data.email;

            console.log('Login successful, token saved', response.data.token);

            // Navigate to home page
            return navigateTo('/');
        } else {
            // Login failed
            this.authenticated = false;
            this.profile = {} as Profile;
            throw new Error('Login failed');
        }
        
    } catch (error: any) {
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
        
        // Return error message for UI handling
        return {
            error: true,
            message: error.response?.data?.message || 'Login failed. Please check your credentials.'
        };
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