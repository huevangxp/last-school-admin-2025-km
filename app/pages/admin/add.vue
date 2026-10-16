<template>
  <div class="page page--narrow">
    <PageHeader
      :title="t('admin')"
      :subtitle="t('role-account-status')"
      icon="mdi-shield-account-outline"
      :breadcrumbs="breadcrumbs"
      back="/admin"
    />

    <v-form ref="formRef" @submit.prevent="save">
      <v-card class="panel fade-in" elevation="0">
        <!-- Photo -->
        <div class="form-section">
          <v-icon size="16">mdi-camera-outline</v-icon>
          {{ t("admin-profile-photo") }}
        </div>

        <div class="photo-row mb-6">
          <div class="photo-avatar" @click="triggerFileInput">
            <v-img v-if="previewImage" :src="previewImage" cover alt=""></v-img>
            <v-icon v-else size="36">mdi-camera-plus-outline</v-icon>
            <span class="photo-edit">
              <v-icon size="14">mdi-pencil</v-icon>
            </span>
          </div>
          <div class="photo-meta">
            <div class="cell-title">{{ t("image") }}</div>
            <div class="field-hint mt-1">{{ t("recommended-photo-size") }}</div>
            <v-btn
              variant="flat"
              size="small"
              class="modern-action-btn secondary mt-3"
              @click="triggerFileInput"
            >
              <v-icon start size="16">mdi-upload-outline</v-icon>
              {{ t("image") }}
            </v-btn>
          </div>
          <input
            type="file"
            ref="fileInput"
            class="d-none"
            accept="image/*"
            @change="handleFileChange"
          />
        </div>

        <!-- Information -->
        <div class="form-section">
          <v-icon size="16">mdi-account-details-outline</v-icon>
          {{ t("information") }}
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("admin_name") }}</label>
            <v-text-field
              v-model="form.fullName"
              :placeholder="t('enter-full-name')"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("username") }}</label>
            <v-text-field
              v-model="form.username"
              :placeholder="t('enter-username')"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-at"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("gender") }}</label>
            <v-select
              v-model="form.gender"
              :items="genderOptions"
              :placeholder="t('select-gender')"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("phone") }}</label>
            <v-text-field
              v-model="form.phone"
              placeholder="+856 20 ..."
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-phone-outline"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("dob") }}</label>
            <DialogDate
              v-model="showDob"
              :date="form.dob"
              @update:date="form.dob = $event"
            />
            <v-text-field
              v-model="form.dob"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-calendar"
              readonly
              @click="showDob = true"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Access -->
        <div class="form-section mt-6">
          <v-icon size="16">mdi-shield-account-outline</v-icon>
          {{ t("access") }}
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("role") }}</label>
            <v-select
              v-model="form.role"
              :items="roleOptions"
              :placeholder="t('select-role')"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("status") }}</label>
            <v-select
              v-model="form.status"
              :items="statusOptions"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
        </v-row>

        <!-- Password -->
        <div class="form-section mt-6">
          <v-icon size="16">mdi-lock-outline</v-icon>
          {{ t("password") }}
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("password") }}</label>
            <v-text-field
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-lock-outline"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("confirmPassword") }}</label>
            <v-text-field
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-lock-check-outline"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-5"
          >{{ errorMessage }}</v-alert
        >

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="$router.back()"
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            type="submit"
            :loading="loading"
          >
            <v-icon start size="18">mdi-content-save-outline</v-icon>
            {{ t("save") }}
          </v-btn>
        </div>
      </v-card>
    </v-form>
  </div>
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
/* Photo picker row: avatar on the left, hint + upload button on the right. */
.photo-row {
  display: flex;
  align-items: center;
  gap: 18px;
}
.photo-avatar {
  position: relative;
  flex: 0 0 auto;
  width: 96px;
  height: 96px;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: #f8fafc;
  border: 1.5px dashed #cbd5e1;
  transition: border-color 0.2s ease, background 0.2s ease;
}
.photo-avatar:hover {
  border-color: var(--ds-navy);
  background: var(--ds-navy-tint);
}
.photo-avatar .v-img {
  width: 100%;
  height: 100%;
}
.photo-edit {
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: var(--ds-navy);
  box-shadow: 0 4px 10px -4px rgba(10, 49, 84, 0.6);
}
.photo-meta {
  min-width: 0;
}
</style>
