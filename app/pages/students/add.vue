<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <!-- Section: Identity Context -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="teal-lighten-5" size="40" class="mr-3 rounded-lg">
            <v-icon color="teal-darken-1" size="20"
              >mdi-account-plus-outline</v-icon
            >
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("information") }}</h2>
            <p class="text-detail">Primary student identification details</p>
          </div>
        </div>

        <v-row class="ga-y-2">
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">FIRST NAME</label>
            <v-text-field
              v-model="form.firstName"
              placeholder="e.g. John"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              persistent-placeholder
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">LAST NAME</label>
            <v-text-field
              v-model="form.lastName"
              placeholder="e.g. Doe"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              persistent-placeholder
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">DATE OF BIRTH</label>
            <v-text-field
              v-model="form.dob"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">GENDER</label>
            <v-select
              v-model="form.gender"
              :items="genderOptions"
              placeholder="Select Gender"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-select>
          </v-col>
        </v-row>
      </v-card>

      <!-- Section: Connectivity -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="indigo-lighten-5" size="40" class="mr-3 rounded-lg">
            <v-icon color="indigo-darken-1" size="20">mdi-phone-outline</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("contact") }}</h2>
            <p class="text-detail">Access and communication channels</p>
          </div>
        </div>

        <v-row class="ga-y-2">
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">EMAIL ADDRESS</label>
            <v-text-field
              v-model="form.email"
              placeholder="student@example.com"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">PHONE NUMBER</label>
            <v-text-field
              v-model="form.phone"
              placeholder="(555) 000-0000"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >RESIDENTIAL ADDRESS</label
            >
            <v-text-field
              v-model="form.address"
              placeholder="Street address, City, Building"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>

      <!-- Section: Academic Placement -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="amber-lighten-5" size="40" class="mr-3 rounded-lg">
            <v-icon color="amber-darken-2" size="20">mdi-school-outline</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("academic") }}</h2>
            <p class="text-detail">Enrollment and curricular placement</p>
          </div>
        </div>

        <v-row class="ga-y-2">
          <v-col cols="12" md="4">
            <label class="text-detail-tiny mb-2 d-block">GRADE / CLASS</label>
            <v-select
              v-model="form.classId"
              :items="classOptions"
              placeholder="Select Grade"
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
            <label class="text-detail-tiny mb-2 d-block">SECTION</label>
            <v-select
              v-model="form.section"
              :items="['A', 'B', 'C']"
              placeholder="Select Section"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <label class="text-detail-tiny mb-2 d-block">ADMISSION DATE</label>
            <v-text-field
              v-model="form.admissionDate"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>

      <!-- Section: Family Network -->
      <v-card class="intelligence-card pa-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="rose-lighten-5" size="40" class="mr-3 rounded-lg">
            <v-icon color="rose-darken-1" size="20"
              >mdi-human-male-female-child</v-icon
            >
          </v-avatar>
          <div>
            <h2 class="text-title">Guardian Information</h2>
            <p class="text-detail">Parental and emergency contact profiles</p>
          </div>
        </div>

        <v-row class="ga-y-2">
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >FATHER'S FULL NAME</label
            >
            <v-text-field
              v-model="form.fatherName"
              placeholder="Full Name"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >MOTHER'S FULL NAME</label
            >
            <v-text-field
              v-model="form.motherName"
              placeholder="Full Name"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >EMERGENCY CONTACT PHONE</label
            >
            <v-text-field
              v-model="form.parentPhone"
              prepend-inner-icon="mdi-phone"
              placeholder="e.g. +856 20 ..."
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="d-flex justify-end ga-3 pt-6">
            <v-btn
              variant="flat"
              color="grey-lighten-4"
              class="modern-action-btn secondary border text-slate-700"
              height="40"
              @click="$router.back()"
            >
              {{ t("cancel") }}
            </v-btn>
            <v-btn
              variant="flat"
              color="primary"
              class="modern-action-btn primary elevation-4"
              height="40"
              @click="save"
              :loading="loading"
            >
              {{ t("save") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
const { t } = useI18n();
const router = useRouter();
const loading = ref(false);
const formRef = ref();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("students"), disabled: false, to: "/students" },
  { title: t("addStudent"), disabled: true, to: "/students/add" },
];

const form = ref({
  firstName: "",
  lastName: "",
  gender: null,
  dob: "",
  phone: "",
  email: "",
  address: "",
  fatherName: "",
  motherName: "",
  parentPhone: "",
  classId: null,
  section: null,
  admissionDate: new Date().toISOString().substring(0, 10),
});

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
];

const classOptions = [
  { title: "Class 1/A", value: 1 },
  { title: "Class 1/B", value: 2 },
  { title: "Class 2/A", value: 3 },
  { title: "Class 2/B", value: 4 },
];

const rules = {
  required: (v: any) => !!v || "Field is required",
};

const save = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    console.log("Form submitted:", form.value);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/students");
  } catch (error) {
    console.error(error);
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
  padding: 0 16px !important;
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
