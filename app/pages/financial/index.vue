<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-title mb-1">Financial Management</h1>
        <p class="text-detail">
          Track revenue, expenses, and transaction history.
        </p>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="modern-action-btn secondary border"
          height="32"
          prepend-icon="mdi-tray-arrow-down"
        >
          Export
        </v-btn>

        <v-btn
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="32"
          prepend-icon="mdi-plus"
          to="/financial/add"
        >
          Add
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in financeStats" :key="i">
        <v-card
          class="metric-card pa-4 d-flex flex-column justify-space-between h-100"
          elevation="0"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p class="text-detail-tiny mb-1">
                {{ stat.label }}
              </p>
              <h2 class="text-title">{{ stat.value }}</h2>
            </div>
            <v-avatar
              :color="`${stat.color}-lighten-5`"
              rounded="0"
              size="40"
              class="metric-icon-box"
            >
              <v-icon :color="`${stat.color}-darken-2`" size="18">{{
                stat.icon
              }}</v-icon>
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2" v-if="stat.trend">
            <v-icon
              :icon="
                stat.trendUp ? 'mdi-arrow-up-right' : 'mdi-arrow-down-right'
              "
              :color="stat.trendUp ? 'green-darken-1' : 'red-darken-1'"
              size="12"
              class="mr-1"
            ></v-icon>
            <span
              :class="`text-detail-tiny font-weight-black text-${stat.trendUp ? 'green' : 'red'}-darken-2`"
              >{{ stat.trend }}</span
            >
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search transactions..."
          variant="outlined"
          density="compact"
          hide-details
          class="cream-input"
          style="max-width: 320px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="0"
        ></v-text-field>

        <div class="d-flex gap-2 align-center flex-wrap">
          <v-select
            :items="['Total', 'Income', 'Expense']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="0"
            style="min-width: 130px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>

          <v-btn
            variant="outlined"
            color="grey-darken-1"
            class="modern-action-btn secondary border"
            height="32"
            width="32"
            icon="mdi-dots-horizontal"
          ></v-btn>
        </div>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="transactions"
        :search="search"
        class="premium-table"
        hover
      >
        <!-- ID Slot -->
        <template v-slot:item.id="{ item }">
          <span class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded-0">
            {{ item.id }}
          </span>
        </template>

        <!-- Description Slot -->
        <template v-slot:item.description="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              :color="
                item.type === 'income' ? 'green-lighten-5' : 'red-lighten-5'
              "
              size="32"
              class="mr-3 elevation-1 border-white"
            >
              <v-icon
                :color="
                  item.type === 'income' ? 'green-darken-1' : 'red-darken-1'
                "
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
                {{ item.description }}
              </div>
              <div class="text-detail-tiny text-grey">
                {{ item.category }}
              </div>
            </div>
          </div>
        </template>

        <!-- Amount Slot -->
        <template v-slot:item.amount="{ item }">
          <span
            :class="
              item.type === 'income'
                ? 'text-green-darken-2'
                : 'text-red-darken-2'
            "
            class="text-title-small"
          >
            {{ item.type === "income" ? "+" : "-" }}₭{{ item.amount }}
          </span>
        </template>

        <!-- Date Slot -->
        <template v-slot:item.date="{ item }">
          <div>
            <div class="text-title-small">
              {{ item.date }}
            </div>
            <div class="text-detail-tiny text-grey">
              {{ item.time }}
            </div>
          </div>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="
              item.status === 'ຊຳລະແລ້ວ'
                ? 'success'
                : item.status === 'ຄ້າງຊຳລະ'
                  ? 'warning'
                  : 'grey'
            "
            size="x-small"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye-outline"
            variant="text"
            size="x-small"
            color="primary"
          ></v-btn>
          <v-btn
            icon="mdi-pencil-outline"
            variant="text"
            size="x-small"
            color="secondary"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
const { t } = useI18n();
const search = ref("");

const breadcrumbs = [
  { title: "Dashboard", disabled: false, to: "/" },
  { title: "Financial", disabled: true, to: "/financial" },
];

const financeStats = [
  {
    label: "Total Income",
    value: "₭45.2M",
    icon: "mdi-cash-plus",
    color: "green",
    trend: "+12.5%",
    trendUp: true,
  },
  {
    label: "Total Expense",
    value: "₭28.7M",
    icon: "mdi-cash-minus",
    color: "red",
    trend: "+5.2%",
    trendUp: false,
  },
  {
    label: "Balance",
    value: "₭16.5M",
    icon: "mdi-wallet-outline",
    color: "purple",
  },
  {
    label: "Pending",
    value: "15",
    icon: "mdi-clock-time-four-outline",
    color: "orange",
  },
];

const headers = [
  { title: "ID", key: "id", align: "start" as const, sortable: true },
  {
    title: "Description",
    key: "description",
    align: "start" as const,
    sortable: true,
  },
  { title: "Amount", key: "amount", align: "start" as const, sortable: true },
  { title: "Date", key: "date", align: "start" as const, sortable: true },
  { title: "Status", key: "status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({
  ...h,
  class: "text-detail-tiny pb-2",
}));

const transactions = ref([
  {
    id: "#TXN-001",
    description: "ຄ່າຮຽນ - ນັກຮຽນໃໝ່",
    category: "Tuition",
    type: "income",
    amount: "2,500,000",
    date: "15/12/2024",
    time: "09:30",
    status: "ຊຳລະແລ້ວ",
  },
  {
    id: "#TXN-002",
    description: "ເງິນເດືອນຄູ",
    category: "Salary",
    type: "expense",
    amount: "8,000,000",
    date: "14/12/2024",
    time: "14:00",
    status: "ຊຳລະແລ້ວ",
  },
  {
    id: "#TXN-003",
    description: "ຄ່າອຸປະກອນການສອນ",
    category: "Supplies",
    type: "expense",
    amount: "1,200,000",
    date: "13/12/2024",
    time: "11:15",
    status: "ຊຳລະແລ້ວ",
  },
  {
    id: "#TXN-004",
    description: "ຄ່າຮຽນ - ພາກຮຽນ 2",
    category: "Tuition",
    type: "income",
    amount: "3,000,000",
    date: "12/12/2024",
    time: "10:00",
    status: "ຄ້າງຊຳລະ",
  },
  {
    id: "#TXN-005",
    description: "ຄ່າໄຟຟ້າ",
    category: "Utilities",
    type: "expense",
    amount: "500,000",
    date: "11/12/2024",
    time: "16:30",
    status: "ຊຳລະແລ້ວ",
  },
]);
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.modern-action-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  padding: 0 12px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}

.metric-card {
  border-radius: 10px !important;
  background: white;
  border: 1px solid #f1f5f9;
}

.metric-icon-box {
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intelligence-card {
  border-radius: 10px !important;
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

.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.border-white {
  border: 1.5px solid #ffffff;
}

.border-t {
  border-top: 1px solid #f1f5f9;
}
</style>
