<template>
  <v-container fluid class="dashboard-container pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <!-- Identity + Account -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="teal-lighten-5" size="40" class="mr-3 rounded-0">
            <v-icon color="teal-darken-1" size="20"
              >mdi-account-edit-outline</v-icon
            >
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("information") }}</h2>
            <p class="text-detail">{{ t("student-identity-login") }}</p>
          </div>
        </div>

        <v-skeleton-loader v-if="loadingData" type="article, article" />

        <v-row v-else class="ga-y-2">
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
              class="premium-input"
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
              class="premium-input"
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
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("password") }} {{ t("leave-blank-to-keep") }}</label
            >
            <v-text-field
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
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
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{ t("dob") }} *</label>
            <v-text-field
              v-model="form.dob"
              type="date"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("phone") }} *</label
            >
            <v-text-field
              v-model="form.phone"
              placeholder="+856 20 ..."
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{ t("status") }} *</label>
            <v-select
              v-model="form.status"
              :items="['active', 'inactive', 'block']"
              :placeholder="t('select')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
        </v-row>
      </v-card>

      <!-- Health + Class + Guardian -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="purple-lighten-5" size="40" class="mr-3 rounded-0">
            <v-icon color="purple-darken-1" size="20">mdi-heart-pulse</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("health-class-guardian") }}</h2>
            <p class="text-detail">{{ t("required-school-record-details") }}</p>
          </div>
        </div>

        <v-skeleton-loader v-if="loadingData" type="article, article" />

        <v-row v-else class="ga-y-2">
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("blood-group") }} *</label
            >
            <v-select
              v-model="form.bloodGroup"
              :items="['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']"
              :placeholder="t('select')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("ethnicity") }} *</label
            >
            <v-select
              v-model="form.ethnicity"
              :items="ethnicityOptions"
              :placeholder="t('select')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :no-data-text="t('no-ethnic-groups')"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("height-cm") }} *</label
            >
            <v-text-field
              v-model="form.height"
              type="number"
              placeholder="165"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("weight-kg") }} *</label
            >
            <v-text-field
              v-model="form.weight"
              type="number"
              placeholder="55"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("guardian-name") }} *</label
            >
            <v-text-field
              v-model="form.parentName"
              :placeholder="t('guardian-fullname-placeholder')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("guardian-phone") }} *</label
            >
            <v-text-field
              v-model="form.parentPhone"
              placeholder="+856 20 ..."
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >ຊັ້ນຮຽນ / GRADE LEVEL (optional)</label
            >
            <v-select
              v-model="selectedGradeLevel"
              :items="gradeLevelOptions"
              placeholder="ເລືອກຊັ້ນຮຽນກ່ອນ"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              no-data-text="No grade levels yet"
              @update:model-value="onGradeLevelChange"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >ຫ້ອງຮຽນ / CLASSROOM (optional)</label
            >
            <v-select
              v-model="form.classId"
              :items="classOptions"
              :disabled="!selectedGradeLevel"
              :loading="loadingClassrooms"
              placeholder="ເລືອກຫ້ອງຮຽນ"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :no-data-text="
                selectedGradeLevel
                  ? 'No classrooms for this grade level'
                  : 'ເລືອກຊັ້ນຮຽນກ່ອນ'
              "
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
          :disabled="loadingData"
        >
          {{ t("save") }}
        </v-btn>
      </div>
    </v-form>
  </v-container>
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
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
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
      error.response?.data?.message || "Failed to load student.";
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
      error.response?.data?.message || "Failed to update student.";
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
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}

.premium-input :deep(.v-field__outline__start),
.premium-input :deep(.v-field__outline__end),
.premium-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.premium-input :deep(.v-field--focused .v-field__outline__start),
.premium-input :deep(.v-field--focused .v-field__outline__end),
.premium-input :deep(.v-field--focused .v-field__outline__notch) {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 1.5px !important;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
