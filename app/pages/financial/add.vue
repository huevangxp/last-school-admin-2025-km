<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="emerald-lighten-5" size="40" class="mr-3 rounded-0">
          <v-icon color="emerald-darken-1" size="20">mdi-cash-plus</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-title">{{ $t("new-transaction") }}</h2>
          <p class="text-detail">{{ $t("record-revenue-expense") }}</p>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="save">
        <v-row class="ga-y-2">
          <!-- Transaction Type -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ $t("transaction-category") }}</label
            >
            <v-select
              v-model="form.type"
              :items="[
                { title: $t('revenue'), value: 'Revenue' },
                { title: $t('expense'), value: 'Expense' },
              ]"
              variant="outlined"
              density="compact"
              rounded="0"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Amount -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">{{ $t("amount") }}</label>
            <v-text-field
              v-model="form.amount"
              placeholder="0.00"
              prefix="$"
              variant="outlined"
              density="compact"
              rounded="0"
              class="font-weight-black"
              color="primary"
              hide-details="auto"
              type="number"
            ></v-text-field>
          </v-col>

          <!-- Date -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ $t("transaction-date") }}</label
            >
            <DialogDate
              v-model="showDatePicker"
              :date="form.date"
              @update:date="form.date = $event"
            />
            <v-text-field
              v-model="form.date"
              variant="outlined"
              density="compact"
              rounded="0"
              color="primary"
              hide-details="auto"
              prepend-inner-icon="mdi-calendar"
              readonly
              @click="showDatePicker = true"
            ></v-text-field>
          </v-col>

          <!-- Method -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">{{ $t("payment-method") }}</label>
            <v-select
              v-model="form.method"
              :items="[
                { title: $t('bank-transfer'), value: 'Bank Transfer' },
                { title: $t('cash'), value: 'Cash' },
                { title: $t('online-payment'), value: 'Online Payment' },
              ]"
              variant="outlined"
              density="compact"
              rounded="0"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Note -->
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ $t("transaction-notes") }}</label
            >
            <v-textarea
              v-model="form.note"
              :placeholder="$t('transaction-notes-placeholder')"
              variant="outlined"
              density="compact"
              rounded="0"
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
            {{ $t("confirm-transaction") }}
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
  { title: t("financial"), disabled: false, to: "/financial" },
  { title: t("add-record"), disabled: true, to: "" },
];

const showDatePicker = ref(false);

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
  max-width: 1400px;
  margin: 0 auto;
}

.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}

.modern-action-btn {
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  padding: 0 16px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  color: white !important;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
