<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <v-row>
        <!-- Left: Basic Info & Image -->
        <v-col cols="12" lg="4">
          <v-card class="intelligence-card pa-6 mb-6 text-center" elevation="0">
            <div class="mb-6">
              <h2 class="text-title mb-1">Teacher Identity</h2>
              <p class="text-detail">Official faculty profile photograph</p>
            </div>

            <div class="d-flex flex-column align-center position-relative">
              <v-avatar
                size="160"
                color="slate-50"
                class="border-dashed rounded-xl overflow-hidden"
              >
                <v-img v-if="previewImage" :src="previewImage" cover></v-img>
                <v-icon v-else size="48" color="slate-300"
                  >mdi-camera-plus-outline</v-icon
                >
              </v-avatar>

              <v-btn
                icon="mdi-pencil"
                size="x-small"
                color="primary"
                class="position-absolute elevation-4"
                style="bottom: 0px; right: 50%; transform: translateX(80px)"
                @click="triggerFileInput"
              ></v-btn>

              <p class="text-detail-tiny mt-6 opacity-60">
                Recomended: 400x400px
              </p>
              <input
                type="file"
                ref="fileInput"
                class="d-none"
                accept="image/*"
                @change="handleFileChange"
              />
            </div>
          </v-card>

          <v-card class="intelligence-card pa-6" elevation="0">
            <div class="d-flex align-center mb-6">
              <v-avatar
                color="amber-lighten-5"
                size="36"
                class="mr-3 rounded-lg"
              >
                <v-icon color="amber-darken-2" size="18"
                  >mdi-briefcase-outline</v-icon
                >
              </v-avatar>
              <div>
                <h3 class="text-title">Join Details</h3>
                <p class="text-detail-tiny">Employment start & status</p>
              </div>
            </div>

            <label class="text-detail-tiny mb-2 d-block"
              >PROBATION START DATE</label
            >
            <v-text-field
              v-model="form.joinDate"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input mb-4"
              hide-details
            ></v-text-field>

            <label class="text-detail-tiny mb-2 d-block"
              >QUALIFICATION LEVEL</label
            >
            <v-text-field
              v-model="form.qualification"
              placeholder="e.g. Master's in Ed"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              hide-details
            ></v-text-field>
          </v-card>
        </v-col>

        <!-- Right: Comprehensive Data -->
        <v-col cols="12" lg="8">
          <!-- Section: Personal -->
          <v-card class="intelligence-card pa-6 mb-6" elevation="0">
            <div class="d-flex align-center mb-6">
              <v-avatar
                color="primary-lighten-5"
                size="36"
                class="mr-3 rounded-lg"
              >
                <v-icon color="primary" size="18"
                  >mdi-account-details-outline</v-icon
                >
              </v-avatar>
              <h2 class="text-title">Personal Information</h2>
            </div>

            <v-row class="ga-y-2">
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block">FIRST NAME</label>
                <v-text-field
                  v-model="form.firstName"
                  placeholder="Enter first name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="premium-input"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block">LAST NAME</label>
                <v-text-field
                  v-model="form.lastName"
                  placeholder="Enter last name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="premium-input"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block">GENDER</label>
                <v-select
                  v-model="form.gender"
                  :items="genderOptions"
                  placeholder="Select gender"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="premium-input"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block"
                  >EXPERIENCE (YEARS)</label
                >
                <v-text-field
                  v-model="form.experience"
                  type="number"
                  placeholder="e.g. 5"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="premium-input"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <!-- Section: Connectivity -->
          <v-card class="intelligence-card pa-6 mb-6" elevation="0">
            <div class="d-flex align-center mb-6">
              <v-avatar
                color="indigo-lighten-5"
                size="36"
                class="mr-3 rounded-lg"
              >
                <v-icon color="indigo-darken-1" size="18"
                  >mdi-card-account-phone-outline</v-icon
                >
              </v-avatar>
              <h2 class="text-title">Connectivity & Location</h2>
            </div>

            <v-row class="ga-y-2">
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block"
                  >PHONE NUMBER</label
                >
                <v-text-field
                  v-model="form.phone"
                  placeholder="+856 20 ..."
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="premium-input"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block"
                  >EMAIL ADDRESS</label
                >
                <v-text-field
                  v-model="form.email"
                  placeholder="teacher@example.com"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="premium-input"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <label class="text-detail-tiny mb-2 d-block"
                  >PRIMARY ADDRESS</label
                >
                <v-text-field
                  v-model="form.address"
                  placeholder="Full residential address"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="premium-input"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <!-- Section: Emergency -->
          <v-card class="intelligence-card pa-6 mb-8" elevation="0">
            <div class="d-flex align-center mb-6">
              <v-avatar
                color="rose-lighten-5"
                size="36"
                class="mr-3 rounded-lg"
              >
                <v-icon color="rose-darken-1" size="18"
                  >mdi-alert-circle-outline</v-icon
                >
              </v-avatar>
              <h2 class="text-title">Safety & Emergency</h2>
            </div>

            <v-row class="ga-y-2">
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block"
                  >CONTACT NAME</label
                >
                <v-text-field
                  v-model="form.emergencyName"
                  placeholder="Name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="premium-input"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-detail-tiny mb-2 d-block"
                  >EMERGENCY PHONE</label
                >
                <v-text-field
                  v-model="form.emergencyPhone"
                  placeholder="Phone"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="premium-input"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <div class="d-flex justify-end ga-3">
            <v-btn
              variant="flat"
              color="grey-lighten-4"
              class="modern-action-btn secondary border text-slate-700"
              height="40"
              @click="$router.back()"
            >
              Cancel
            </v-btn>
            <v-btn
              variant="flat"
              color="primary"
              class="modern-action-btn primary elevation-4"
              height="40"
              type="submit"
            >
              Register Faculty Member
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
const { t } = useI18n();
const router = useRouter();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("teachers"), disabled: false, to: "/teachers" },
  { title: "Add Teacher", disabled: true, to: "/teachers/add" },
];

const form = ref({
  firstName: "",
  lastName: "",
  gender: null,
  dob: "",
  phone: "",
  email: "",
  address: "",
  subject: null,
  qualification: "",
  experience: "",
  joinDate: new Date().toISOString().substring(0, 10),
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone: "",
});

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
];

const subjectOptions = [
  { title: "Mathematics", value: "math" },
  { title: "Physics", value: "physics" },
  { title: "Chemistry", value: "chemistry" },
  { title: "Biology", value: "biology" },
  { title: "English", value: "english" },
  { title: "History", value: "history" },
  { title: "Geography", value: "geography" },
  { title: "Computer Science", value: "cs" },
];

const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const save = () => {
  console.log("Form submitted:", form.value);
  router.push("/teachers");
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
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

.border-dashed {
  border: 2px dashed #e2e8f0 !important;
}

.bg-slate-50 {
  background-color: #f8fafc !important;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
