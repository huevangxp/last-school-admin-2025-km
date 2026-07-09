<template>
  <v-container fluid class="dashboard-container pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <!-- Identity + Account -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="teal-lighten-5" size="40" class="mr-3 rounded-0">
            <v-icon color="teal-darken-1" size="20"
              >mdi-account-plus-outline</v-icon
            >
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("information") }}</h2>
            <p class="text-detail">{{ t("student-identity-login") }}</p>
          </div>
        </div>

        <v-row class="ga-y-2">
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

          <v-col cols="12" md="4">
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
          <v-col cols="12" md="4">
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
          <v-col cols="12" md="4">
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
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>

      <!-- Health + Class + Guardian -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="purple-lighten-5" size="40" class="mr-3 rounded-0">
            <v-icon color="purple-darken-1" size="20"
              >mdi-heart-pulse</v-icon
            >
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("health-class-guardian") }}</h2>
            <p class="text-detail">{{ t("required-school-record-details") }}</p>
          </div>
        </div>

        <v-row class="ga-y-2">
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
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("grade-level-optional") }}</label
            >
            <v-select
              v-model="selectedGradeLevel"
              :items="gradeLevelOptions"
              :placeholder="t('select-grade-first')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              :no-data-text="t('no-grade-levels')"
              @update:model-value="onGradeLevelChange"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("classroom-optional") }}</label
            >
            <v-select
              v-model="form.classId"
              :items="classOptions"
              :disabled="!selectedGradeLevel"
              :loading="loadingClassrooms"
              :placeholder="t('select-classroom')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details="auto"
              color="primary"
              :no-data-text="
                selectedGradeLevel
                  ? t('no-classrooms-for-grade')
                  : t('select-grade-first')
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

      <v-card class="d-flex justify-end ga-3 py-4 px-6">
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
      </v-card>
    </v-form>
  </v-container>
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
</style>
