<template>
  <div class="login-container d-flex fill-height bg-cream-soft">
    <!-- Left Side: Image/Branding -->
    <v-col
      cols="12"
      md="6"
      lg="7"
      class="d-none d-md-flex align-center justify-center bg-brown-darken-4 position-relative pa-0 overflow-hidden"
    >
      <div class="bg-texture"></div>
      <div class="z-index-2 text-center text-white px-12 slide-in-up">
        <v-img
          src="https://illustrations.popsy.co/amber/student-going-to-school.svg"
          height="450"
          class="mb-8 drop-shadow"
        ></v-img>
        <h1 class="text-h3 font-weight-black mb-4 tracking-wide text-cream">
          <span>{{ $t("schoolmanagement") }}</span>
        </h1>
        <p
          class="text-h6 font-weight-regular text-cream-light opacity-90"
          style="max-width: 600px; margin: 0 auto"
        >
          <span>{{ $t("schoolmanagementText") }}</span>
        </p>
      </div>

      <!-- Decorative Elements -->
      <div class="circle-decoration circle-1"></div>
      <div class="circle-decoration circle-2"></div>
    </v-col>

    <!-- Right Side: Login Form -->
    <v-col
      cols="12"
      md="6"
      lg="5"
      class="d-flex align-center justify-center bg-white pa-8 pa-md-16 relative"
    >
      <div class="w-100 fade-in" style="max-width: 420px">
        <div class="mb-12">
          <v-avatar color="brown-lighten-5" size="80" class="mb-6 elevation-2">
            <v-icon
              icon="mdi-school-outline"
              size="40"
              color="brown-darken-3"
            ></v-icon>
          </v-avatar>
          <h2 class="text-h4 font-weight-bold text-brown-darken-4 mb-3">
            <span>{{ $t("welcome") }}</span>
          </h2>
          <p class="text-subtitle-1 text-brown-lighten-1 font-weight-medium">
            <span>{{ $t("welcomeText") }}</span>
          </p>
        </div>

        <v-form @submit.prevent="loginBtn">
          <div class="mb-5">
            <label
              class="text-caption font-weight-bold text-brown-darken-3 mb-2 d-block text-uppercase tracking-wider"
              ><span>{{ $t("username") }}</span></label
            >
            <v-text-field
              v-model="username"
              :placeholder="$t('username')"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
              color="brown-darken-2"
              base-color="brown-lighten-3"
              density="comfortable"
              rounded="lg"
              class="cream-input"
              hide-details="auto"
              bg-color="grey-lighten-5"
            ></v-text-field>
          </div>

          <div class="mb-8">
            <div class="d-flex justify-space-between align-center mb-2">
              <label
                class="text-caption font-weight-bold text-brown-darken-3 text-uppercase tracking-wider"
                ><span>{{ $t("password") }}</span></label
              >
              <a
                href="#"
                class="text-caption text-brown-darken-2 font-weight-bold text-decoration-none hover-underline"
                ><span>{{ $t("forgotPassword") }}</span></a
              >
            </div>
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('password')"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="
                showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
              "
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              color="brown-darken-2"
              base-color="brown-lighten-3"
              density="comfortable"
              rounded="lg"
              class="cream-input"
              hide-details="auto"
              bg-color="grey-lighten-5"
            ></v-text-field>
          </div>

          <v-btn
            block
            color="brown-darken-3"
            size="large"
            rounded="xl"
            elevation="6"
            class="text-none font-weight-bold mb-8 btn-hover"
            height="56"
            :loading="loading"
            type="submit"
          >
            <span
              class="text-h6 font-weight-bold"
              style="font-size: 1.1rem !important"
              >{{ $t("login") }}</span
            >
          </v-btn>

          <div
            class="text-center text-body-2 text-brown-lighten-1 font-weight-medium"
          >
            <span> {{ $t("don") }}</span>
            <a
              href="#"
              class="text-brown-darken-3 font-weight-black text-decoration-none ml-2 hover-underline"
              >{{ $t("register") }}</a
            >
          </div>
        </v-form>
      </div>
    </v-col>
  </div>
</template>

<script setup>
import { useApiAuthStore } from "@/stores/apiAuth";

definePageMeta({
  layout: "empty",
});

const username = ref("admin");
const password = ref("admin");
const showPassword = ref(false);
const loading = ref(false);

const { login } = useApiAuthStore();

const loginBtn = async () => {
  if (!username.value || !password.value) {
    // You might want to use a snackbar here instead of alert for better UI
    alert("Please enter username and password");
    return;
  }

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
.login-container {
  min-height: 100vh;
}

.bg-texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  z-index: 1;
}

.z-index-2 {
  z-index: 2;
}

.text-cream {
  color: #fdfbf7 !important;
}
.text-cream-light {
  color: #efebe0 !important;
}

.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-width: 1px !important;
}
.cream-input :deep(.v-field--focused .v-field__outline__start),
.cream-input :deep(.v-field--focused .v-field__outline__end),
.cream-input :deep(.v-field--focused .v-field__outline__notch) {
  border-width: 2px !important;
}

.btn-hover {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.btn-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -6px rgba(62, 39, 35, 0.4) !important;
}

.hover-underline:hover {
  text-decoration: underline !important;
}

/* Animations */
.slide-in-up {
  animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Decorative Circles */
.circle-decoration {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 70%
  );
}
.circle-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -200px;
}
.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -100px;
}

.tracking-wide {
  letter-spacing: 0.02em;
}
.tracking-wider {
  letter-spacing: 0.08em;
}

.drop-shadow {
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
}
</style>
