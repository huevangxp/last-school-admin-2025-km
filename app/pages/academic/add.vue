<template>
  <div class="page page--narrow">
    <PageHeader
      :title="`${t('academic')} ${t('registration')}`"
      :subtitle="t('academic-registration-subtitle')"
      icon="mdi-school-outline"
      :breadcrumbs="breadcrumbs"
      back="/academic"
    >
      <template #actions>
        <span class="panel-chip panel-chip--amber">
          <v-icon size="12" class="mr-1">mdi-pencil-outline</v-icon>
          {{ t("draft-mode") }}
        </span>
      </template>
    </PageHeader>

    <v-card elevation="0" class="panel fade-in">
      <v-form ref="formRef" @submit.prevent="save">
        <!-- Primary configuration -->
        <div class="form-section">
          <v-icon size="16">mdi-calendar-range</v-icon>
          {{ t("primary-configuration") }}
        </div>
        <v-row>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("session-identifier") }} *</label>
            <v-text-field
              v-model="form.title"
              :placeholder="t('session-identifier-placeholder')"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("lifecycle-status") }} *</label>
            <v-select
              v-model="form.status"
              :items="statusOptions"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("commencement-date") }} *</label>
            <DialogDate
              v-model="showStartDatePicker"
              :date="form.startDate"
              @update:date="form.startDate = $event"
            />
            <v-text-field
              v-model="form.startDate"
              variant="outlined"
              density="comfortable"
              :placeholder="t('select-start-date')"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-calendar-start"
              readonly
              @click="showStartDatePicker = true"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("conclusion-date") }} *</label>
            <DialogDate
              v-model="showEndDatePicker"
              :date="form.endDate"
              @update:date="form.endDate = $event"
            />
            <v-text-field
              v-model="form.endDate"
              variant="outlined"
              density="comfortable"
              :placeholder="t('select-end-date')"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-calendar-end"
              readonly
              @click="showEndDatePicker = true"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Additional context -->
        <div class="form-section mt-6">
          <v-icon size="16">mdi-text-box-outline</v-icon>
          {{ t("additional-context") }}
        </div>
        <v-row>
          <v-col cols="12">
            <label class="field-label">{{ t("description") }}</label>
            <v-textarea
              v-model="form.description"
              :placeholder="t('academic-description-placeholder')"
              variant="outlined"
              density="comfortable"
              color="primary"
              rows="4"
              auto-grow
              hide-details="auto"
            ></v-textarea>
          </v-col>
        </v-row>

        <!-- Registration policy note -->
        <div class="policy-note mt-6">
          <div class="policy-note-icon">
            <v-icon size="18">mdi-information-outline</v-icon>
          </div>
          <div class="min-w-0">
            <div class="policy-note-title">{{ t("registration-policy") }}</div>
            <div class="policy-note-text">{{ t("registration-policy-text") }}</div>
          </div>
        </div>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="$router.push('/academic')"
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            type="submit"
            :loading="loading"
            :disabled="!isFormValid"
          >
            <v-icon icon="mdi-check-circle-outline" start size="18"></v-icon>
            {{ t("save") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUiStore } from "~/stores/ui";

// Creating academic years is admin-only.
definePageMeta({ requiresAdmin: true });

const { t } = useI18n();
const router = useRouter();
const ui = useUiStore();

const loading = ref(false);
const formRef = ref();

const form = ref({
  title: "",
  status: "active",
  // Default the start date to today; end date is left for the user to pick.
  startDate: new Date().toISOString().substring(0, 10),
  endDate: "",
  description: "",
});

const isFormValid = computed(() => {
  return (
    !!form.value.title &&
    !!form.value.status &&
    !!form.value.startDate &&
    !!form.value.endDate
  );
});

const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);

const statusOptions = [
  { title: t("active"), value: "active" },
  { title: t("upcoming"), value: "upcoming" },
  { title: t("archived"), value: "archived" },
];

const rules = {
  required: (v: any) => !!v || t("required"),
};

const save = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const { $axios } = useNuxtApp();
    await $axios.post("/add-academic-year", form.value);
    ui.notify(t("saved-successfully"), "success");
    router.push("/academic");
  } catch (error: any) {
    ui.notify(error.response?.data?.message || t("failed-to-save"), "error");
  } finally {
    loading.value = false;
  }
};

// Presentation-only: breadcrumbs for the page header.
const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("academic"), disabled: false, to: "/academic" },
  { title: t("add"), disabled: true, to: "" },
];
</script>

<style scoped>
/* Amber policy note shown under the form */
.policy-note {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #fffbeb;
  border: 1px solid #fde68a;
}
.policy-note-icon {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b45309;
  background: #fef3c7;
}
.policy-note-title {
  font-size: 13px;
  font-weight: 800;
  color: #92400e;
}
.policy-note-text {
  margin-top: 2px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.6;
  color: #78350f;
}
</style>
