<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="purple-lighten-5" size="40" class="mr-3 rounded-lg">
          <v-icon color="purple-darken-1" size="20"
            >mdi-file-chart-outline</v-icon
          >
        </v-avatar>
        <div>
          <h2 class="text-title">Generate Report</h2>
          <p class="text-detail">
            Configure parameters for custom data aggregation
          </p>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="generate">
        <v-row class="ga-y-2">
          <!-- Report Type -->
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >REPORT ARCHITECTURE</label
            >
            <v-select
              v-model="form.type"
              :items="[
                'Academic Performance',
                'Financial Audit',
                'Attendance Analytics',
                'Faculty Overview',
              ]"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Date Range -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">STARTING PERIOD</label>
            <v-text-field
              v-model="form.startDate"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">ENDING PERIOD</label>
            <v-text-field
              v-model="form.endDate"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <!-- Format -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >OUTPUT SPECIFICATION</label
            >
            <v-radio-group v-model="form.format" inline hide-details>
              <v-radio
                label="PDF Document"
                value="pdf"
                color="primary"
                class="text-detail"
              ></v-radio>
              <v-radio
                label="Excel Sheet"
                value="excel"
                color="primary"
                class="text-detail"
              ></v-radio>
            </v-radio-group>
          </v-col>

          <!-- Recipients -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >DISTRIBUTION CHANNEL</label
            >
            <v-select
              v-model="form.channel"
              :items="[
                'Download Only',
                'Email to Admin',
                'Department Broadcast',
              ]"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>
        </v-row>

        <div class="d-flex justify-end ga-3 pt-8">
          <v-btn
            variant="flat"
            color="grey-lighten-4"
            class="modern-action-btn secondary border text-slate-700"
            height="40"
            @click="$router.push('/reports')"
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
            Compile Report
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
  { title: t("reports"), disabled: false, to: "/reports" },
  { title: "Generate", disabled: true, to: "" },
];

const form = ref({
  type: "Academic Performance",
  startDate: "",
  endDate: "",
  format: "pdf",
  channel: "Download Only",
});

const generate = () => {
  console.log("Generating report:", form.value);
  alert("Report compilation started...");
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
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%) !important;
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
  border-color: #a855f7 !important;
  border-width: 1.5px !important;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
