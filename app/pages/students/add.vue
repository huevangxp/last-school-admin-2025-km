<template>
  <v-container fluid class="dashboard-container pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <!-- Identity + Account -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="teal-lighten-5" size="40" class="mr-3 rounded-lg">
            <v-icon color="teal-darken-1" size="20"
              >mdi-account-plus-outline</v-icon
            >
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("information") }}</h2>
            <p class="text-detail">Student identity & login</p>
          </div>
        </div>

        <v-row class="ga-y-2">
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("firstname") }} *</label
            >
            <v-text-field
              v-model="form.firstName"
              placeholder="e.g. ສົມສະໜຸກ"
              variant="outlined"
              density="compact"
              rounded="lg"
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
              placeholder="e.g. ວົງສາ"
              variant="outlined"
              density="compact"
              rounded="lg"
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
              placeholder="Login username"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
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
              rounded="lg"
              hide-details="auto"
              class="premium-input"
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
              placeholder="Select"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <label class="text-detail-tiny mb-2 d-block">{{ t("dob") }} *</label>
            <v-text-field
              v-model="form.dob"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
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
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>

      <!-- Health + Class + Guardian -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="purple-lighten-5" size="40" class="mr-3 rounded-lg">
            <v-icon color="purple-darken-1" size="20"
              >mdi-heart-pulse</v-icon
            >
          </v-avatar>
          <div>
            <h2 class="text-title">Health, Class & Guardian</h2>
            <p class="text-detail">Required school record details</p>
          </div>
        </div>

        <v-row class="ga-y-2">
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">BLOOD GROUP *</label>
            <v-select
              v-model="form.bloodGroup"
              :items="['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']"
              placeholder="Select"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">ETHNICITY *</label>
            <v-select
              v-model="form.ethnicity"
              :items="ethnicityOptions"
              placeholder="Select"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              no-data-text="No ethnic groups yet"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">HEIGHT (cm) *</label>
            <v-text-field
              v-model="form.height"
              type="number"
              placeholder="165"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">WEIGHT (kg) *</label>
            <v-text-field
              v-model="form.weight"
              type="number"
              placeholder="55"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >GUARDIAN NAME *</label
            >
            <v-text-field
              v-model="form.parentName"
              placeholder="Parent / guardian full name"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >GUARDIAN PHONE *</label
            >
            <v-text-field
              v-model="form.parentPhone"
              placeholder="+856 20 ..."
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("classes") }} (optional)</label
            >
            <v-select
              v-model="form.classId"
              :items="classOptions"
              placeholder="Assign to a class"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              no-data-text="No classrooms yet"
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
        >
          {{ t("save") }}
        </v-btn>
      </div>
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

const form = ref({
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  gender: null,
  dob: "",
  phone: "",
  bloodGroup: null,
  ethnicity: "",
  height: "",
  weight: "",
  parentName: "",
  parentPhone: "",
  classId: null,
});

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
];

const rules = {
  required: (v: any) => !!v || t("required"),
};

// Real classrooms for the optional class dropdown.
const classOptions = ref<{ title: string; value: string }[]>([]);

onMounted(async () => {
  const { $axios } = useNuxtApp();
  try {
    const res = await $axios.get("/get-all-classrooms?limit=100");
    const rooms = res.data?.data?.classrooms ?? [];
    classOptions.value = rooms.map((c: any) => ({
      title: c.classroom_name || c.classroom_code || c.id,
      value: c.id,
    }));
  } catch (error) {
    console.error("Failed to load classrooms:", error);
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
      avatar: "https://picsum.photos/200",
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
    router.push("/students");
  } catch (error: any) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || "Failed to create student.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1000px;
  margin: 0 auto;
}

.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}

.modern-action-btn {
  border-radius: 8px !important;
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
