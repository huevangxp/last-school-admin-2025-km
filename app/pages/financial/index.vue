<template>
  <v-container fluid class="pa-4 pa-md-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-title mb-1">{{ $t("financial-management") }}</h1>
        <p class="text-detail">{{ $t("financial-management-subtitle") }}</p>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="32"
          prepend-icon="mdi-plus"
          to="/financial/add"
        >
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in financeStats" :key="i">
        <v-card class="metric-card pa-4 h-100" elevation="0">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-detail-tiny mb-1">{{ stat.label }}</p>
              <h2 class="text-title">{{ stat.value }}</h2>
            </div>
            <v-avatar
              :color="`${stat.color}-lighten-5`"
              size="40"
              class="metric-icon-box"
            >
              <v-icon :color="`${stat.color}-darken-2`" size="18">{{
                stat.icon
              }}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="$t('search-transactions')"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 320px"
          bg-color="white"
          color="primary"
        ></v-text-field>

        <v-select
          v-model="typeFilter"
          :items="[
            { title: $t('total'), value: 'Total' },
            { title: $t('income'), value: 'income' },
            { title: $t('expense'), value: 'expense' },
          ]"
          variant="outlined"
          density="compact"
          hide-details
          style="min-width: 150px; max-width: 180px"
          prepend-inner-icon="mdi-filter-variant"
          color="primary"
        ></v-select>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="rows"
        :search="search"
        :loading="financeStore.loading"
        class="premium-table"
        hover
      >
        <template v-slot:no-data>
          <div class="text-detail py-8 text-center">
            {{ $t("no-transactions-yet") }}
          </div>
        </template>

        <!-- Description -->
        <template v-slot:item.description="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              :color="item.type === 'income' ? 'green-lighten-5' : 'red-lighten-5'"
              size="32"
              class="mr-3 elevation-1 border-white"
            >
              <v-icon
                :color="item.type === 'income' ? 'green-darken-1' : 'red-darken-1'"
                size="16"
              >
                {{
                  item.type === "income"
                    ? "mdi-arrow-bottom-left"
                    : "mdi-arrow-top-right"
                }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">
                {{ item.description || $t(item.category || "other") }}
              </div>
              <div class="text-detail-tiny text-grey">
                {{ $t(item.category || "other") }} · {{ item.method }}
              </div>
            </div>
          </div>
        </template>

        <!-- Amount -->
        <template v-slot:item.amount="{ item }">
          <span
            :class="item.type === 'income' ? 'text-green-darken-2' : 'text-red-darken-2'"
            class="text-title-small"
          >
            {{ item.type === "income" ? "+" : "-" }}₭{{ formatMoney(item.amount) }}
          </span>
        </template>

        <!-- Date -->
        <template v-slot:item.transaction_date="{ item }">
          <div class="text-detail">{{ formatDate(item.transaction_date) }}</div>
        </template>

        <!-- Status -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'paid' ? 'success' : 'orange'"
            size="x-small"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status === "paid" ? $t("paid") : $t("pending") }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn
              icon="mdi-pencil-outline"
              variant="text"
              size="x-small"
              color="primary"
              :to="`/financial/add?id=${item.id}`"
            ></v-btn>
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              size="x-small"
              color="error"
              @click="removeItem(item)"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useFinanceStore } from "~/stores/apiFinance";
import { useUiStore } from "~/stores/ui";
import { formatDate } from "@/utils/formatDate";
import { formatMoney } from "@/utils/money";

const { t } = useI18n();
const financeStore = useFinanceStore();
const ui = useUiStore();

const search = ref("");
const typeFilter = ref("Total");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("financial"), disabled: true, to: "/financial" },
];

const rows = computed(() =>
  typeFilter.value === "Total"
    ? financeStore.finances
    : financeStore.finances.filter((f: any) => f.type === typeFilter.value)
);

// Live totals across the whole ledger (from the store getters).
const financeStats = computed(() => [
  {
    label: t("total-income"),
    value: `₭${formatMoney(financeStore.totalIncome)}`,
    icon: "mdi-cash-plus",
    color: "green",
  },
  {
    label: t("total-expense"),
    value: `₭${formatMoney(financeStore.totalExpense)}`,
    icon: "mdi-cash-minus",
    color: "red",
  },
  {
    label: t("balance"),
    value: `₭${formatMoney(financeStore.balance)}`,
    icon: "mdi-wallet-outline",
    color: "purple",
  },
  {
    label: t("pending"),
    value: String(financeStore.pendingCount),
    icon: "mdi-clock-time-four-outline",
    color: "orange",
  },
]);

const headers = [
  { title: t("description"), key: "description", align: "start" as const, sortable: false },
  { title: t("amount"), key: "amount", align: "start" as const, sortable: true },
  { title: t("date"), key: "transaction_date", align: "start" as const, sortable: true },
  { title: t("status"), key: "status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const removeItem = async (item: any) => {
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await financeStore.deleteFinance(item.id);
    await financeStore.fetchFinances();
    ui.notify(t("deleted_successfully"), "success");
  } catch {
    ui.notify(t("failed-to-delete"), "error");
  }
};

onMounted(() => {
  financeStore.fetchFinances();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}
.modern-action-btn {
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  padding: 0 12px !important;
}
.modern-action-btn.primary {
  background: linear-gradient(135deg, #0A3154 0%, #082741 100%) !important;
  color: white !important;
}
.metric-card {
  background: white;
  border: 1px solid #f1f5f9;
}
.metric-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}
.premium-table {
  background: transparent !important;
}
:deep(.v-data-table__th) {
  background-color: #f8fafc !important;
  border-bottom: 1px solid #f1f5f9 !important;
  height: 48px !important;
}
:deep(.v-data-table__td) {
  border-bottom: 1px solid #f1f5f9 !important;
  height: 60px !important;
}
.border-white {
  border: 1.5px solid #ffffff;
}
</style>
