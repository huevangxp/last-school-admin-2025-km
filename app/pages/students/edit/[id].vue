<template>
  <div class="page page--narrow">
    <PageHeader
      :title="`${t('edit')} ${t('student')}`"
      :subtitle="t('student-identity-login')"
      icon="mdi-account-edit-outline"
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

        <v-skeleton-loader
          v-if="loadingData"
          type="article, article"
          class="bg-transparent"
        />

        <template v-else>
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

            <v-col cols="12" sm="6" md="3">
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
            <v-col cols="12" sm="6" md="3">
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
            <v-col cols="12" sm="6" md="3">
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
            <v-col cols="12" sm="6" md="3">
              <label class="field-label">{{ t("status") }} *</label>
              <v-select
                v-model="form.status"
                :items="['active', 'inactive', 'block']"
                :placeholder="t('select')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
                prepend-inner-icon="mdi-list-status"
                :rules="[rules.required]"
              ></v-select>
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
              <label class="field-label">{{ t("password") }}</label>
              <v-text-field
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                color="primary"
                prepend-inner-icon="mdi-lock-outline"
              ></v-text-field>
              <div class="field-hint">{{ t("leave-blank-to-keep") }}</div>
            </v-col>
          </v-row>
        </template>

        <!-- Health, class and guardian -->
        <div class="form-section mt-6">
          <v-icon size="16">mdi-heart-pulse</v-icon>
          {{ t("health-class-guardian") }}
        </div>
        <p class="section-hint">{{ t("required-school-record-details") }}</p>

        <v-skeleton-loader
          v-if="loadingData"
          type="article, article"
          class="bg-transparent"
        />

        <v-row v-else dense class="form-grid">
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
            :disabled="loadingData"
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
import { useRoute, useRouter } from "vue-router";
import { useStudentStore } from "~/stores/apiStudent";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const studentStore = useStudentStore();
const studentId = route.params.id as string;

const loading = ref(false);
const loadingData = ref(true);
const errorMessage = ref("");
const formRef = ref();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("students"), disabled: false, to: "/students" },
  { title: t("edit"), disabled: true, to: `/students/edit/${studentId}` },
];

const showDobPicker = ref(false);

const form = ref({
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  gender: null as string | null,
  dob: "",
  phone: "",
  status: "active",
  bloodGroup: null as string | null,
  ethnicity: "",
  height: "",
  weight: "",
  parentName: "",
  parentPhone: "",
  classId: null as string | null,
});

const genderOptions = [
  { title: t("gender-male"), value: "male" },
  { title: t("gender-female"), value: "female" },
];

const rules = {
  required: (v: any) => !!v || t("required"),
};

// Dropdown data.
const gradeLevelOptions = ref<{ title: string; value: string }[]>([]);
const selectedGradeLevel = ref<string | null>(null);
const classOptions = ref<{ title: string; value: string }[]>([]);
const loadingClassrooms = ref(false);
const ethnicityOptions = ref<string[]>([]);

const loadClassrooms = async (gradeLevelId: string | null) => {
  classOptions.value = [];
  if (!gradeLevelId) return;
  const { $axios } = useNuxtApp();
  loadingClassrooms.value = true;
  try {
    const res = await $axios.get("/get-all-classrooms", {
      params: { grade_level_id: gradeLevelId, limit: 100 },
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

const onGradeLevelChange = async () => {
  form.value.classId = null;
  await loadClassrooms(selectedGradeLevel.value);
};

onMounted(async () => {
  const { $axios } = useNuxtApp();

  // Load grade levels + ethnic groups in parallel with the student record.
  const gradeReq = $axios
    .get("/get-all-grade-level")
    .then((res) => {
      const grades = res.data?.data ?? [];
      gradeLevelOptions.value = grades.map((g: any) => ({
        title: g.grade_level_name || g.grade_level_code || g.id,
        value: g.id,
      }));
    })
    .catch((error) => console.error("Failed to load grade levels:", error));

  const ethnicReq = $axios
    .get("/ethnic-group?limit=100")
    .then((res) => {
      const groups = res.data?.data ?? [];
      ethnicityOptions.value = groups.map((g: any) => g.title);
    })
    .catch((error) => console.error("Failed to load ethnic groups:", error));

  try {
    const [student] = await Promise.all([
      studentStore.fetchStudentById(studentId),
      gradeReq,
      ethnicReq,
    ]);

    if (student) {
      form.value = {
        firstName: student.first_name || "",
        lastName: student.last_name || "",
        username: student.username || "",
        password: "",
        gender: student.gender || null,
        dob: (student.dob || "").slice(0, 10),
        phone: student.phone_number || "",
        status: student.status || "active",
        bloodGroup: student.blood_group || null,
        ethnicity: student.ethnicity || "",
        height: student.height || "",
        weight: student.weight || "",
        parentName: student.parent_name || "",
        parentPhone: student.parent_number || "",
        classId: student.class_id || null,
      };

      // Preselect grade level + classroom from the stored class_id.
      if (student.class_id) {
        try {
          const res = await $axios.get(
            `/get-classroom-by-id/${student.class_id}`
          );
          const gradeLevelId = res.data?.data?.grade_level_id ?? null;
          if (gradeLevelId) {
            selectedGradeLevel.value = gradeLevelId;
            await loadClassrooms(gradeLevelId);
            form.value.classId = student.class_id;
          }
        } catch (error) {
          console.error("Failed to resolve classroom grade level:", error);
        }
      }
    }
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || t("failed-load-student");
  } finally {
    loadingData.value = false;
  }
});

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const f = form.value;
  const payload: Record<string, unknown> = {
    username: f.username,
    gender: f.gender,
    status: f.status,
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
  };
  // Only send a password when the admin actually typed a new one.
  if (f.password) payload.password = f.password;

  loading.value = true;
  try {
    await studentStore.updateStudent(studentId, payload);
    router.push("/students");
  } catch (error: any) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || t("failed-update-student");
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
