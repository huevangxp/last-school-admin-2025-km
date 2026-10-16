<template>
  <div class="page page--narrow">
    <PageHeader
      :title="`${t('add')} ${t('teachers')}`"
      :subtitle="t('teacher-identity-login')"
      icon="mdi-account-tie-outline"
      :breadcrumbs="breadcrumbs"
      back="/teachers"
    />

    <v-form ref="formRef" @submit.prevent="save">
      <v-card class="panel fade-in" elevation="0">
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
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("firstname") }} *</label>
            <v-text-field
              v-model="form.firstName"
              :placeholder="t('eg-firstname')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("lastname") }} *</label>
            <v-text-field
              v-model="form.lastName"
              :placeholder="t('eg-lastname')"
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
              v-model="form.phone"
              placeholder="+856 20 ..."
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              prepend-inner-icon="mdi-phone-outline"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Login -->
        <div class="form-section">
          <v-icon size="16">mdi-shield-key-outline</v-icon>
          {{ t("login") }}
        </div>
        <v-row class="form-grid">
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("username") }} *</label>
            <v-text-field
              v-model="form.username"
              :placeholder="t('login-username')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              prepend-inner-icon="mdi-account-circle-outline"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("password") }} *</label>
            <v-text-field
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              prepend-inner-icon="mdi-lock-outline"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
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
              v-model="form.managerId"
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

          <v-col cols="12">
            <div class="layer-hint">
              <v-icon color="teal-darken-1" size="18">mdi-file-tree-outline</v-icon>
              <span>{{ t("layer-of-position") }}</span>
              <v-chip
                v-if="form.layer"
                color="teal"
                variant="flat"
                size="small"
                class="font-weight-black"
              >
                {{ t("layer") }} {{ form.layer }}
              </v-chip>
              <span v-else class="layer-hint-muted">{{ t("not-selected-yet") }}</span>
              <span v-if="form.managerId && suggestedLayer" class="layer-hint-muted">
                {{ t("suggested-layer-hint", { n: suggestedLayer }) }}
              </span>
            </div>
          </v-col>

          <v-col v-if="errorMessage" cols="12">
            <v-alert type="error" variant="tonal" density="compact">{{
              errorMessage
            }}</v-alert>
          </v-col>
        </v-row>

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
            <v-icon icon="mdi-content-save-outline" start size="18"></v-icon>
            {{ t("save") }}
          </v-btn>
        </div>
      </v-card>
    </v-form>
  </div>
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
