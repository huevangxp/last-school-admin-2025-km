import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
    const apiBase = useRuntimeConfig().public.apiBase as string;
    const api = axios.create({
        baseURL: `${apiBase}/api`,
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
    //
    // The login endpoints are exempt: they answer 401 for both "no such user"
    // and "wrong password" (so the API can't be used to enumerate accounts), and
    // the auth store *relies* on that 401 to fall through from /login-teacher to
    // /login-student. Without this exemption, every student sign-in would wipe
    // the token and redirect to /login mid-flow, racing the successful second
    // request — the caller already handles failures on these two routes.
    const isLoginRequest = (url?: string) =>
        !!url && (url.includes('/login-teacher') || url.includes('/login-student'));

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401 && !isLoginRequest(error.config?.url)) {
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