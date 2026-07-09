<template>
  <v-container fluid class="pa-6 dashboard-container">
    <!-- Header Architecture -->
    <div class="d-flex align-center justify-space-between mb-8 fade-in">
      <div class="d-flex align-center">
        <v-btn
          variant="text"
          color="grey-darken-1"
          class="modern-action-btn grey-text px-2 mr-4"
          height="36"
          @click="$router.push('/academic')"
        >
          <v-icon icon="mdi-arrow-left" start size="20"></v-icon>
          <span class="text-detail font-weight-bold"
            >{{ $t("back-to-academic-archives") }}</span
          >
        </v-btn>
      </div>

      <div class="action-stack d-flex ga-2">
        <v-chip
          color="orange-lighten-5"
          class="text-orange-darken-2 font-weight-black"
          size="small"
          variant="flat"
        >
          {{ $t("draft-mode") }}
        </v-chip>
      </div>
    </div>

    <!-- Registration Module - Full Width Intelligence Area -->
    <v-card elevation="0" class="intelligence-card pa-8 mb-8 fade-in">
      <v-form ref="formRef" @submit.prevent="save">
        <!-- Module Identity Header -->
        <v-row class="mb-10">
          <v-col cols="12" md="8">
            <div class="d-flex align-center">
              <v-avatar
                color="primary-lighten-5"
                size="56"
                class="mr-5 rounded-0"
              >
                <v-icon color="primary" size="28">mdi-school-outline</v-icon>
              </v-avatar>
              <div>
                <div class="text-title mb-1" style="font-size: 18px !important">
                  {{ t("academic") }} {{ $t("registration") }}
                </div>
                <div class="text-detail">
                  {{ $t("academic-registration-subtitle") }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Configuration Matrix -->
        <v-row class="ga-y-6">
          <!-- Primary Details Group -->
          <v-col cols="12" lg="8">
            <div
              class="pa-6 rounded-0 bg-slate-50 border border-slate-100 mb-6"
            >
              <div class="text-detail-tiny mb-6 text-primary">
                {{ $t("primary-configuration") }}
              </div>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="text-detail-tiny mb-2">{{ $t("session-identifier") }}</div>
                  <v-text-field
                    v-model="form.title"
                    :placeholder="$t('session-identifier-placeholder')"
                    variant="outlined"
                    density="compact"
                    rounded="0"
                    class="text-detail bg-white"
                    color="primary"
                    hide-details="auto"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-detail-tiny mb-2">{{ $t("lifecycle-status") }}</div>
                  <v-select
                    v-model="form.status"
                    :items="statusOptions"
                    variant="outlined"
                    density="compact"
                    rounded="0"
                    class="text-detail bg-white"
                    color="primary"
                    hide-details="auto"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-detail-tiny mb-2">{{ $t("commencement-date") }}</div>
                  <DialogDate
                    v-model="showStartDatePicker"
                    :date="form.startDate"
                    @update:date="form.startDate = $event"
                  />
                  <v-text-field
                    v-model="form.startDate"
                    variant="outlined"
                    density="compact"
                    :placeholder="$t('select-start-date')"
                    rounded="0"
                    class="text-detail bg-white"
                    color="primary"
                    hide-details="auto"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-calendar-start"
                    readonly
                    @click="showStartDatePicker = true"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-detail-tiny mb-2">{{ $t("conclusion-date") }}</div>
                  <DialogDate
                    v-model="showEndDatePicker"
                    :date="form.endDate"
                    @update:date="form.endDate = $event"
                  />
                  <v-text-field
                    v-model="form.endDate"
                    variant="outlined"
                    density="compact"
                    :placeholder="$t('select-end-date')"
                    rounded="0"
                    class="text-detail bg-white"
                    color="primary"
                    hide-details="auto"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-calendar-end"
                    readonly
                    @click="showEndDatePicker = true"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>

            <!-- Descriptive Context -->
            <div class="pa-6 rounded-0 bg-slate-50 border border-slate-100">
              <div class="text-detail-tiny mb-4 text-primary">
                {{ $t("additional-context") }}
              </div>
              <v-textarea
                v-model="form.description"
                :placeholder="$t('academic-description-placeholder')"
                variant="outlined"
                density="compact"
                rounded="0"
                class="text-detail bg-white"
                color="primary"
                rows="4"
                hide-details="auto"
              ></v-textarea>
            </div>
          </v-col>

          <!-- Sidebar Information/Summary -->
          <v-col cols="12" lg="4">
            <div
              class="pa-6 rounded-0 bg-orange-lighten-5 border border-orange-100 h-100"
            >
              <div class="d-flex align-center mb-4">
                <v-icon color="orange-darken-2" class="mr-2"
                  >mdi-information-outline</v-icon
                >
                <span class="text-title text-orange-darken-4"
                  >{{ $t("registration-policy") }}</span
                >
              </div>
              <div class="text-detail mb-6" style="line-height: 1.6">
                {{ $t("registration-policy-text") }}
              </div>
              <v-divider class="mb-6"></v-divider>
              <div class="d-flex flex-column ga-4">
                <div class="d-flex justify-space-between text-detail-tiny">
                  <span>{{ $t("auto-sync-status") }}</span>
                  <span class="text-success">{{ $t("enabled") }}</span>
                </div>
                <div class="d-flex justify-space-between text-detail-tiny">
                  <span>{{ $t("database-commit") }}</span>
                  <span class="text-primary">{{ $t("pending") }}</span>
                </div>
              </div>

              <div class="mt-12">
                <v-btn
                  variant="flat"
                  color="primary"
                  class="modern-action-btn primary elevation-4 w-100"
                  height="44"
                  type="submit"
                  :loading="loading"
                  :disabled="!isFormValid"
                >
                  <v-icon icon="mdi-check-circle" start size="20"></v-icon>
                  {{ $t("save-configuration") }}
                </v-btn>
                <v-btn
                  variant="text"
                  color="grey-darken-1"
                  class="modern-action-btn w-100 mt-2"
                  height="40"
                  @click="$router.push('/academic')"
                >
                  {{ $t("discard-draft") }}
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
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
    // Success handling logic here
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
  background: white;
  border: 1px solid #f1f5f9;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.04) !important;
}

.bg-slate-50 {
  background-color: #f8fafc !important;
}

.grey-text {
  color: #64748b !important;
}
</style>
