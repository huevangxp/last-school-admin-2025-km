<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="emerald-lighten-5" size="40" class="mr-3 rounded-lg">
          <v-icon color="emerald-darken-1" size="20">mdi-cash-plus</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-title">New Transaction</h2>
          <p class="text-detail">Record revenue or expense entries</p>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="save">
        <v-row class="ga-y-2">
          <!-- Transaction Type -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >TRANSACTION CATEGORY</label
            >
            <v-select
              v-model="form.type"
              :items="['Revenue', 'Expense']"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Amount -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">AMOUNT</label>
            <v-text-field
              v-model="form.amount"
              placeholder="0.00"
              prefix="$"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input font-weight-black"
              color="primary"
              hide-details="auto"
              type="number"
            ></v-text-field>
          </v-col>

          <!-- Date -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >TRANSACTION DATE</label
            >
            <v-text-field
              v-model="form.date"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <!-- Method -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">PAYMENT METHOD</label>
            <v-select
              v-model="form.method"
              :items="['Bank Transfer', 'Cash', 'Online Payment']"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Note -->
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >TRANSACTION NOTES</label
            >
            <v-textarea
              v-model="form.note"
              placeholder="e.g. Q1 Student Fees, Maintenance..."
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
            @click="$router.push('/financial')"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="modern-action-btn primary elevation-4"
            height="40"
            type="submit"
          >
            Confirm Transaction
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
  { title: "Financial", disabled: false, to: "/financial" },
  { title: "Add Record", disabled: true, to: "" },
];

const form = ref({
  type: "Revenue",
  amount: "",
  date: new Date().toISOString().substring(0, 10),
  method: "Bank Transfer",
  note: "",
});

const save = () => {
  console.log("Saving financial record:", form.value);
  router.push("/financial");
};
</script>

<style scoped>
.dashboard-container {
  max-width: 800px;
  margin: 0 auto;
}

.intelligence-card {
  border-radius: 10px !important;
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
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
  border-color: #10b981 !important;
  border-width: 1.5px !important;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
