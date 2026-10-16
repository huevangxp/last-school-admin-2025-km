<template>
  <div class="page page--narrow">
    <PageHeader
      :title="`${t('edit')} ${t('teachers')}`"
      :subtitle="t('teacher-identity-login')"
      icon="mdi-account-edit-outline"
      :breadcrumbs="breadcrumbs"
      back="/teachers"
    />

    <v-form ref="formRef" @submit.prevent="save">
      <v-card class="panel fade-in" elevation="0">
        <div v-if="loadingData" class="py-16 text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <template v-else>
          <!-- Profile photo -->
          <div class="form-section">
            <v-icon size="16">mdi-camera-outline</v-icon>
            {{ t("admin-profile-photo") }}
          </div>
          <div class="photo-row">
            <v-avatar size="80" rounded="lg" class="photo-avatar">
              <v-img v-if="avatarPreview" :src="avatarPreview" cover alt=""></v-img>
              <v-icon v-else color="primary" size="36">mdi-account</v-icon>
            </v-avatar>
            <div class="flex-grow-1 min-w-0">
              <ImagePicker v-model="form.avatar" :label="t('image')" />
              <div class="field-hint">{{ t("recommended-photo-size") }}</div>
            </div>
          </div>

          <!-- Personal information -->
          <div class="form-section">
            <v-icon size="16">mdi-account-outline</v-icon>
            {{ t("personal-information") }}
          </div>
          <v-row class="form-grid">
            <v-col cols="12">
              <label class="field-label">{{ t("name") }} *</label>
              <v-text-field
                v-model="form.full_name"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <label class="field-label">{{ t("gender") }} *</label>
              <v-select
                v-model="form.gender"
                :items="genderOptions"
                :placeholder="t('select')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <label class="field-label">{{ t("dob") }} *</label>
              <DialogDate
                v-model="showDobPicker"
                :date="form.dob"
                @update:date="form.dob = $event"
              />
              <v-text-field
                v-model="form.dob"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-calendar"
                readonly
                @click="showDobPicker = true"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <label class="field-label">{{ t("phone") }}</label>
              <v-text-field
                v-model="form.phone_number"
                placeholder="+856 20 ..."
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
                prepend-inner-icon="mdi-phone-outline"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Role & account status -->
          <div class="form-section">
            <v-icon size="16">mdi-shield-account-outline</v-icon>
            {{ t("role-account-status") }}
          </div>
          <v-row class="form-grid">
            <v-col cols="12" md="6">
              <label class="field-label">{{ t("role") }} *</label>
              <v-select
                v-model="form.role"
                :items="roleOptions"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ t("status") }}</label>
              <v-select
                v-model="form.status"
                :items="statusOptions"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Organization -->
          <div class="form-section">
            <v-icon size="16">mdi-sitemap-outline</v-icon>
            {{ t("organization") }}
          </div>
          <v-row class="form-grid">
            <v-col cols="12" md="6">
              <label class="field-label">{{ t("position") }}</label>
              <v-combobox
                v-model="form.position"
                :items="positionOptions"
                :placeholder="t('select-or-type')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
                clearable
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ t("department") }}</label>
              <v-combobox
                v-model="form.department"
                :items="departmentOptions"
                :placeholder="t('select-or-type')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
                clearable
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ t("layer") }}</label>
              <v-select
                v-model="form.layer"
                :items="layerOptions"
                :placeholder="t('select-layer')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ t("reports_to") }}</label>
              <v-select
                v-model="form.manager_id"
                :items="managerOptions"
                :placeholder="t('select-manager-optional')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
                clearable
                :no-data-text="t('no-other-staff')"
              ></v-select>
            </v-col>

            <v-col v-if="errorMessage" cols="12">
              <v-alert type="error" variant="tonal" density="compact">{{
                errorMessage
              }}</v-alert>
            </v-col>
          </v-row>
        </template>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            to="/teachers"
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            type="submit"
            :loading="loading"
            :disabled="loadingData"
          >
            <v-icon icon="mdi-content-save-outline" start size="18"></v-icon>
            {{ t("save") }}
          </v-btn>
        </div>
      </v-card>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTeacherStore } from "~/stores/apiTeacher";
import {
  positionOptions,
  departmentOptions,
  layerOptions,
} from "~/utils/orgPresets";

// Managing teachers is admin-only.
definePageMeta({ requiresAdmin: true });

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const teacherStore = useTeacherStore();

const id = route.params.id as string;

const loading = ref(false);
const loadingData = ref(true);
const errorMessage = ref("");
const formRef = ref();
const showDobPicker = ref(false);

const faculty = ref<any[]>([]);

const form = ref({
  full_name: "",
  gender: "",
  dob: "",
  phone_number: "",
  role: "teacher",
  status: "active",
  position: "",
  department: "",
  layer: null as number | null,
  manager_id: null as string | null,
  avatar: "",
});

// Preview the current/picked photo (relative upload path → absolute URL).
const { mediaUrl } = useMedia();
const avatarPreview = computed(() =>
  form.value.avatar ? mediaUrl(form.value.avatar) : ""
);

const genderOptions = [
  { title: t("male"), value: "male" },
  { title: t("female"), value: "female" },
];
const roleOptions = [
  { title: t("teacher"), value: "teacher" },
  { title: t("admin"), value: "admin" },
];
const statusOptions = [
  { title: t("active"), value: "active" },
  { title: t("inactive"), value: "inactive" },
];

const rules = {
  required: (v: any) => !!v || t("required"),
};

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("teachers"), disabled: false, to: "/teachers" },
  { title: t("edit"), disabled: true, to: "" },
];

// Manager dropdown — everyone except the teacher being edited.
const managerOptions = computed(() =>
  faculty.value
    .filter((tc) => tc.id !== id)
    .map((tc) => ({
      title: `${tc.full_name || tc.username}${
        tc.position ? " — " + tc.position : ""
      }`,
      value: tc.id,
    }))
);

onMounted(async () => {
  const { $axios } = useNuxtApp();
  try {
    const [teacher, list] = await Promise.all([
      teacherStore.fetchTeacherById(id),
      $axios.get("/get-all-teachers?limit=100&page=1"),
    ]);
    faculty.value = list.data?.data?.teachers ?? [];
    if (teacher) {
      form.value = {
        full_name: teacher.full_name || "",
        gender: teacher.gender || "",
        dob: teacher.dob ? String(teacher.dob).substring(0, 10) : "",
        phone_number: teacher.phone_number || "",
        role: teacher.role || "teacher",
        status: teacher.status || "active",
        position: teacher.position || "",
        department: teacher.department || "",
        layer: teacher.layer ?? null,
        manager_id: teacher.manager_id || null,
        avatar: teacher.avatar && teacher.avatar !== "null" ? teacher.avatar : "",
      };
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = t("failed-update");
  } finally {
    loadingData.value = false;
  }
});

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await teacherStore.updateTeacher(id, {
      full_name: form.value.full_name,
      gender: form.value.gender,
      dob: form.value.dob,
      phone_number: form.value.phone_number,
      role: form.value.role,
      status: form.value.status,
      position: form.value.position,
      department: form.value.department,
      layer: form.value.layer,
      manager_id: form.value.manager_id,
      avatar: form.value.avatar,
    });
    router.push("/teachers");
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || t("failed-update");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Photo picker row: avatar beside the picker, stacked on phones. */
.photo-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.photo-avatar {
  flex: 0 0 auto;
  background: var(--ds-navy-tint);
  border: 1px solid var(--ds-border);
}
@media (max-width: 599px) {
  .photo-row {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Field groups: a little breathing room before the next section label. */
.form-grid {
  margin-bottom: 16px;
}

/* Teal note explaining the org layer of the chosen position. */
.layer-hint {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 14px;
  border-radius: var(--ds-radius-sm);
  background: #f0fdfa;
  border: 1px dashed #99f6e4;
  font-size: 12px;
  font-weight: 700;
  color: #0f766e;
}
.layer-hint-muted {
  color: var(--ds-muted);
  font-weight: 600;
}
</style>
