<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <v-row>
        <!-- Left: Identity & Photo -->
        <v-col cols="12" lg="4">
          <v-card class="intelligence-card pa-6 mb-6 text-center" elevation="0">
            <div class="mb-6">
              <h2 class="text-title mb-1">{{ t("admin") }}</h2>
              <p class="text-detail">{{ t("admin-profile-photo") }}</p>
            </div>

            <div class="d-flex flex-column align-center position-relative">
              <v-avatar
                size="160"
                color="slate-50"
                class="border-dashed rounded-0 overflow-hidden"
              >
                <v-img v-if="previewImage" :src="previewImage" cover alt=""></v-img>
                <v-icon v-else size="48" color="slate-300"
                  >mdi-camera-plus-outline</v-icon
                >
              </v-avatar>

              <v-btn
                icon="mdi-pencil"
                size="x-small"
                color="primary"
                class="position-absolute elevation-4"
                style="bottom: 0px; right: 50%; transform: translateX(80px)"
                @click="triggerFileInput"
              ></v-btn>

              <p class="text-detail-tiny mt-6 opacity-60">
                {{ t("recommended-photo-size") }}
              </p>
              <input
                type="file"
                ref="fileInput"
                class="d-none"
                accept="image/*"
                @change="handleFileChange"
              />
            </div>
          </v-card>

          <v-card class="intelligence-card pa-6" elevation="0">
            <div class="d-flex align-center mb-6">
              <v-avatar
                color="amber-lighten-5"
                size="36"
                class="mr-3 rounded-0"
              >
                <v-icon color="amber-darken-2" size="18"
                  >mdi-shield-account-outline</v-icon
                >
              </v-avatar>
              <div>
                <h3 class="text-title">{{ t("access") }}</h3>
                <p class="text-detail-tiny">{{ t("role-account-status") }}</p>
              </div>
            </div>

            <label class="text-detail-tiny mb-2 d-block">{{
              t("role").toUpperCase()
            }}</label>
            <v-select
              v-model="form.role"
              :items="roleOptions"
              :placeholder="t('select-role')"
              variant="outlined"
              density="compact"
              class="mb-4"
              hide-details
            ></v-select>

            <label class="text-detail-tiny mb-2 d-block">{{
              t("status").toUpperCase()
            }}</label>
            <v-select
              v-model="form.status"
              :items="statusOptions"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-card>
        </v-col>

        <!-- Right: Account Details -->
        <v-col cols="12" lg="8">
          <v-card class="intelligence-card pa-6 mb-6" elevation="0">
            <div class="d-flex align-center mb-6">
              <v-avatar
                color="primary-lighten-5"
                size="36"
                class="mr-3 rounded-0"
              >
                <v-icon color="primary" size="18"
                  >mdi-account-details-outline</v-icon
                >
              </v-avatar>
              <h2 class="text-title">{{ t("information") }}</h2>
            </div>

            <v-row class="ga-y-2">
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block">{{
                  t("admin_name").toUpperCase()
                }}</label>
                <v-text-field
                  v-model="form.fullName"
                  :placeholder="t('enter-full-name')"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block">{{
                  t("username").toUpperCase()
                }}</label>
                <v-text-field
                  v-model="form.username"
                  :placeholder="t('enter-username')"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block">{{
                  t("gender").toUpperCase()
                }}</label>
                <v-select
                  v-model="form.gender"
                  :items="genderOptions"
                  :placeholder="t('select-gender')"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block">{{
                  t("phone").toUpperCase()
                }}</label>
                <v-text-field
                  v-model="form.phone"
                  placeholder="+856 20 ..."
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block">{{
                  t("dob").toUpperCase()
                }}</label>
                <DialogDate
                  v-model="showDob"
                  :date="form.dob"
                  @update:date="form.dob = $event"
                />
                <v-text-field
                  v-model="form.dob"
                  variant="outlined"
                  density="compact"
                  hide-details
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  @click="showDob = true"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              density="compact"
              class="mt-4"
              >{{ errorMessage }}</v-alert
            >
          </v-card>

          <v-card class="intelligence-card pa-6 mb-8" elevation="0">
            <div class="d-flex align-center mb-6">
              <v-avatar
                color="indigo-lighten-5"
                size="36"
                class="mr-3 rounded-0"
              >
                <v-icon color="indigo-darken-1" size="18"
                  >mdi-lock-outline</v-icon
                >
              </v-avatar>
              <h2 class="text-title">{{ t("password") }}</h2>
            </div>

            <v-row class="ga-y-2">
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block">{{
                  t("password").toUpperCase()
                }}</label>
                <v-text-field
                  v-model="form.password"
                  type="password"
                  placeholder="••••••••"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block">{{
                  t("confirmPassword").toUpperCase()
                }}</label>
                <v-text-field
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <div class="d-flex justify-end ga-3">
            <v-btn
              variant="flat"
              color="grey-lighten-4"
              class="modern-action-btn secondary border text-slate-700"
              height="40"
              @click="$router.back()"
            >
              {{ t("cancel") }}
            </v-btn>
            <v-btn
              variant="flat"
              color="primary"
              class="modern-action-btn primary elevation-4"
              height="40"
              type="submit"
              :loading="loading"
            >
              {{ t("save") }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTeacherStore } from "~/stores/apiTeacher";
import { useUiStore } from "~/stores/ui";

// Creating admin/staff accounts is admin-only.
definePageMeta({ requiresAdmin: true });

const { t } = useI18n();
const router = useRouter();
const teacherStore = useTeacherStore();
const ui = useUiStore();
const { uploadImage } = useUpload();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("admin"), disabled: false, to: "/admin" },
  { title: t("add"), disabled: true, to: "/admin/add" },
];

const loading = ref(false);
const errorMessage = ref("");
const showDob = ref(false);

const form = ref({
  fullName: "",
  username: "",
  gender: null,
  phone: "",
  dob: "",
  role: "admin",
  status: "active",
  password: "",
  confirmPassword: "",
  avatar: "",
});

const genderOptions = [
  { title: t("male"), value: "male" },
  { title: t("female"), value: "female" },
];

const roleOptions = [
  { title: t("administrator"), value: "admin" },
  { title: t("teacher"), value: "teacher" },
];

const statusOptions = [
  { title: t("active"), value: "active" },
  { title: t("inactive"), value: "inactive" },
];

const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  // Show an instant local preview, then upload to get the stored URL.
  const reader = new FileReader();
  reader.onload = (e) => (previewImage.value = e.target?.result as string);
  reader.readAsDataURL(file);
  try {
    form.value.avatar = await uploadImage(file);
  } catch {
    errorMessage.value = t("failed-to-upload-images");
  }
};

const save = async () => {
  errorMessage.value = "";
  const f = form.value;
  // Required by the backend: full_name, username, password, gender, dob.
  if (!f.fullName || !f.username || !f.password || !f.gender || !f.dob) {
    errorMessage.value = t("all-fields-required");
    return;
  }
  if (f.password !== f.confirmPassword) {
    errorMessage.value = t("passwords-do-not-match");
    return;
  }
  loading.value = true;
  try {
    await teacherStore.createTeacher({
      full_name: f.fullName,
      username: f.username,
      password: f.password,
      gender: f.gender,
      dob: f.dob,
      phone_number: f.phone || null,
      role: f.role,
      status: f.status,
      avatar: f.avatar || null,
    });
    ui.notify(t("saved-successfully"), "success");
    router.push("/admin");
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || t("failed-create-teacher");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}

.modern-action-btn {
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  padding: 0 16px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #0A3154 0%, #082741 100%) !important;
  color: white !important;
}

.border-dashed {
  border: 2px dashed #e2e8f0 !important;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
