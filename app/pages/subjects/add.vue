<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="indigo-lighten-5" size="40" class="mr-3 rounded-lg">
          <v-icon color="indigo-darken-2" size="20"
            >mdi-book-open-variant-outline</v-icon
          >
        </v-avatar>
        <div>
          <h2 class="text-title">Register Subject</h2>
          <p class="text-detail">Define new curricular course details</p>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="save">
        <v-row class="ga-y-2">
          <!-- Subject Name -->
          <v-col cols="12" md="8">
            <label class="text-detail-tiny mb-2 d-block">COURSE TITLE</label>
            <v-text-field
              v-model="form.title"
              placeholder="e.g. Advanced Calculus"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <!-- Subject Code -->
          <v-col cols="12" md="4">
            <label class="text-detail-tiny mb-2 d-block">REGISTRY CODE</label>
            <v-text-field
              v-model="form.code"
              placeholder="MATH-101"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input uppercase-text"
              color="primary"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <!-- Category -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >DEPARTMENT / CATEGORY</label
            >
            <v-select
              v-model="form.category"
              :items="[
                'Science',
                'Mathematics',
                'Linguistics',
                'Arts',
                'Physical Ed',
              ]"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Credits -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">CREDIT WEIGHT</label>
            <v-text-field
              v-model="form.credits"
              type="number"
              placeholder="e.g. 3"
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
              >CURRICULUM OVERVIEW</label
            >
            <v-textarea
              v-model="form.description"
              placeholder="Enter course objectives and syllabus summary..."
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
            @click="$router.push('/subjects')"
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
            Register Subject
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

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("subjects"), disabled: false, to: "/subjects" },
  { title: "Add Subject", disabled: true, to: "" },
];

const form = ref({
  title: "",
  code: "",
  category: "Mathematics",
  credits: "",
  description: "",
});

const save = () => {
  console.log("Saving subject record:", form.value);
  router.push("/subjects");
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

.uppercase-text :deep(input) {
  text-transform: uppercase;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
