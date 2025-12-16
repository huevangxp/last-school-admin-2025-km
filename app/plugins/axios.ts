import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
    const api = axios.create({
        baseURL: 'http://localhost:4000/api',
        headers: {
            'Content-Type': 'application/json',
        },
 
    })

    return {
        provide: {
            axios: api,
        }
    }

})