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

        // One form serves both account types. Try the teacher/admin login first,
        // then fall back to the student login. Both endpoints answer 401 for an
        // unknown username AND a wrong password (deliberately indistinguishable,
        // so the API can't be used to enumerate accounts), so 401 is the signal
        // to try the other table rather than a definitive failure.
        let response: any;
        try {
          response = await $axios.post("/login-teacher", {
            username: user,
            password: password,
          });
        } catch (err: any) {
          if (err.response?.status === 401 || err.response?.status === 404) {
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
            // Mark the cookies HTTPS-only whenever the page itself is served over
            // HTTPS, so the bearer token is never sent in the clear. Derived from
            // the actual protocol rather than hardcoded, so plain-HTTP local dev
            // (and an http:// LAN deployment) still logs in.
            secure:
              import.meta.client && window.location.protocol === "https:",
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

          // Seed the shared avatar state the header reads, so a re-login in the
          // same tab shows the new account's photo (not the previous one).
          useState<string>("userAvatar").value = String(
            response.data.data.avatar ?? ""
          );

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

    // Self-service profile — any logged-in role. The backend targets the
    // caller's own record via the token, so no id is passed from the client.
    async fetchMyProfile() {
      const { $axios } = useNuxtApp();
      const response = await $axios.get("/my-profile");
      return response.data?.data ?? null;
    },

    async updateMyProfile(payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const response = await $axios.put("/my-profile", payload);
      return response.data;
    },

    async updateMyPassword(current_password: string, new_password: string) {
      const { $axios } = useNuxtApp();
      const response = await $axios.put("/my-password", {
        current_password,
        new_password,
      });
      return response.data;
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
      useState<string>("userAvatar").value = "";
      this.authenticated = false;
      this.profile = {} as Profile;

      return navigateTo("/login");
    },
  },
});
