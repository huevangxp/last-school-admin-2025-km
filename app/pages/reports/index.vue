<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section: Intelligence Style -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8"
    >
      <div>
        <h1 class="text-title mb-1">
          {{ t("management") }} {{ t("reports") }}
        </h1>
        <p class="text-detail">
          Monitor institutional performance through automated data aggregation.
        </p>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="32"
        >
          <v-icon icon="mdi-file-export-outline" start size="16"></v-icon>
          {{ t("export") }}
        </v-btn>

        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="32"
          to="/reports/add"
        >
          <v-icon icon="mdi-plus" start size="16"></v-icon>
          {{ t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Analytics Dashboard: High Signal Metrics -->
    <v-row class="mb-8 ga-y-4">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in reportStats" :key="i">
        <v-card
          class="metric-card pa-4 d-flex flex-column justify-space-between h-100"
          elevation="0"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p class="text-detail-tiny mb-1">{{ stat.label }}</p>
              <h2 class="text-title">{{ stat.value }}</h2>
            </div>
            <v-avatar
              :color="`${stat.color}-lighten-5`"
              rounded="lg"
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

    <!-- Main Repository: Intelligence Area -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <!-- Search & Contextual Filters -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Query report archives..."
          variant="outlined"
          density="compact"
          hide-details
          class="cream-input"
          style="max-width: 320px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="lg"
        ></v-text-field>

        <div class="d-flex gap-2 align-center flex-wrap">
          <v-select
            :items="['All Domains', 'Academic', 'Financial', 'Operational']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 150px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>

          <v-btn
            variant="outlined"
            color="grey-darken-1"
            class="modern-action-btn secondary border p-0"
            height="32"
            width="32"
            min-width="32"
          >
            <v-icon icon="mdi-dots-horizontal" size="16"></v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Data Intelligence Grid -->
      <v-data-table
        :headers="headers"
        :items="reports"
        :search="search"
        class="premium-table"
        hover
      >
        <!-- Audit Descriptor Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              :color="getReportColor(item.type)"
              size="32"
              class="mr-3 elevation-1 border-white"
              rounded="lg"
            >
              <v-icon color="white" size="16">{{
                getReportIcon(item.type)
              }}</v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.name }}</div>
              <div class="text-detail-tiny">{{ item.type }}</div>
            </div>
          </div>
        </template>

        <!-- Generation Timestamp Slot -->
        <template v-slot:item.date="{ item }">
          <div class="text-title-small">{{ item.date }}</div>
          <div class="text-detail-tiny text-grey">{{ item.time }}</div>
        </template>

        <!-- Payload Specification Slot -->
        <template v-slot:item.size="{ item }">
          <span class="text-detail font-weight-black text-slate-700">{{
            item.size
          }}</span>
        </template>

        <!-- Lifecycle Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="x-small"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Intelligence Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              icon="mdi-download"
              variant="text"
              color="primary"
              size="x-small"
              :disabled="item.status !== 'ສຳເລັດ'"
            ></v-btn>
            <v-btn
              icon="mdi-eye-outline"
              variant="text"
              color="grey-darken-1"
              size="x-small"
            ></v-btn>
            <v-btn
              icon="mdi-trash-can-outline"
              variant="text"
              color="error"
              size="x-small"
            ></v-btn>
          </div>
        </template>

        <!-- Navigation Architecture Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Displaying 1-{{ reports.length }} of 1,240 archive entries
            </div>
            <div class="d-flex gap-1 align-center">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                color="grey-darken-1"
                size="x-small"
              ></v-btn>
              <v-btn
                color="primary"
                size="x-small"
                variant="flat"
                class="font-weight-black rounded-md"
                style="min-width: 24px; height: 24px"
              >
                1
              </v-btn>
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                color="grey-darken-1"
                size="x-small"
              ></v-btn>
            </div>
          </div>
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
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("reports"), disabled: true, to: "/reports" },
];

const reportStats = [
  {
    label: "Total Archives",
    value: "1,240",
    icon: "mdi-file-cabinet",
    color: "blue",
  },
  {
    label: "Verified Audits",
    value: "982",
    icon: "mdi-shield-check-outline",
    color: "green",
  },
  { label: "Query Threads", value: "12", icon: "mdi-pulse", color: "purple" },
  {
    label: "Data Egress",
    value: "45.2 GB",
    icon: "mdi-database-export-outline",
    color: "orange",
  },
];

const headers = [
  {
    title: "DOMAIN DESCRIPTION",
    key: "name",
    align: "start" as const,
    sortable: true,
  },
  {
    title: "GENERATION PERIOD",
    key: "date",
    align: "start" as const,
    sortable: true,
  },
  { title: "PAYLOAD", key: "size", align: "start" as const, sortable: true },
  {
    title: "LIFECYCLE",
    key: "status",
    align: "start" as const,
    sortable: true,
  },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({
  ...h,
  class: "text-detail-tiny pb-2",
}));

const reports = ref([
  {
    id: 1,
    name: "ລາຍງານຄະແນນ ພາກຮຽນ 1",
    type: "Grade Report",
    date: "15/12/2024",
    time: "09:30",
    size: "2.5 MB",
    status: "ສຳເລັດ",
  },
  {
    id: 2,
    name: "ລາຍງານການເງິນ ເດືອນ 12",
    type: "Finance Report",
    date: "14/12/2024",
    time: "14:00",
    size: "1.8 MB",
    status: "ສຳເລັດ",
  },
  {
    id: 3,
    name: "ລາຍງານນັກຮຽນ ປະຈຳປີ",
    type: "Student Report",
    date: "13/12/2024",
    time: "11:15",
    size: "5.2 MB",
    status: "ກຳລັງປະມວນຜົນ",
  },
  {
    id: 4,
    name: "ລາຍງານຄູ ປະຈຳເດືອນ",
    type: "Teacher Report",
    date: "12/12/2024",
    time: "10:00",
    size: "1.2 MB",
    status: "ສຳເລັດ",
  },
  {
    id: 5,
    name: "ລາຍງານຄະແນນ ພາກຮຽນ 2",
    type: "Grade Report",
    date: "11/12/2024",
    time: "16:30",
    size: "0 MB",
    status: "ກຳລັງປະມວນຜົນ",
  },
]);

const getReportColor = (type: string) => {
  if (type.includes("Grade")) return "primary";
  if (type.includes("Finance")) return "success";
  if (type.includes("Student")) return "purple";
  return "orange";
};

const getReportIcon = (type: string) => {
  if (type.includes("Grade")) return "mdi-chart-areaspline";
  if (type.includes("Finance")) return "mdi-wallet-outline";
  if (type.includes("Student")) return "mdi-account-multiple-outline";
  return "mdi-account-tie-outline";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ສຳເລັດ":
      return "success";
    case "ກຳລັງປະມວນຜົນ":
      return "info";
    default:
      return "error";
  }
};
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
  border-radius: 16px !important;
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
  border-radius: 16px !important;
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

.text-slate-700 {
  color: #334155 !important;
}

.gap-3 {
  gap: 12px;
}
.gap-2 {
  gap: 8px;
}
.gap-1 {
  gap: 4px;
}
</style>
