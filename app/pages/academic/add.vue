<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <v-form ref="formRef" @submit.prevent="save">
        <div class="d-flex align-center mb-6">
          <v-avatar color="primary-lighten-5" size="40" class="mr-3 rounded-lg">
            <v-icon color="primary" size="20">mdi-school-outline</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-title">{{ $t("academic") }} Registration</h2>
            <p class="text-detail">Configure new academic session parameters</p>
          </div>
        </div>

        <v-row class="ga-y-2">
          <!-- Title -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">SESSION TITLE</label>
            <v-text-field
              v-model="form.title"
              placeholder="e.g. 2023-2024"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Status -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >LIFECYCLE STATUS</label
            >
            <v-select
              v-model="form.status"
              :items="statusOptions"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <!-- Start Date -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >COMMENCEMENT DATE</label
            >
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
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-calendar"
              readonly
              @click="showStartDatePicker = true"
            ></v-text-field>
          </v-col>

          <!-- End Date -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">CONCLUSION DATE</label>
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
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-calendar"
              readonly
              @click="showEndDatePicker = true"
            ></v-text-field>
          </v-col>

          <!-- Description -->
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >ADDITIONAL CONTEXT</label
            >
            <v-textarea
              v-model="form.description"
              placeholder="Enter session details or notes..."
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
            @click="$router.push('/academic')"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="modern-action-btn primary elevation-4"
            height="40"
            type="submit"
            :loading="loading"
          >
            {{ $t("save") }}
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
  { title: "Inactive", value: "inactive" },
  { title: "Archived", value: "archived" },
];

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("academic"), disabled: false, to: "/academic" },
  { title: t("add"), disabled: true, to: "/academic/add" },
];

const rules = {
  required: (v: any) => !!v || t("required"),
};

const save = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    console.log("Form submitted:", form.value);
    const { $axios } = useNuxtApp();
    await $axios.post("/add-academic-year", form.value).then((res) => {
      form.value = {
        title: "",
        status: "active",
        startDate: "",
        endDate: "",
        description: "",
      };
      loading.value = false;
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 800px;
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
