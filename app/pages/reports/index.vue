<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div></div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="modern-action-btn secondary border"
          height="32"
          prepend-icon="mdi-download"
        >
          Export
        </v-btn>

        <v-btn
          color="primary"
          class="modern-action-btn primary elevation-4 ml-4"
          height="32"
          prepend-icon="mdi-plus"
          to="/reports/add"
        >
          Add
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in reportStats" :key="i">
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

    <!-- Main Content Card -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search reports..."
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
            :items="['Total', 'Grades', 'Finance', 'Students']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 140px"
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
        :items="reports"
        :search="search"
        class="premium-table"
        hover
      >
        <!-- Report Name Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              :color="getReportColor(item.type)"
              size="32"
              class="mr-3 elevation-1 border-white"
            >
              <v-icon color="white" size="16">{{
                getReportIcon(item.type)
              }}</v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">
                {{ item.name }}
              </div>
              <div class="text-detail-tiny">
                {{ item.type }}
              </div>
            </div>
          </div>
        </template>

        <!-- Date Slot -->
        <template v-slot:item.date="{ item }">
          <div class="text-title-small">
            {{ item.date }}
          </div>
          <div class="text-detail-tiny text-grey">
            {{ item.time }}
          </div>
        </template>

        <!-- Size Slot -->
        <template v-slot:item.size="{ item }">
          <span class="text-detail font-weight-black">{{ item.size }}</span>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="
              item.status === 'ສຳເລັດ'
                ? 'success'
                : item.status === 'ກຳລັງປະມວນຜົນ'
                  ? 'info'
                  : 'error'
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
        </template>

        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Showing 1-{{ reports.length }} of {{ reports.length }} results
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
  { title: "Dashboard", disabled: false, to: "/" },
  { title: "Reports", disabled: true, to: "/reports" },
];

const reportStats = [
  {
    label: "Total Reports",
    value: "84",
    icon: "mdi-file-document-multiple",
    color: "blue",
  },
  { label: "Completed", value: "72", icon: "mdi-check-circle", color: "green" },
  {
    label: "Processing",
    value: "2",
    icon: "mdi-progress-clock",
    color: "purple",
  },
  { label: "Downloads", value: "156", icon: "mdi-download", color: "orange" },
];

const headers = [
  {
    title: "Description",
    key: "name",
    align: "start" as const,
    sortable: true,
  },
  {
    title: "Generated At",
    key: "date",
    align: "start" as const,
    sortable: true,
  },
  { title: "Size", key: "size", align: "start" as const, sortable: true },
  { title: "Status", key: "status", align: "start" as const, sortable: true },
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
  if (type.includes("Grade")) return "mdi-chart-bar";
  if (type.includes("Finance")) return "mdi-cash";
  if (type.includes("Student")) return "mdi-account-group";
  return "mdi-account-tie";
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
</style>
