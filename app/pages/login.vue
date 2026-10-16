<template>
  <div class="login-page">
    <!-- Decorative backdrop -->
    <div class="login-glow login-glow--1"></div>
    <div class="login-glow login-glow--2"></div>
    <div class="login-grid"></div>

    <!-- Main Login Card -->
    <v-card class="login-card fade-in" elevation="0">
      <div class="login-body">
        <div class="text-center mb-8">
          <div class="login-logo">
            <v-img src="/logo.png" alt="Logo" width="40" height="40" contain></v-img>
          </div>
          <h1 class="login-title text-capitalize">{{ t("welcome") }}</h1>
          <p class="login-subtitle">{{ t("welcomeText") }}</p>
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

          <div class="mb-4">
            <label class="field-label">{{ t("email_or_username") }}</label>
            <v-text-field
              v-model="username"
              :placeholder="t('enter_email')"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-outline"
              color="primary"
              hide-details
              autocomplete="username"
            ></v-text-field>
          </div>

          <div class="mb-3">
            <div class="d-flex justify-space-between align-center">
              <label class="field-label">{{ t("password") }}</label>
              <a href="#" class="login-link">{{ t("forgotPassword") }}</a>
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
              color="primary"
              hide-details
              autocomplete="current-password"
            ></v-text-field>
          </div>

          <div class="d-flex align-center mb-5">
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
            class="modern-action-btn primary login-btn"
            :loading="loading"
            variant="flat"
          >
            {{ t("sign_in") }}
            <v-icon end size="18">mdi-arrow-right</v-icon>
          </v-btn>
        </v-form>
      </div>

      <div class="login-footer">
        &copy; {{ new Date().getFullYear() }} {{ t("schoolmanagement") }}
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { useApiAuthStore } from "@/stores/apiAuth";

definePageMeta({
  layout: false,
});

const { t } = useI18n();

const username = ref("");
const password = ref("123456");
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const { login } = useApiAuthStore();

const loginBtn = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = t("enter_credentials");
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
    errorMessage.value = t("login_failed");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Full-screen navy backdrop with soft teal glow */
.login-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(135deg, #0a3154 0%, #0c3d68 55%, #0f4c7a 100%);
}
.login-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(2px);
}
.login-glow--1 {
  width: 520px;
  height: 520px;
  right: -160px;
  top: -200px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.35) 0%, rgba(45, 212, 191, 0) 70%);
}
.login-glow--2 {
  width: 460px;
  height: 460px;
  left: -140px;
  bottom: -220px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 70%);
}
.login-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.35;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
}

/* Card */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  border-radius: 24px !important;
  background: #fff !important;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45) !important;
  overflow: hidden;
}
.login-body {
  padding: 32px 24px 24px;
}
@media (min-width: 600px) {
  .login-body {
    padding: 40px 40px 28px;
  }
}
.login-logo {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ds-navy-tint, #e6ecf2);
  box-shadow: inset 0 0 0 1px rgba(10, 49, 84, 0.08);
}
.login-title {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: var(--ds-text, #0f172a);
  margin: 0 0 6px;
}
.login-subtitle {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ds-muted, #64748b);
  margin: 0;
}
.login-link {
  font-size: 12px;
  font-weight: 800;
  color: var(--ds-teal-700, #0d9488);
  text-decoration: none;
  margin-bottom: 6px;
}
.login-link:hover {
  text-decoration: underline;
}
.login-card .v-btn.login-btn {
  height: 48px !important;
  font-size: 15px !important;
}
.compact-checkbox :deep(.v-label) {
  font-size: 13px !important;
  font-weight: 600;
  color: var(--ds-muted, #64748b) !important;
  opacity: 1 !important;
}
.login-footer {
  padding: 14px 24px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--ds-faint, #94a3b8);
  background: #f8fafc;
  border-top: 1px solid var(--ds-border-soft, #f1f5f9);
}
</style>
