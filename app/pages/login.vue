<template>
  <div class="login-page-wrapper">
    <!-- Main Login Card -->
    <v-card class="login-card overflow-hidden" elevation="24">
      <v-row no-gutters class="fill-height">
        <!-- Login Form (image removed) -->
        <v-col
          cols="12"
          class="form-side pa-8 pa-md-12 d-flex flex-column align-center justify-center"
        >
          <div class="w-100 max-width-form">
            <div class="text-center mb-10">
              <div class="mb-4 d-flex justify-center">
                <v-avatar color="primary-lighten-5" size="72" rounded="0">
                  <v-img src="/logo.png" alt="Logo" width="44" contain></v-img>
                </v-avatar>
              </div>
              <div
                class="text-title text-slate-900 mb-2"
                style="font-size: 18px !important"
              >
                {{ t("welcome") }}
              </div>
              <div class="text-detail">
                {{ t("welcomeText") }}
              </div>
            </div>

            <v-form @submit.prevent="loginBtn" class="login-form">
              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-5"
                closable
                @click:close="errorMessage = ''"
                >{{ errorMessage }}</v-alert
              >

              <div class="mb-5">
                <label class="custom-label">{{ t("email_or_username") }}</label>
                <v-text-field
                  v-model="username"
                  :placeholder="t('enter_email')"
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
                  <label class="custom-label">{{ t("password") }}</label>
                  <a
                    href="#"
                    class="text-caption text-primary font-weight-bold text-decoration-none"
                    >{{ t("forgotPassword") }}</a
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

              <div class="d-flex align-center mb-2">
                <v-checkbox
                  v-model="rememberMe"
                  :label="t('remember_me')"
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
                {{ t("sign_in") }}
                <v-icon icon="mdi-arrow-right" end class="ml-2"></v-icon>
              </v-btn>

           
            </v-form>
          </div>

          <div class="form-footer mt-2 text-caption text-grey-lighten-1">
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

const username = ref("deputy_academic");
const password = ref("123456");
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const { login } = useApiAuthStore();

const loginBtn = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Please enter your username and password.";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  try {
    const result = await login(username.value, password.value);
    // The store returns { error, message } on a failed login.
    if (result?.error) {
      errorMessage.value = result.message;
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "Login failed. Please try again.";
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
  max-width: 460px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.decoration-line {
  height: 4px;
  width: 60px;
  background: white;
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
