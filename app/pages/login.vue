<template>
 <v-container fluid class="fill-height">
  <v-row no-gutters class="fill-height">
    <!-- Left Panel - Professional Brand -->
    <v-col
      cols="12"
      md="6"
      class="brand-panel d-none d-md-flex align-center justify-center"
    >
      <div class="brand-content">
        <!-- Logo -->
        <div class="brand-logo mb-12">
          <div class="logo-wrapper">
            <v-icon
              icon="mdi-school-outline"
              size="72"
              class="brand-icon"
            ></v-icon>
          </div>
          <h1 class="brand-title">EduAdmin</h1>
          <p class="brand-subtitle">Professional School Management System</p>
        </div>

        <!-- Features -->
        <div class="features-list">
          <div class="feature-item">
            <v-icon icon="mdi-shield-check-outline" class="feature-icon"></v-icon>
            <span>Secure Authentication</span>
          </div>
          <div class="feature-item">
            <v-icon icon="mdi-chart-line" class="feature-icon"></v-icon>
            <span>Advanced Analytics</span>
          </div>
          <div class="feature-item">
            <v-icon icon="mdi-account-group" class="feature-icon"></v-icon>
            <span>Student Management</span>
          </div>
        </div>
      </div>
    </v-col>

    <!-- Right Panel - Login Form -->
    <v-col
      cols="12"
      md="6"
      class="form-panel d-flex align-center justify-center"
    >
      <div class="form-wrapper">
        <!-- Form Header -->
        <div class="form-header mb-10">
          <h2 class="form-title">Welcome Back</h2>
          <p class="form-subtitle">Sign in to your account to continue</p>
        </div>

        <!-- Login Form -->
        <v-form @submit.prevent="loginBtn" class="login-form">
          <!-- Email Field -->
          <div class="form-group mb-6">
            <label class="form-label">Email Address</label>
            <v-text-field
              v-model="username"
              placeholder="Enter your email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              density="comfortable"
              class="pro-input"
              hide-details
              bg-color="white"
            ></v-text-field>
          </div>

          <!-- Password Field -->
          <div class="form-group mb-8">
            <div class="d-flex justify-space-between align-center mb-3">
              <label class="form-label">Password</label>
              <a
                href="#"
                class="forgot-password-link"
                @click.prevent
              >
                Forgot password?
              </a>
            </div>
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="
                showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
              "
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              density="comfortable"
              class="pro-input"
              hide-details
              bg-color="white"
            ></v-text-field>
          </div>

          <!-- Remember Me & Login Button -->
          <div class="form-actions mb-6">
            <v-checkbox
              v-model="rememberMe"
              label="Remember me"
              color="primary"
              density="compact"
              hide-details
              class="remember-checkbox"
            ></v-checkbox>
          </div>

          <!-- Login Button -->
          <v-btn
            type="submit"
            block
            size="large"
            class="pro-login-btn mb-8"
            :loading="loading"
            elevation="0"
          >
            Sign In
            <v-icon icon="mdi-arrow-right" end class="btn-icon"></v-icon>
          </v-btn>

          <!-- Divider -->
          <div class="divider-wrapper mb-6">
            <v-divider></v-divider>
            <span class="divider-text">OR</span>
            <v-divider></v-divider>
          </div>

          <!-- Social Login -->
          <div class="social-login mb-8">
            <v-btn
              variant="outlined"
              size="large"
              block
              class="social-btn mb-3"
              prepend-icon="mdi-google"
            >
              Continue with Google
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              block
              class="social-btn"
              prepend-icon="mdi-microsoft"
            >
              Continue with Microsoft
            </v-btn>
          </div>

          <!-- Register Link -->
          <div class="register-prompt text-center">
            <span class="register-text">Don't have an account?</span>
            <a href="#" class="register-link" @click.prevent>Contact Administrator</a>
          </div>
        </v-form>
      </div>
    </v-col>
  </v-row>
</v-container>
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
/* Modern Login Container */
.modern-login-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

/* Background Pattern */
.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  z-index: 1;
}

/* Floating Shapes */
.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.08);
  bottom: -100px;
  right: -100px;
  animation-delay: 2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.06);
  top: 50%;
  left: -75px;
  animation-delay: 4s;
}

/* Left Panel */
.left-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  z-index: 3;
}

.left-content {
  max-width: 500px;
  padding: 2rem;
}

.logo-container {
  display: flex;
  justify-content: center;
}

.logo-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

.logo-icon {
  color: white !important;
}

.hero-text {
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 3rem !important;
  font-weight: 800 !important;
  color: white !important;
  margin-bottom: 1rem !important;
  line-height: 1.2 !important;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.25rem !important;
  color: rgba(255, 255, 255, 0.9) !important;
  line-height: 1.6 !important;
  margin: 0 !important;
  font-weight: 400 !important;
}

.hero-illustration {
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
  animation: float 4s ease-in-out infinite;
}

/* Right Panel */
.right-panel {
  background: #ffffff;
  position: relative;
  z-index: 3;
}

.login-form-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.form-header {
  margin-bottom: 2rem;
}

.form-logo {
  display: flex;
  justify-content: center;
}

.form-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3) !important;
  animation: pulse 2s ease-in-out infinite;
}

.form-title {
  font-size: 2rem !important;
  font-weight: 700 !important;
  color: #2d3748 !important;
  margin-bottom: 0.5rem !important;
  line-height: 1.2 !important;
}

.form-subtitle {
  font-size: 1rem !important;
  color: #718096 !important;
  margin: 0 !important;
  font-weight: 400 !important;
}

/* Modern Form Styling */
.modern-form {
  margin-top: 1rem;
}

.form-field {
  margin-bottom: 1.5rem;
}

.field-label {
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  color: #4a5568 !important;
  margin-bottom: 0.5rem !important;
  display: block !important;
  text-transform: none !important;
  letter-spacing: 0.025em !important;
}

.modern-input :deep(.v-field) {
  border-radius: 12px !important;
  border: 2px solid #e2e8f0 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

.modern-input :deep(.v-field:hover) {
  border-color: #cbd5e0 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.modern-input :deep(.v-field--focused) {
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
}

.modern-input :deep(.v-field__input) {
  font-size: 1rem !important;
  padding: 1rem !important;
  color: #2d3748 !important;
}

.modern-input :deep(.v-icon) {
  color: #718096 !important;
  margin: 0 0.75rem !important;
}

.modern-input :deep(.v-field--focused .v-icon) {
  color: #667eea !important;
}

.forgot-link {
  font-size: 0.875rem !important;
  color: #667eea !important;
  text-decoration: none !important;
  font-weight: 500 !important;
  transition: color 0.3s ease !important;
}

.forgot-link:hover {
  color: #764ba2 !important;
  text-decoration: underline !important;
}

/* Modern Login Button */
.modern-login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  height: 56px !important;
  text-transform: none !important;
  letter-spacing: 0.025em !important;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
}

.modern-login-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4) !important;
}

.modern-login-btn:active {
  transform: translateY(0) !important;
}

.btn-text {
  font-weight: 600 !important;
}

.btn-arrow {
  transition: transform 0.3s ease !important;
}

.modern-login-btn:hover .btn-arrow {
  transform: translateX(4px) !important;
}

/* Register Links */
.register-text {
  color: #718096 !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
}

.register-link {
  color: #667eea !important;
  text-decoration: none !important;
  font-weight: 600 !important;
  margin-left: 0.25rem !important;
  transition: color 0.3s ease !important;
}

.register-link:hover {
  color: #764ba2 !important;
  text-decoration: underline !important;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  }
}

.fade-in {
  animation: fadeIn 1s ease-out;
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.fade-in-up-delay {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 959px) {
  .hero-title {
    font-size: 2rem !important;
  }
  
  .hero-subtitle {
    font-size: 1rem !important;
  }
  
  .hero-illustration {
    height: 240px !important;
  }
}

@media (max-width: 599px) {
  .login-form-container {
    padding: 1rem;
  }
  
  .form-title {
    font-size: 1.5rem !important;
  }
  
  .hero-illustration {
    height: 200px !important;
  }
}
</style>
