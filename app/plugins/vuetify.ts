
// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app: any) => {
  const vuetify = createVuetify({
    defaults: {
      VBtn: {
        style: 'text-transform: none;',
        fontWeight: 'bold',
        letterSpacing: '0.5px',
      },
      VCard: {
        elevation: 0,
      }
    },
    theme: {
      defaultTheme: 'light',
       themes: {
         light: {
           colors: {
             primary: '#14b8a5', // Blue
             'primary-lighten-5': '#E3F2FD',
             secondary: '#1E293B', // Slate 800
             ts: '#64748B', // Slate 500
             bg: '#F8FAFC', // Slate 50
             surface: '#FFFFFF',
             accent: '#82B1FF',
             error: '#EF4444',
             info: '#3B82F6',
             success: '#10B981',
             warning: '#F59E0B',
           }
         }
       }
    },
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})