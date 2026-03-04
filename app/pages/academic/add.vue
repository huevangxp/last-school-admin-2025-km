<template>
  <v-container fluid class="pa-6 dashboard-container">
    <!-- Header Section: Minimalist Intelligence Style -->
    <div class="d-flex justify-end mb-6 fade-in">
      <v-btn
        variant="flat"
        color="white"
        class="modern-action-btn secondary border"
        height="36"
        @click="$router.push('/academic')"
      >
        <v-icon icon="mdi-arrow-left" start size="18"></v-icon>
        Back to Archives
      </v-btn>
    </div>

    <!-- Registration Module -->
    <v-card
      elevation="0"
      class="intelligence-card pa-8 mx-auto"
      style="max-width: 800px"
    >
      <v-form ref="formRef" @submit.prevent="save">
        <!-- Module Identity -->
        <div class="d-flex align-center mb-10">
          <v-avatar color="primary-lighten-5" size="48" class="mr-4 rounded-xl">
            <v-icon color="primary" size="24">mdi-school-outline</v-icon>
          </v-avatar>
          <div>
            <div class="text-title mb-1">{{ t("academic") }} Registration</div>
            <div class="text-detail">
              Initialize and configure new academic parameters for the
              institution.
            </div>
          </div>
        </div>

        <v-row class="ga-y-4">
          <!-- Session Title -->
          <v-col cols="12" md="6">
            <div class="text-detail-tiny mb-2">SESSION IDENTIFIER</div>
            <v-text-field
              v-model="form.title"
              placeholder="e.g. 2024-2025"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input text-detail"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Lifecycle Status -->
          <v-col cols="12" md="6">
            <div class="text-detail-tiny mb-2">LIFECYCLE STATUS</div>
            <v-select
              v-model="form.status"
              :items="statusOptions"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input text-detail"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <!-- Commencement Date -->
          <v-col cols="12" md="6">
            <div class="text-detail-tiny mb-2">COMMENCEMENT DATE</div>
            <DialogDate
              v-model="showStartDatePicker"
              :date="form.startDate"
              @update:date="form.startDate = $event"
            />
            <v-text-field
              v-model="form.startDate"
              variant="outlined"
              density="compact"
              placeholder="Select start date"
              rounded="lg"
              class="premium-input text-detail"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-calendar-start"
              readonly
              @click="showStartDatePicker = true"
            ></v-text-field>
          </v-col>

          <!-- Conclusion Date -->
          <v-col cols="12" md="6">
            <div class="text-detail-tiny mb-2">CONCLUSION DATE</div>
            <DialogDate
              v-model="showEndDatePicker"
              :date="form.endDate"
              @update:date="form.endDate = $event"
            />
            <v-text-field
              v-model="form.endDate"
              variant="outlined"
              density="compact"
              placeholder="Select end date"
              rounded="lg"
              class="premium-input text-detail"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-calendar-end"
              readonly
              @click="showEndDatePicker = true"
            ></v-text-field>
          </v-col>

          <!-- Contextual Description -->
          <v-col cols="12">
            <div class="text-detail-tiny mb-2">ADDITIONAL CONTEXT</div>
            <v-textarea
              v-model="form.description"
              placeholder="Define operational goals or notes for this academic session..."
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input text-detail"
              color="primary"
              rows="3"
              hide-details="auto"
            ></v-textarea>
          </v-col>
        </v-row>

        <!-- Form Actions -->
        <div class="d-flex justify-end ga-3 mt-10">
          <v-btn
            variant="flat"
            color="white"
            class="modern-action-btn secondary border"
            height="36"
            @click="$router.push('/academic')"
          >
            Cancel
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="modern-action-btn primary elevation-4"
            height="36"
            type="submit"
            :loading="loading"
          >
            <v-icon icon="mdi-check" start size="18"></v-icon>
            {{ t("save") }} Configuration
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
const { t } = useI18n();

const loading = ref(false);
const formRef = ref();

const form = ref({
  title: "",
  status: "active",
  startDate: "",
  endDate: "",
  description: "",
});

const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);

const statusOptions = [
  { title: "Active", value: "active" },
  { title: "Upcoming", value: "upcoming" },
  { title: "Archived", value: "archived" },
];

const rules = {
  required: (v: any) => !!v || t("required plug-in context"),
};

const save = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const { $axios } = useNuxtApp();
    await $axios.post("/add-academic-year", form.value);
    // Success handling would go here (e.g., notification, redirect)
  } catch (error) {
    console.error(error);
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
  border-radius: 20px !important;
  background: white;
  border: 1px solid #f1f5f9;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
}

.premium-input :deep(.v-field__outline__start),
.premium-input :deep(.v-field__outline__end),
.premium-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.premium-input :deep(.v-field--focused .v-field__outline__start),
.premium-input :deep(.v-field--focused .v-field__outline__end),
.premium-input :deep(.v-field--focused .v-field__outline__notch) {
  border-color: #14b8a6 !important;
  border-width: 1.5px !important;
}

.premium-input :deep(label) {
  font-size: 12px !important;
  font-weight: 500 !important;
}
</style>
