<template>
  <div class="page page--narrow">
    <PageHeader
      :title="isEdit ? $t('edit-transaction') : $t('new-transaction')"
      :subtitle="$t('record-revenue-expense')"
      icon="mdi-cash-plus"
      :breadcrumbs="breadcrumbs"
      back="/financial"
    />

    <v-card elevation="0" class="panel fade-in">
      <v-form ref="formRef" @submit.prevent="save">
        <!-- Transaction details -->
        <div class="form-section">
          <v-icon size="16">mdi-swap-horizontal</v-icon>
          {{ $t("details") }}
        </div>

        <v-row>
          <!-- Transaction Type -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ $t("transaction-category") }}</label>
            <v-select
              v-model="form.type"
              :items="[
                { title: $t('income'), value: 'income' },
                { title: $t('expense'), value: 'expense' },
              ]"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :prepend-inner-icon="
                form.type === 'income' ? 'mdi-arrow-bottom-left' : 'mdi-arrow-top-right'
              "
            ></v-select>
          </v-col>

          <!-- Category -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ $t("category") }}</label>
            <v-select
              v-model="form.category"
              :items="categoryOptions"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              prepend-inner-icon="mdi-shape-outline"
            ></v-select>
          </v-col>

          <!-- Amount -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ $t("amount") }}</label>
            <MoneyInput
              v-model="form.amount"
              placeholder="0"
              variant="outlined"
              density="comfortable"
              class="font-weight-black"
              color="primary"
              hide-details="auto"
              prepend-inner-icon="mdi-cash"
              :rules="[rules.required, rules.positive]"
            ></MoneyInput>
          </v-col>

          <!-- Date -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ $t("transaction-date") }}</label>
            <DialogDate
              v-model="showDatePicker"
              :date="form.transaction_date"
              @update:date="form.transaction_date = $event"
            />
            <v-text-field
              v-model="form.transaction_date"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              prepend-inner-icon="mdi-calendar"
              readonly
              @click="showDatePicker = true"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Payment -->
        <div class="form-section mt-6">
          <v-icon size="16">mdi-credit-card-outline</v-icon>
          {{ $t("payment-method") }}
        </div>

        <v-row>
          <!-- Method -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ $t("payment-method") }}</label>
            <v-select
              v-model="form.method"
              :items="[
                { title: $t('cash'), value: 'Cash' },
                { title: $t('bank-transfer'), value: 'Bank Transfer' },
                { title: $t('online-payment'), value: 'Online Payment' },
              ]"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              prepend-inner-icon="mdi-wallet-outline"
            ></v-select>
          </v-col>

          <!-- Status -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ $t("status") }}</label>
            <v-select
              v-model="form.status"
              :items="[
                { title: $t('paid'), value: 'paid' },
                { title: $t('pending'), value: 'pending' },
              ]"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              prepend-inner-icon="mdi-check-decagram-outline"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Notes -->
        <div class="form-section mt-6">
          <v-icon size="16">mdi-text-box-outline</v-icon>
          {{ $t("description") }}
        </div>

        <v-row>
          <v-col cols="12">
            <label class="field-label">{{ $t("transaction-notes") }}</label>
            <v-textarea
              v-model="form.description"
              :placeholder="$t('description-optional')"
              variant="outlined"
              density="comfortable"
              color="primary"
              rows="3"
              auto-grow
              hide-details="auto"
            ></v-textarea>
          </v-col>
        </v-row>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-4"
        >
          {{ errorMessage }}
        </v-alert>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="router.push('/financial')"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            type="submit"
            :loading="loading"
          >
            <v-icon icon="mdi-check" start size="18"></v-icon>
            {{ $t("confirm-transaction") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
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

const form = ref<{
  type: string;
  category: string;
  amount: number | string;
  transaction_date: string;
  method: string;
  status: string;
  description: string;
}>({
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
/* All styling comes from the global design system (.page--narrow, .panel,
   .form-section, .field-label, .form-actions). Nothing page-specific needed. */
</style>
