import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
    const api = axios.create({
        baseURL: 'http://localhost:4000/api',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    // Attach the auth token (saved on login) to every request.
    api.interceptors.request.use((config) => {
        const token = useCookie('token');
        if (token.value) {
            config.headers.Authorization = `Bearer ${token.value}`;
        }
        return config;
    });

    // On 401 (expired/invalid token) send the user back to login.
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                const token = useCookie('token');
                token.value = null;
                navigateTo('/login');
            }
            return Promise.reject(error);
        }
    );

    return {
        provide: {
            axios: api,
        }
    }

})