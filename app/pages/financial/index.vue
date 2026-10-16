<template>
  <div class="page">
    <PageHeader
      :title="$t('financial-management')"
      :subtitle="$t('financial-management-subtitle')"
      icon="mdi-finance"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <v-btn
          variant="flat"
          class="modern-action-btn primary"
          prepend-icon="mdi-plus"
          to="/financial/add"
        >
          {{ $t("add") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- KPI tiles -->
    <v-row class="mb-2 fade-in">
      <v-col v-for="(stat, i) in financeStats" :key="i" cols="6" lg="3">
        <StatCard
          :icon="stat.icon"
          :label="stat.label"
          :value="stat.value"
          :color="statPalette[stat.color]?.color"
          :tint="statPalette[stat.color]?.tint"
        />
      </v-col>
    </v-row>

    <!-- Ledger -->
    <v-card elevation="0" class="panel panel--flush fade-in">
      <div class="panel-head">
        <div class="min-w-0">
          <div class="panel-title">{{ $t("financial") }}</div>
          <div class="panel-sub">{{ $t("financial-management-subtitle") }}</div>
        </div>
        <span class="panel-chip">{{ rows.length }} {{ $t("total") }}</span>
      </div>

      <div class="px-4 px-md-6 pt-4 pt-md-5">
        <div class="filter-bar">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="$t('search-transactions')"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
            class="filter-search"
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
            prepend-inner-icon="mdi-filter-variant"
            color="primary"
          ></v-select>
        </div>
      </div>

      <div class="table-wrap">
        <v-data-table
          :headers="headers"
          :items="rows"
          :search="search"
          :loading="financeStore.loading"
          class="premium-table"
          hover
        >
          <template #no-data>
            <div class="pa-4">
              <EmptyState
                icon="mdi-receipt-text-outline"
                :title="$t('no-transactions-yet')"
              />
            </div>
          </template>

          <!-- Description -->
          <template #item.description="{ item }">
            <div class="d-flex align-center py-2">
              <div
                class="avatar-chip mr-3"
                :class="item.type === 'income' ? 'tx-icon--in' : 'tx-icon--out'"
              >
                <v-icon size="16">
                  {{
                    item.type === "income"
                      ? "mdi-arrow-bottom-left"
                      : "mdi-arrow-top-right"
                  }}
                </v-icon>
              </div>
              <div class="min-w-0">
                <div class="cell-title">
                  {{ item.description || $t(item.category || "other") }}
                </div>
                <div class="cell-sub">
                  {{ $t(item.category || "other") }} · {{ item.method }}
                </div>
              </div>
            </div>
          </template>

          <!-- Amount -->
          <template #item.amount="{ item }">
            <span
              class="money"
              :class="item.type === 'income' ? 'money--in' : 'money--out'"
            >
              {{ item.type === "income" ? "+" : "-" }}₭{{ formatMoney(item.amount) }}
            </span>
          </template>

          <!-- Date -->
          <template #item.transaction_date="{ item }">
            <span class="cell-sub text-no-wrap">
              {{ formatDate(item.transaction_date) }}
            </span>
          </template>

          <!-- Status -->
          <template #item.status="{ item }">
            <span
              class="status-pill"
              :class="item.status === 'paid' ? 'status-pill--green' : 'status-pill--amber'"
            >
              <span class="status-dot"></span>
              {{ item.status === "paid" ? $t("paid") : $t("pending") }}
            </span>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="row-actions">
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="small"
                color="primary"
                :to="`/financial/add?id=${item.id}`"
              ></v-btn>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="small"
                color="error"
                @click="removeItem(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
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

// Presentation only: hex palette for the KPI tiles (StatCard takes hex values).
const statPalette: Record<string, { color: string; tint: string }> = {
  green: { color: "#16a34a", tint: "#f0fdf4" },
  red: { color: "#dc2626", tint: "#fef2f2" },
  purple: { color: "#7c3aed", tint: "#f5f3ff" },
  orange: { color: "#ea580c", tint: "#fff7ed" },
};
</script>

<style scoped>
/* Income / expense direction icon */
.tx-icon--in {
  color: #15803d;
  background: #f0fdf4;
}
.tx-icon--out {
  color: #b91c1c;
  background: #fef2f2;
}

/* Signed amount: tabular digits, never wrap. */
.money {
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.money--in {
  color: #15803d;
}
.money--out {
  color: #b91c1c;
}
</style>
