import { navigateTo, useCookie } from "nuxt/app";
import { defineStore } from "pinia";

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

export const useApiAuthStore = defineStore("apiAuth", {
  state: () => ({
    authenticated: false,
    profile: {} as Profile,
  }),
  actions: {
    async login(user: string, password: string) {
      try {
        const { $axios } = useNuxtApp();

        // One form serves both account types. Try the teacher/admin login first;
        // if the username isn't a teacher (404), fall back to the student login.
        let response;
        try {
          response = await $axios.post("/login-teacher", {
            username: user,
            password: password,
          });
        } catch (err: any) {
          if (err.response?.status === 404) {
            response = await $axios.post("/login-student", {
              username: user,
              password: password,
            });
          } else {
            throw err;
          }
        }

        if (response.status === 200 && response.data) {
          // Set authentication state
          this.authenticated = true;
          this.profile = response.data.data;

          // Define cookie options once
          const cookieOptions = {
            maxAge: 60 * 60, // 1 hour — matches the JWT token lifetime
            secure: false, // HTTPS only in production
            sameSite: "lax" as const, // 'strict' might cause issues with redirects
            path: "/",
          };

          // Store credentials in cookies
          // Note: httpOnly can only be set server-side in Nuxt
          const token = useCookie("token", cookieOptions);
          const userId = useCookie("id", cookieOptions);
          const userRole = useCookie("role", cookieOptions);
          const userPhone = useCookie("phone", cookieOptions);
          const email = useCookie("email", cookieOptions);
          const avatar = useCookie("avatar", cookieOptions);
          const username = useCookie("username", cookieOptions);

          // Set cookie values
          token.value = response.data.token;
          userId.value = String(response.data.data.id);
          userRole.value = String(response.data.data.role);
          userPhone.value = String(response.data.data.phone_number);
          email.value = String(response.data.data.email ?? "");
          avatar.value = String(response.data.data.avatar);
          username.value = String(response.data.data.username);

          // console.log('Login successful, token saved', response.data);

          // Navigate to home page
          navigateTo("/");
        } else {
          // Login failed
          this.authenticated = false;
          this.profile = {} as Profile;
          throw new Error("Login failed");
        }
      } catch (error: any) {
        // Handle error properly
        console.error("Login error:", error);

        // Clear authentication state
        this.authenticated = false;
        this.profile = {} as Profile;

        // Clear cookies on error
        const token = useCookie("token");
        const userId = useCookie("id");
        const userRole = useCookie("role");
        const userPhone = useCookie("phone");
        const email = useCookie("email");
        const avatar = useCookie("avatar");
        const username = useCookie("username");

        token.value = null;
        userId.value = null;
        userRole.value = null;
        userPhone.value = null;
        email.value = null;
        avatar.value = null;
        username.value = null;

        // Return error message for UI handling
        return {
          error: true,
          message:
            error.response?.data?.message ||
            "Login failed. Please check your credentials.",
        };
      }
    },

    logout() {
      const token = useCookie("token");
      const userId = useCookie("id");
      const userRole = useCookie("role");
      const userPhone = useCookie("phone");
      const email = useCookie("email");
      const avatar = useCookie("avatar");
      const username = useCookie("username");
      // Clear all cookies
      token.value = null;
      userId.value = null;
      userRole.value = null;
      userPhone.value = null;
      email.value = null;
      avatar.value = null;
      username.value = null;
      this.authenticated = false;
      this.profile = {} as Profile;

      return navigateTo("/login");
    },
  },
});
