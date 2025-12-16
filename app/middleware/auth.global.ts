import { storeToRefs } from 'pinia';
import { useApiAuthStore } from '~/stores/apiAuth';

export default defineNuxtRouteMiddleware((to) => {
    console.log(to);
    const { authenticated } = storeToRefs(useApiAuthStore());
    const token = useCookie('token');

    if (token.value) {
        authenticated.value = true;
    }

    // If authenticated and trying to access login page, redirect to home
    if (token.value && (to?.name === 'login___la' || to?.name === 'login___en')) {
        return navigateTo('/');
    }

    // If not authenticated and trying to access protected pages, redirect to login
    if (!token.value && (to?.name !== 'login___la' && to?.name !== 'login___en')) {
        abortNavigation();
        return navigateTo('/login');
    }
});