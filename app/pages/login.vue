<template>
  <div class="login-container d-flex fill-height">
    <!-- Left Side: Image/Branding -->
    <v-col
      cols="12"
      md="6"
      lg="7"
      class="d-none d-md-flex align-center justify-center bg-primary position-relative pa-0 overflow-hidden"
    >
      <div class="bg-pattern"></div>
      <div class="z-index-2 text-center text-white px-12">
        <v-img
          src="https://illustrations.popsy.co/amber/student-going-to-school.svg"
          height="400"
          class="mb-8"
        ></v-img>
        <h1 class="text-h3 font-weight-bold mb-4">
          <span>{{ $t("schoolmanagement") }}</span>
        </h1>
        <p class="text-h6 font-weight-light opacity-80">
          <span>{{ $t("schoolmanagementText") }}</span>
        </p>
      </div>
    </v-col>

    <!-- Right Side: Login Form -->
    <v-col
      cols="12"
      md="6"
      lg="5"
      class="d-flex align-center justify-center bg-surface pa-8 pa-md-16"
    >
      <div class="w-100" style="max-width: 450px">
        <div class="mb-10">
          <v-avatar color="primary-lighten-5" size="64" class="mb-6">
            <v-icon icon="mdi-school" size="32" color="primary"></v-icon>
          </v-avatar>
          <h2 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">
            <span
              ><span>{{ $t("welcome") }}</span></span
            >
          </h2>
          <p class="text-body-1 text-grey-darken-1">
            <span>{{ $t("welcomeText") }}</span>
          </p>
        </div>

        <v-form @submit.prevent="loginBtn">
          <div class="mb-5">
            <label
              class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-2 d-block"
              ><span
                ><span>{{ $t("username") }}</span></span
              ></label
            >
            <v-text-field
              v-model="username"
              :placeholder="$t('username')"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="primary"
              density="comfortable"
              rounded="lg"
              hide-details="auto"
              bg-color="grey-lighten-5"
            ></v-text-field>
          </div>

          <div class="mb-6">
            <div class="d-flex justify-space-between align-center mb-2">
              <label class="text-subtitle-2 font-weight-bold text-grey-darken-2"
                ><span>{{ $t("password") }}</span></label
              >
              <a
                href="#"
                class="text-caption text-primary font-weight-bold text-decoration-none"
                ><span>{{ $t("forgotPassword") }}</span></a
              >
            </div>
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('password')"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              color="primary"
              density="comfortable"
              rounded="lg"
              hide-details="auto"
              bg-color="grey-lighten-5"
            ></v-text-field>
          </div>

          <v-btn
            block
            color="primary"
            size="large"
            rounded="lg"
            elevation="4"
            class="text-none font-weight-bold mb-6"
            height="52"
            :loading="loading"
            type="submit"
          >
            <span>{{ $t("login") }}</span>
          </v-btn>

          <div class="text-center text-body-2 text-grey-darken-1">
            <span> {{ $t("don") }}</span>
            <a
              href="#"
              class="text-primary font-weight-bold text-decoration-none ml-1"
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

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
  opacity: 0.5;
}

.z-index-2 {
  z-index: 2;
}

.opacity-80 {
  opacity: 0.8;
}
</style>
