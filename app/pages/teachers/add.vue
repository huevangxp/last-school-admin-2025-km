<template>
  <v-container fluid class="dashboard-container pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <!-- Identity + Account -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="primary-lighten-5" size="40" class="mr-3 rounded-0">
            <v-icon color="primary" size="20">mdi-account-tie-outline</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("information") }}</h2>
            <p class="text-detail">{{ t("teacher-identity-login") }}</p>
          </div>
        </div>

        <v-row class="ga-y-2">
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

          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("firstname") }} *</label
            >
            <v-text-field
              v-model="form.firstName"
              :placeholder="t('eg-firstname')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("lastname") }} *</label
            >
            <v-text-field
              v-model="form.lastName"
              :placeholder="t('eg-lastname')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("username") }} *</label
            >
            <v-text-field
              v-model="form.username"
              :placeholder="t('login-username')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("password") }} *</label
            >
            <v-text-field
              v-model="form.password"
              type="password"
              placeholder="••••••••"
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
              v-model="form.phone"
              placeholder="+856 20 ..."
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("role") }} *</label
            >
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
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{
              t("reports_to")
            }}</label>
            <v-select
              v-model="form.managerId"
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

          <v-col cols="12">
            <div class="layer-hint d-flex align-center flex-wrap ga-2 pa-3">
              <v-icon color="teal-darken-1" size="18"
                >mdi-file-tree-outline</v-icon
              >
              <span class="text-detail-tiny">{{ t("layer-of-position") }}</span>
              <v-chip
                v-if="form.layer"
                color="teal"
                variant="flat"
                size="small"
                class="font-weight-black"
              >
                {{ t("layer") }} {{ form.layer }}
              </v-chip>
              <span v-else class="text-detail-tiny">{{ t("not-selected-yet") }}</span>
              <span
                v-if="form.managerId && suggestedLayer"
                class="text-detail-tiny"
              >
                {{ t("suggested-layer-hint", { n: suggestedLayer }) }}
              </span>
            </div>
          </v-col>

          <v-col cols="12" v-if="errorMessage">
            <v-alert type="error" variant="tonal" density="compact">{{
              errorMessage
            }}</v-alert>
          </v-col>
        </v-row>
        <v-col cols="12" class="mt-6">
       
          
      <div class="d-flex justify-end ga-3">
        <v-btn
          variant="flat"
          color="grey-lighten-4"
          class="modern-action-btn secondary border text-slate-700"
          height="42"
          @click="$router.back()"
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
        >
          {{ t("save") }}
        </v-btn>
      </div>
        </v-col>
      </v-card>

    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTeacherStore } from "~/stores/apiTeacher";

// Creating teachers is admin-only (teachers are redirected to the org chart).
definePageMeta({ requiresAdmin: true });
import {
  positionOptions,
  departmentOptions,
  layerOptions,
} from "~/utils/orgPresets";

const { t } = useI18n();
const router = useRouter();
const teacherStore = useTeacherStore();
const loading = ref(false);
const errorMessage = ref("");
const formRef = ref();

// Raw faculty list (for the manager dropdown + layer computation).
const faculty = ref<any[]>([]);

onMounted(async () => {
  const { $axios } = useNuxtApp();
  try {
    const res = await $axios.get("/get-all-teachers?limit=100&page=1");
    faculty.value = res.data?.data?.teachers ?? [];
  } catch (error) {
    console.error("Failed to load teachers:", error);
  }
});

// Org layer of each existing teacher: no manager = Layer 1, otherwise
// one deeper than their manager (cycle-safe).
const layerById = computed<Record<string, number>>(() => {
  const byId: Record<string, any> = {};
  faculty.value.forEach((tc) => (byId[tc.id] = tc));
  const cache: Record<string, number> = {};
  const depth = (id: string, seen = new Set<string>()): number => {
    if (cache[id] != null) return cache[id];
    const node = byId[id];
    if (!node || !node.manager_id || !byId[node.manager_id] || seen.has(id)) {
      return (cache[id] = 1);
    }
    seen.add(id);
    return (cache[id] = depth(node.manager_id, seen) + 1);
  };
  faculty.value.forEach((tc) => depth(tc.id));
  return cache;
});

// Manager dropdown, labelled with each person's layer.
const managerOptions = computed(() =>
  faculty.value.map((tc) => ({
    title: `${tc.full_name || tc.username}${
      tc.position ? " — " + tc.position : ""
    } · Layer ${layerById.value[tc.id] ?? 1}`,
    value: tc.id,
  }))
);

// Suggested layer based on the chosen manager (one deeper than them).
const suggestedLayer = computed(() =>
  form.value.managerId ? (layerById.value[form.value.managerId] ?? 1) + 1 : null
);

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("teachers"), disabled: false, to: "/teachers" },
  { title: t("add"), disabled: true, to: "/teachers/add" },
];

const showDobPicker = ref(false);

const form = ref({
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  gender: null,
  dob: "",
  phone: "",
  role: "teacher",
  position: "",
  department: "",
  layer: null as number | null,
  managerId: null as string | null,
  avatar: "",
});

// Preview the picked photo (relative upload path → absolute URL).
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

const rules = {
  required: (v: any) => !!v || t("required"),
};

// When a manager is chosen, auto-fill the layer if the admin hasn't set one.
watch(
  () => form.value.managerId,
  () => {
    if (!form.value.layer && suggestedLayer.value) {
      form.value.layer = suggestedLayer.value;
    }
  }
);

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const f = form.value;
  loading.value = true;
  try {
    await teacherStore.createTeacher({
      full_name: `${f.firstName} ${f.lastName}`.trim(),
      username: f.username,
      password: f.password,
      gender: f.gender,
      dob: f.dob,
      phone_number: f.phone,
      role: f.role,
      position: f.position || null,
      department: f.department || null,
      layer: f.layer || null,
      manager_id: f.managerId || null,
      avatar: f.avatar || null,
      status: "active",
    });
    router.push("/teachers");
  } catch (error: any) {
    console.error(error);
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
  padding: 0 20px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #0A3154 0%, #082741 100%) !important;
  color: white !important;
}

.text-slate-700 {
  color: #334155 !important;
}

.layer-hint {
  background: #f0fdfa;
  border: 1px dashed #99f6e4;
}
</style>
