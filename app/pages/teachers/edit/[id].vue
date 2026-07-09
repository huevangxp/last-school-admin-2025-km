<template>
  <v-container fluid class="dashboard-container pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="primary-lighten-5" size="40" class="mr-3 rounded-0">
            <v-icon color="primary" size="20">mdi-account-edit-outline</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("edit") }} {{ t("teachers") }}</h2>
            <p class="text-detail">{{ t("teacher-identity-login") }}</p>
          </div>
        </div>

        <div v-if="loadingData" class="py-10 text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <v-row v-else class="ga-y-2">
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block">{{
              t("admin-profile-photo")
            }}</label>
            <div class="d-flex align-center ga-4">
              <v-avatar size="72" color="primary-lighten-5" rounded="0" class="elevation-1">
                <v-img v-if="avatarPreview" :src="avatarPreview" cover></v-img>
                <v-icon v-else color="primary" size="32">mdi-account</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <ImagePicker v-model="form.avatar" :label="t('image')" />
              </div>
            </div>
          </v-col>

          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("name") }} *</label
            >
            <v-text-field
              v-model="form.full_name"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("gender") }} *</label
            >
            <v-select
              v-model="form.gender"
              :items="genderOptions"
              :placeholder="t('select')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{ t("dob") }} *</label>
            <DialogDate
              v-model="showDobPicker"
              :date="form.dob"
              @update:date="form.dob = $event"
            />
            <v-text-field
              v-model="form.dob"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-calendar"
              readonly
              @click="showDobPicker = true"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{ t("phone") }}</label>
            <v-text-field
              v-model="form.phone_number"
              placeholder="+856 20 ..."
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{ t("role") }} *</label>
            <v-select
              v-model="form.role"
              :items="roleOptions"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
            ></v-select>
          </v-col>

          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{
              t("status")
            }}</label>
            <v-select
              v-model="form.status"
              :items="statusOptions"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{
              t("position")
            }}</label>
            <v-combobox
              v-model="form.position"
              :items="positionOptions"
              :placeholder="t('select-or-type')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              clearable
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{
              t("department")
            }}</label>
            <v-combobox
              v-model="form.department"
              :items="departmentOptions"
              :placeholder="t('select-or-type')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              clearable
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{ t("layer") }}</label>
            <v-select
              v-model="form.layer"
              :items="layerOptions"
              :placeholder="t('select-layer')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              clearable
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">{{
              t("reports_to")
            }}</label>
            <v-select
              v-model="form.manager_id"
              :items="managerOptions"
              :placeholder="t('select-manager-optional')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              clearable
              :no-data-text="t('no-other-staff')"
            ></v-select>
          </v-col>

          <v-col cols="12" v-if="errorMessage">
            <v-alert type="error" variant="tonal" density="compact">{{
              errorMessage
            }}</v-alert>
          </v-col>
        </v-row>
      </v-card>

      <div class="d-flex justify-end ga-3">
        <v-btn
          variant="flat"
          color="grey-lighten-4"
          class="modern-action-btn secondary border text-slate-700"
          height="42"
          to="/teachers"
        >
          {{ t("cancel") }}
        </v-btn>
        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="42"
          type="submit"
          :loading="loading"
          :disabled="loadingData"
        >
          {{ t("save") }}
        </v-btn>
      </div>
    </v-form>
  </v-container>
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
});

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
  padding: 0 20px !important;
}
.modern-action-btn.primary {
  background: linear-gradient(135deg, #0a3154 0%, #082741 100%) !important;
  color: white !important;
}
.text-slate-700 {
  color: #334155 !important;
}
</style>
