<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8"
    >
      <div>
        <h1
          class="text-h4 font-weight-bold text-secondary mb-1"
          style="letter-spacing: -0.5px"
        >
          Management Reports
        </h1>
        <p class="text-body-2 text-grey-darken-1 font-weight-medium">
          Generate and manage school reports
        </p>
      </div>

      <div class="d-flex gap-3 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="text-none font-weight-bold"
          height="44"
          rounded="xl"
          prepend-icon="mdi-download"
          border
        >
          Export
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6 font-weight-bold"
          height="44"
          rounded="xl"
          elevation="4"
          prepend-icon="mdi-plus"
          to="/reports/add"
        >
          Add
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-grey text-uppercase mb-1 tracking-wide"
              >
                ລາຍງານທັງໝົດ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">
                {{ reports.length }}
              </h2>
            </div>
            <v-avatar
              color="blue-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="blue-darken-2" size="26"
                >mdi-file-document-multiple</v-icon
              >
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-grey text-uppercase mb-1 tracking-wide"
              >
                ລາຍງານສຳເລັດ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">
                {{ reports.filter((r) => r.status === "ສຳເລັດ").length }}
              </h2>
            </div>
            <v-avatar
              color="green-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="green-darken-2" size="26">mdi-check-circle</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-grey text-uppercase mb-1 tracking-wide"
              >
                ກຳລັງປະມວນຜົນ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">2</h2>
            </div>
            <v-avatar
              color="purple-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="purple-darken-2" size="26"
                >mdi-progress-clock</v-icon
              >
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-grey text-uppercase mb-1 tracking-wide"
              >
                ດາວໂຫຼດທັງໝົດ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">156</h2>
            </div>
            <v-avatar
              color="orange-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="orange-darken-2" size="26">mdi-download</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" rounded="xl" class="bean-card pa-6">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8 gap-4"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search"
          variant="outlined"
          density="comfortable"
          hide-details
          class="cream-input"
          style="max-width: 380px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="lg"
        ></v-text-field>

        <div class="d-flex gap-3 align-center flex-wrap">
          <v-select
            :items="[
              'ທັງໝົດ',
              'ລາຍງານຄະແນນ',
              'ລາຍງານການເງິນ',
              'ລາຍງານນັກຮຽນ',
              'ລາຍງານຄູ',
            ]"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 180px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>

          <v-select
            :items="['ທັງໝົດ', 'ສຳເລັດ', 'ກຳລັງປະມວນຜົນ', 'ລົ້ມເຫຼວ']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 150px"
            class="cream-select"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>

          <v-btn
            variant="outlined"
            color="grey-darken-1"
            class="text-none"
            height="40"
            rounded="lg"
            icon="mdi-dots-horizontal"
            border
          ></v-btn>
        </div>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="reports"
        :search="search"
        class="reports-table"
        hover
      >
        <!-- Report Name Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              :color="getReportColor(item.type)"
              size="40"
              class="mr-3 shadow-sm border-white"
            >
              <v-icon color="white" size="20">{{
                getReportIcon(item.type)
              }}</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-secondary">
                {{ item.name }}
              </div>
              <div class="text-caption text-grey-darken-1">{{ item.type }}</div>
            </div>
          </div>
        </template>

        <!-- Date Slot -->
        <template v-slot:item.date="{ item }">
          <div>
            <div class="font-weight-medium text-secondary">
              {{ item.date }}
            </div>
            <div class="text-caption text-grey-darken-1">{{ item.time }}</div>
          </div>
        </template>

        <!-- Size Slot -->
        <template v-slot:item.size="{ item }">
          <span class="font-weight-medium text-secondary">{{ item.size }}</span>
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
            size="small"
            class="font-weight-bold"
            label
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-2 justify-end">
            <v-btn
              icon="mdi-download"
              variant="text"
              color="primary"
              size="small"
              :disabled="item.status !== 'ສຳເລັດ'"
            ></v-btn>
            <v-btn
              icon="mdi-eye-outline"
              variant="text"
              color="grey-darken-1"
              size="small"
            ></v-btn>
            <v-btn
              icon="mdi-trash-can-outline"
              variant="text"
              color="error"
              size="small"
            ></v-btn>
          </div>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-8 border-t">
            <div class="text-caption text-grey-darken-1 font-weight-bold">
              Showing <strong class="text-secondary">1</strong> to
              <strong class="text-secondary">{{ reports.length }}</strong> of
              <strong class="text-secondary">{{ reports.length }}</strong>
              results
            </div>
            <div class="d-flex gap-2 align-center">
              <v-btn
                icon
                variant="outlined"
                color="grey-lighten-1"
                size="small"
                rounded="lg"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                size="small"
                elevation="2"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 32px; height: 32px"
                >1</v-btn
              >
              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 32px; height: 32px"
                >2</v-btn
              >
              <v-btn
                icon
                variant="outlined"
                color="grey-lighten-1"
                size="small"
                rounded="lg"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n();
const search = ref("");

const breadcrumbs = [
  { title: "Dashboard", disabled: false, to: "/" },
  { title: "Reports", disabled: true, to: "/reports" },
];

const headers = [
  { title: "ລາຍລະອຽດ", key: "name", align: "start" as const, sortable: true },
  { title: "ວັນທີສ້າງ", key: "date", align: "start" as const, sortable: true },
  { title: "ຂະໜາດ", key: "size", align: "start" as const, sortable: true },
  { title: "ສະຖານະ", key: "status", align: "start" as const, sortable: true },
  {
    title: t("actions"),
    key: "actions",
    align: "end" as const,
    sortable: false,
  },
].map((h) => ({
  ...h,
  class:
    "text-caption font-weight-bold text-grey-darken-1 pb-4 text-uppercase tracking-wider",
}));

const reports = ref([
  {
    id: 1,
    name: "ລາຍງານຄະແນນ ພາກຮຽນ 1",
    type: "ລາຍງານຄະແນນ",
    date: "15/12/2024",
    time: "09:30",
    size: "2.5 MB",
    status: "ສຳເລັດ",
  },
  {
    id: 2,
    name: "ລາຍງານການເງິນ ເດືອນ 12",
    type: "ລາຍງານການເງິນ",
    date: "14/12/2024",
    time: "14:00",
    size: "1.8 MB",
    status: "ສຳເລັດ",
  },
  {
    id: 3,
    name: "ລາຍງານນັກຮຽນ ປະຈຳປີ",
    type: "ລາຍງານນັກຮຽນ",
    date: "13/12/2024",
    time: "11:15",
    size: "5.2 MB",
    status: "ກຳລັງປະມວນຜົນ",
  },
  {
    id: 4,
    name: "ລາຍງານຄູ ປະຈຳເດືອນ",
    type: "ລາຍງານຄູ",
    date: "12/12/2024",
    time: "10:00",
    size: "1.2 MB",
    status: "ສຳເລັດ",
  },
  {
    id: 5,
    name: "ລາຍງານຄະແນນ ພາກຮຽນ 2",
    type: "ລາຍງານຄະແນນ",
    date: "11/12/2024",
    time: "16:30",
    size: "0 MB",
    status: "ກຳລັງປະມວນຜົນ",
  },
]);

const getReportColor = (type: string) => {
  if (type === "ລາຍງານຄະແນນ") return "primary";
  if (type === "ລາຍງານການເງິນ") return "success";
  if (type === "ລາຍງານນັກຮຽນ") return "purple";
  return "orange";
};

const getReportIcon = (type: string) => {
  if (type === "ລາຍງານຄະແນນ") return "mdi-chart-bar";
  if (type === "ລາຍງານການເງິນ") return "mdi-cash";
  if (type === "ລາຍງານນັກຮຽນ") return "mdi-account-group";
  return "mdi-account-tie";
};
</script>

<style scoped>
/* Cream UI Variables */
.dashboard-container {
  /* --cream-bg: #fafaf5; */
}

.gap-4 {
  gap: 16px;
}
.gap-3 {
  gap: 12px;
}
.gap-2 {
  gap: 8px;
}

/* Bean Card Styling */
.bean-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0 !important;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
  transition: all 0.3s ease;
}

.bean-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.025) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

/* Table Styling */
:deep(.v-data-table) {
  background: transparent !important;
}

:deep(.v-data-table__tr:hover .v-data-table__td) {
  background-color: #f8fafc !important; /* Soft Slate Hover */
}

:deep(.v-data-table__th) {
  background-color: transparent !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #f1f5f9 !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  height: 72px !important;
}

/* Input Customization */
.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.cream-input :deep(.v-field--focused .v-field__outline__start),
.cream-input :deep(.v-field--focused .v-field__outline__end),
.cream-input :deep(.v-field--focused .v-field__outline__notch) {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 1px !important;
}

.cream-select :deep(.v-field__outline__start),
.cream-select :deep(.v-field__outline__end),
.cream-select :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

/* Typography Tools */
.tracking-wide {
  letter-spacing: 0.05em;
}
.tracking-wider {
  letter-spacing: 0.08em;
}

.border-cream {
  border: 2px solid #ffffff;
}
.border-t {
  border-top: 1px solid #e2e8f0;
}
.shadow-sm {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
