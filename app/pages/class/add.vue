<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="primary-lighten-5" size="40" class="mr-3 rounded-lg">
          <v-icon color="primary" size="20">mdi-google-classroom</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-title">Register Section</h2>
          <p class="text-detail">
            Configure new class group and room allocation
          </p>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="save">
        <v-row class="ga-y-2">
          <!-- Class Name -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">SECTION TITLE</label>
            <v-text-field
              v-model="form.className"
              placeholder="e.g. Mathematics 101"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Grade Level -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">ACADEMIC GRADE</label>
            <v-select
              v-model="form.grade"
              :items="gradeOptions"
              placeholder="Select grade"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <!-- Teacher -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >ASSIGNED FACULTY</label
            >
            <v-select
              v-model="form.teacher"
              :items="teacherOptions"
              placeholder="Select an instructor"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Room -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">FACILITY / ROOM</label>
            <v-text-field
              v-model="form.room"
              placeholder="e.g. A-101"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <!-- Description -->
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >ADDITIONAL NOTES</label
            >
            <v-textarea
              v-model="form.description"
              placeholder="Enter optional description..."
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              rows="3"
              hide-details="auto"
            ></v-textarea>
          </v-col>
        </v-row>

        <div class="d-flex justify-end ga-3 pt-8">
          <v-btn
            variant="flat"
            color="grey-lighten-4"
            class="modern-action-btn secondary border text-slate-700"
            height="40"
            @click="$router.push('/class')"
          >
            Cancel
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="modern-action-btn primary elevation-4"
            height="40"
            type="submit"
            :loading="loading"
          >
            Register Class
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
const { t } = useI18n();
const router = useRouter();
const loading = ref(false);
const formRef = ref();

const form = ref({
  className: "",
  grade: null,
  teacher: null,
  room: "",
  description: "",
});

const gradeOptions = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

const teacherOptions = [
  "Sarah Wilson",
  "James Miller",
  "Emily Davis",
  "Robert Brown",
  "Michael Chen",
];

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("classes"), disabled: false, to: "/class" },
  { title: t("addClass"), disabled: true, to: "/class/add" },
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
    router.push("/class");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 900px;
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
