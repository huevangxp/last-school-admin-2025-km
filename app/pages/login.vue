<template>
  <div class="login-page-wrapper">
    <!-- Main Login Card -->
    <v-card class="login-card overflow-hidden" elevation="24">
      <v-row no-gutters class="fill-height">
        <!-- Left Side - Image Core -->
        <v-col cols="12" md="6" class="d-none d-md-flex image-side">
          <div class="image-overlay">
            <div class="overlay-content pa-10">
              <div class="logo-box mb-6">
                <v-icon
                  icon="mdi-school-outline"
                  size="48"
                  color="white"
                ></v-icon>
              </div>
              <div
                class="text-title text-white mb-4"
                style="font-size: 24px !important"
              >
                EduAdmin
              </div>
              <div class="text-detail text-white opacity-90">
                Managing education with precision and style. Experience the next
                generation of school administration.
              </div>

              <div class="mt-auto decoration-line"></div>
            </div>
          </div>
          <v-img src="/login-hero.png" cover class="side-image">
            <template v-slot:placeholder>
              <div
                class="d-flex align-center justify-center fill-height bg-grey-lighten-2"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
            </template>
          </v-img>
        </v-col>

        <!-- Right Side - Login Form -->
        <v-col
          cols="12"
          md="6"
          class="form-side pa-8 pa-md-16 d-flex flex-column align-center justify-center"
        >
          <div class="w-100 max-width-form">
            <div class="text-center mb-10">
              <div class="d-md-none mb-4">
                <v-avatar color="primary-lighten-5" size="64">
                  <v-icon
                    icon="mdi-school-outline"
                    color="primary"
                    size="32"
                  ></v-icon>
                </v-avatar>
              </div>
              <div
                class="text-title text-slate-900 mb-2"
                style="font-size: 18px !important"
              >
                Welcome Back
              </div>
              <div class="text-detail">
                Please sign in to your admin account
              </div>
            </div>

            <v-form @submit.prevent="loginBtn" class="login-form">
              <div class="mb-5">
                <label class="custom-label">Email or Username</label>
                <v-text-field
                  v-model="username"
                  placeholder="Enter your email"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-email-outline"
                  class="rounded-input"
                  hide-details
                  bg-color="grey-lighten-5"
                ></v-text-field>
              </div>

              <div class="mb-6">
                <div class="d-flex justify-space-between align-center mb-2">
                  <label class="custom-label">Password</label>
                  <a
                    href="#"
                    class="text-caption text-primary font-weight-bold text-decoration-none"
                    >Forgot?</a
                  >
                </div>
                <v-text-field
                  v-model="password"
                  placeholder="••••••••"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="
                    showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                  "
                  @click:append-inner="showPassword = !showPassword"
                  class="rounded-input"
                  hide-details
                  bg-color="grey-lighten-5"
                ></v-text-field>
              </div>

              <div class="d-flex align-center mb-8">
                <v-checkbox
                  v-model="rememberMe"
                  label="Remember me"
                  color="primary"
                  density="compact"
                  hide-details
                  class="compact-checkbox"
                ></v-checkbox>
              </div>

              <v-btn
                type="submit"
                block
                size="large"
                height="56"
                class="primary-login-btn mb-10"
                :loading="loading"
                elevation="8"
              >
                Sign In
                <v-icon icon="mdi-arrow-right" end class="ml-2"></v-icon>
              </v-btn>

              <div class="text-center">
                <span class="text-body-2 text-grey-darken-1"
                  >Don't have an account?</span
                >
                <a
                  href="#"
                  class="text-primary font-weight-bold text-decoration-none ml-2"
                  >Contact Admin</a
                >
              </div>
            </v-form>
          </div>

          <div class="form-footer mt-16 text-caption text-grey-lighten-1">
            &copy; {{ new Date().getFullYear() }} EduAdmin Professional
            Management
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { useApiAuthStore } from "@/stores/apiAuth";

definePageMeta({
  layout: false,
});

const username = ref("admin");
const password = ref("admin");
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);

const { login } = useApiAuthStore();

const loginBtn = async () => {
  if (!username.value || !password.value) return;

  loading.value = true;
  try {
    await login(username.value, password.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page-wrapper {
  min-height: 100vh;
  width: 100%;
  background: #f8fafc; /* Clean off-white background */
  font-family: "Inter", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 1100px;
  min-height: 650px;
  border-radius: 24px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
}

/* Left Side Styling */
.image-side {
  position: relative;
  background-color: #0d9488;
}

.side-image {
  height: 100%;
  width: 100%;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(13, 148, 136, 0.4),
    rgba(13, 148, 136, 0.8)
  );
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.overlay-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-box {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.decoration-line {
  height: 4px;
  width: 60px;
  background: white;
  border-radius: 2px;
}

/* Right Side Styling */
.form-side {
  background-color: white;
}

.max-width-form {
  max-width: 420px;
}

.custom-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 6px;
}

.rounded-input :deep(.v-field) {
  border-radius: 12px !important;
  border-color: #e2e8f0 !important;
  transition: all 0.2s ease;
}

.rounded-input :deep(.v-field--focused) {
  border-color: #14b8a6 !important;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1) !important;
}

.primary-login-btn {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
  height: 60px !important;
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
}

.primary-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(20, 184, 166, 0.4) !important;
}

.compact-checkbox :deep(.v-label) {
  font-size: 0.9rem !important;
  color: #64748b !important;
  opacity: 1 !important;
}

.form-footer {
  text-align: center;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 1s ease-out;
}

@media (max-width: 959px) {
  .login-card {
    max-width: 500px;
  }
}
</style>
