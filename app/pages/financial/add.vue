<template>
  <v-container fluid class="pa-4 pa-md-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="emerald-lighten-5" size="40" class="mr-3 rounded-0">
          <v-icon color="emerald-darken-1" size="20">mdi-cash-plus</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-title">
            {{ isEdit ? $t("edit-transaction") : $t("new-transaction") }}
          </h2>
          <p class="text-detail">{{ $t("record-revenue-expense") }}</p>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="save">
        <v-row class="ga-y-2">
          <!-- Transaction Type -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">{{
              $t("transaction-category")
            }}</label>
            <v-select
              v-model="form.type"
              :items="[
                { title: $t('income'), value: 'income' },
                { title: $t('expense'), value: 'expense' },
              ]"
              variant="outlined"
              density="compact"
              rounded="0"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Category -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">{{ $t("category") }}</label>
            <v-select
              v-model="form.category"
              :items="categoryOptions"
              item-title="title"
              item-value="value"
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
              placeholder="0"
              prefix="₭"
              variant="outlined"
              density="compact"
              rounded="0"
              class="font-weight-black"
              color="primary"
              hide-details="auto"
              type="number"
              :rules="[rules.required, rules.positive]"
            ></v-text-field>
          </v-col>

          <!-- Date -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">{{
              $t("transaction-date")
            }}</label>
            <DialogDate
              v-model="showDatePicker"
              :date="form.transaction_date"
              @update:date="form.transaction_date = $event"
            />
            <v-text-field
              v-model="form.transaction_date"
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
            <label class="text-detail-tiny mb-2 d-block">{{
              $t("payment-method")
            }}</label>
            <v-select
              v-model="form.method"
              :items="[
                { title: $t('cash'), value: 'Cash' },
                { title: $t('bank-transfer'), value: 'Bank Transfer' },
                { title: $t('online-payment'), value: 'Online Payment' },
              ]"
              variant="outlined"
              density="compact"
              rounded="0"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Status -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">{{ $t("status") }}</label>
            <v-select
              v-model="form.status"
              :items="[
                { title: $t('paid'), value: 'paid' },
                { title: $t('pending'), value: 'pending' },
              ]"
              variant="outlined"
              density="compact"
              rounded="0"
              color="primary"
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Description -->
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block">{{
              $t("transaction-notes")
            }}</label>
            <v-textarea
              v-model="form.description"
              :placeholder="$t('description-optional')"
              variant="outlined"
              density="compact"
              rounded="0"
              color="primary"
              rows="3"
              hide-details="auto"
            ></v-textarea>
          </v-col>
        </v-row>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ errorMessage }}</v-alert
        >

        <div class="d-flex justify-end ga-3 pt-8">
          <v-btn
            variant="flat"
            color="grey-lighten-4"
            class="modern-action-btn secondary border text-slate-700"
            height="40"
            @click="router.push('/financial')"
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
            {{ $t("confirm-transaction") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFinanceStore } from "~/stores/apiFinance";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const financeStore = useFinanceStore();

const editId = computed(() => (route.query.id as string) || "");
const isEdit = computed(() => !!editId.value);

const breadcrumbs = computed(() => [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("financial"), disabled: false, to: "/financial" },
  {
    title: isEdit.value ? t("edit-transaction") : t("add-record"),
    disabled: true,
    to: "",
  },
]);

const categoryOptions = computed(() =>
  [
    "registration",
    "tuition",
    "donation",
    "salary",
    "supplies",
    "utilities",
    "maintenance",
    "other",
  ].map((c) => ({ title: t(c), value: c }))
);

const showDatePicker = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const formRef = ref();

const rules = {
  required: (v: any) => (v !== "" && v != null) || t("required"),
  positive: (v: any) => Number(v) > 0 || t("required"),
};

const form = ref({
  type: "income",
  category: "registration",
  amount: "",
  transaction_date: new Date().toISOString().substring(0, 10),
  method: "Cash",
  status: "paid",
  description: "",
});

// Load the record when editing.
onMounted(async () => {
  if (!isEdit.value) return;
  try {
    const rec = await financeStore.getFinance(editId.value);
    if (rec) {
      form.value = {
        type: rec.type,
        category: rec.category || "other",
        amount: String(rec.amount ?? ""),
        transaction_date: rec.transaction_date,
        method: rec.method || "Cash",
        status: rec.status || "paid",
        description: rec.description || "",
      };
    }
  } catch {
    errorMessage.value = t("failed-to-save");
  }
});

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const payload = {
      type: form.value.type,
      category: form.value.category,
      amount: Number(form.value.amount),
      method: form.value.method,
      status: form.value.status,
      description: form.value.description || null,
      transaction_date: form.value.transaction_date,
    };
    if (isEdit.value) {
      await financeStore.updateFinance(editId.value, payload);
    } else {
      await financeStore.createFinance(payload);
    }
    router.push("/financial");
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || t("failed-to-save");
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
