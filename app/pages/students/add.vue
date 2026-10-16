<template>
  <div class="page page--narrow">
    <PageHeader
      :title="t('addStudent')"
      :subtitle="t('student-identity-login')"
      icon="mdi-account-plus-outline"
      :breadcrumbs="breadcrumbs"
      back="/students"
    />

    <v-card elevation="0" class="panel fade-in">
      <v-form ref="formRef" @submit.prevent="save">
        <!-- Identity -->
        <div class="form-section">
          <v-icon size="16">mdi-account-outline</v-icon>
          {{ t("information") }}
        </div>

        <v-row dense class="form-grid">
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
              :placeholder="t('select_date')"
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
          <v-col cols="12" md="4">
            <label class="field-label">{{ t("phone") }} *</label>
            <v-text-field
              v-model="form.phone"
              placeholder="+856 20 ..."
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              prepend-inner-icon="mdi-phone-outline"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Login account -->
        <div class="form-section mt-6">
          <v-icon size="16">mdi-shield-key-outline</v-icon>
          {{ t("access") }}
        </div>

        <v-row dense class="form-grid">
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
        </v-row>

        <!-- Health, class and guardian -->
        <div class="form-section mt-6">
          <v-icon size="16">mdi-heart-pulse</v-icon>
          {{ t("health-class-guardian") }}
        </div>
        <p class="section-hint">{{ t("required-school-record-details") }}</p>

        <v-row dense class="form-grid">
          <v-col cols="6" md="3">
            <label class="field-label">{{ t("blood-group") }} *</label>
            <v-select
              v-model="form.bloodGroup"
              :items="['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']"
              :placeholder="t('select')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="6" md="3">
            <label class="field-label">{{ t("ethnicity") }} *</label>
            <v-select
              v-model="form.ethnicity"
              :items="ethnicityOptions"
              :placeholder="t('select')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              :no-data-text="t('no-ethnic-groups')"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="6" md="3">
            <label class="field-label">{{ t("height-cm") }} *</label>
            <v-text-field
              v-model="form.height"
              type="number"
              placeholder="165"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="3">
            <label class="field-label">{{ t("weight-kg") }} *</label>
            <v-text-field
              v-model="form.weight"
              type="number"
              placeholder="55"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="field-label">{{ t("guardian-name") }} *</label>
            <v-text-field
              v-model="form.parentName"
              :placeholder="t('guardian-fullname-placeholder')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              prepend-inner-icon="mdi-account-supervisor-outline"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("guardian-phone") }} *</label>
            <v-text-field
              v-model="form.parentPhone"
              placeholder="+856 20 ..."
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              prepend-inner-icon="mdi-phone-outline"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="field-label">{{ t("grade-level-optional") }}</label>
            <v-select
              v-model="selectedGradeLevel"
              :items="gradeLevelOptions"
              :placeholder="t('select-grade-first')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              prepend-inner-icon="mdi-school-outline"
              :no-data-text="t('no-grade-levels')"
              @update:model-value="onGradeLevelChange"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("classroom-optional") }}</label>
            <v-select
              v-model="form.classId"
              :items="classOptions"
              :disabled="!selectedGradeLevel"
              :loading="loadingClassrooms"
              :placeholder="t('select-classroom')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              color="primary"
              prepend-inner-icon="mdi-google-classroom"
              :no-data-text="
                selectedGradeLevel
                  ? t('no-classrooms-for-grade')
                  : t('select-grade-first')
              "
            ></v-select>
          </v-col>

          <v-col v-if="errorMessage" cols="12">
            <v-alert type="error" variant="tonal" density="compact" rounded="lg">
              {{ errorMessage }}
            </v-alert>
          </v-col>
        </v-row>

        <!-- Footer actions -->
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
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStudentStore } from "~/stores/apiStudent";

const { t } = useI18n();
const router = useRouter();
const studentStore = useStudentStore();
const loading = ref(false);
const errorMessage = ref("");
const formRef = ref();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("students"), disabled: false, to: "/students" },
  { title: t("addStudent"), disabled: true, to: "/students/add" },
];

const showDobPicker = ref(false);

const form = ref({
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  gender: "male",
  dob: "",
  phone: "",
  bloodGroup: "",
  ethnicity: "",
  height: "",
  weight: "",
  parentName: "",
  parentPhone: "",
  classId: null,
});

const genderOptions = [
  { title: t("gender-male"), value: "male" },
  { title: t("gender-female"), value: "female" },
];

const rules = {
  required: (v: any) => !!v || t("required"),
};

// Grade levels (ຊັ້ນຮຽນ) — chosen first to filter classrooms.
const gradeLevelOptions = ref<{ title: string; value: string }[]>([]);
const selectedGradeLevel = ref<string | null>(null);
// Classrooms (ຫ້ອງຮຽນ) — loaded after a grade level is picked.
const classOptions = ref<{ title: string; value: string }[]>([]);
const loadingClassrooms = ref(false);
// Ethnic groups for the ethnicity dropdown.
const ethnicityOptions = ref<string[]>([]);

// When the grade level changes, reset the classroom and load its rooms.
const onGradeLevelChange = async () => {
  form.value.classId = null;
  classOptions.value = [];
  if (!selectedGradeLevel.value) return;

  const { $axios } = useNuxtApp();
  loadingClassrooms.value = true;
  try {
    const res = await $axios.get("/get-all-classrooms", {
      params: { grade_level_id: selectedGradeLevel.value, limit: 100 },
    });
    const rooms = res.data?.data?.classrooms ?? [];
    classOptions.value = rooms.map((c: any) => ({
      title: c.classroom_name || c.classroom_code || c.id,
      value: c.id,
    }));
  } catch (error) {
    console.error("Failed to load classrooms:", error);
  } finally {
    loadingClassrooms.value = false;
  }
};

onMounted(async () => {
  const { $axios } = useNuxtApp();
  try {
    const res = await $axios.get("/get-all-grade-level");
    const grades = res.data?.data ?? [];
    gradeLevelOptions.value = grades.map((g: any) => ({
      title: g.grade_level_name || g.grade_level_code || g.id,
      value: g.id,
    }));
  } catch (error) {
    console.error("Failed to load grade levels:", error);
  }

  try {
    const res = await $axios.get("/ethnic-group?limit=100");
    const groups = res.data?.data ?? [];
    ethnicityOptions.value = groups.map((g: any) => g.title);
  } catch (error) {
    console.error("Failed to load ethnic groups:", error);
  }
});

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const f = form.value;
  loading.value = true;
  try {
    await studentStore.createStudent({
      username: f.username,
      password: f.password,
      role: "student",
      avatar: null,
      gender: f.gender,
      status: "active",
      phone_number: f.phone,
      dob: f.dob,
      blood_group: f.bloodGroup,
      height: Number(f.height),
      weight: Number(f.weight),
      ethnicity: f.ethnicity,
      first_name: f.firstName,
      last_name: f.lastName,
      parent_name: f.parentName,
      parent_number: f.parentPhone,
      class_id: f.classId || null,
    });
  } catch (error: any) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || t("failed-create-student");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Short explanatory line under a form-section divider. */
.section-hint {
  margin: -6px 0 14px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ds-muted);
}

/* Comfortable vertical rhythm between stacked fields. */
.form-grid > .v-col {
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>
