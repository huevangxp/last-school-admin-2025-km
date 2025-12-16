<template>
  <v-container fluid class="pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">
          <span>Management Reports</span>
        </h1>
        <p class="text-body-2 text-grey-darken-1">
          Generate and manage school reports
        </p>
      </div>

      <div class="d-flex gap-3 align-center flex-wrap">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="text-none"
          height="40"
          rounded="lg"
          prepend-icon="mdi-download"
          style="border-color: #e0e0e0"
        >
          Export
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6"
          height="40"
          rounded="lg"
          elevation="0"
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
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">ລາຍງານທັງໝົດ</p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">
                {{ reports.length }}
              </h2>
              <p class="text-caption text-success mt-1">
                <v-icon size="14" color="success"
                  >mdi-file-document-multiple</v-icon
                >
                ປະຈຳເດືອນ
              </p>
            </div>
            <v-avatar color="blue-lighten-5" size="56">
              <v-icon color="blue" size="28">mdi-file-document-multiple</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">ລາຍງານສຳເລັດ</p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">
                {{ reports.filter((r) => r.status === "ສຳເລັດ").length }}
              </h2>
              <p class="text-caption text-success mt-1">
                <v-icon size="14" color="success">mdi-check-circle</v-icon>
                ພ້ອມດາວໂຫຼດ
              </p>
            </div>
            <v-avatar color="green-lighten-5" size="56">
              <v-icon color="green" size="28">mdi-check-circle</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">ກຳລັງປະມວນຜົນ</p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">2</h2>
              <p class="text-caption text-purple mt-1">
                <v-icon size="14" color="purple">mdi-progress-clock</v-icon>
                ລໍຖ້າ
              </p>
            </div>
            <v-avatar color="purple-lighten-5" size="56">
              <v-icon color="purple" size="28">mdi-progress-clock</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">ດາວໂຫຼດທັງໝົດ</p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">156</h2>
              <p class="text-caption text-orange mt-1">
                <v-icon size="14" color="orange">mdi-download</v-icon>
                ເດືອນນີ້
              </p>
            </div>
            <v-avatar color="orange-lighten-5" size="56">
              <v-icon color="orange" size="28">mdi-download</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card flat class="rounded-xl border pa-6" color="white">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-4"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search"
          variant="outlined"
          density="compact"
          hide-details
          class="search-field"
          style="max-width: 400px"
          bg-color="white"
          color="primary"
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
          ></v-select>

          <v-select
            :items="['ທັງໝົດ', 'ສຳເລັດ', 'ກຳລັງປະມວນຜົນ', 'ລົ້ມເຫຼວ']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 150px"
          ></v-select>

          <v-btn
            variant="outlined"
            color="grey-darken-1"
            class="text-none"
            height="40"
            rounded="lg"
            icon="mdi-dots-horizontal"
            style="border-color: #e0e0e0"
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
            <v-avatar :color="getReportColor(item.type)" size="40" class="mr-3">
              <v-icon color="white" size="20">{{
                getReportIcon(item.type)
              }}</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-grey-darken-4">
                {{ item.name }}
              </div>
              <div class="text-caption text-grey-darken-1">{{ item.type }}</div>
            </div>
          </div>
        </template>

        <!-- Date Slot -->
        <template v-slot:item.date="{ item }">
          <div>
            <div class="font-weight-medium text-grey-darken-3">
              {{ item.date }}
            </div>
            <div class="text-caption text-grey-darken-1">{{ item.time }}</div>
          </div>
        </template>

        <!-- Size Slot -->
        <template v-slot:item.size="{ item }">
          <span class="font-weight-medium text-grey-darken-3">{{
            item.size
          }}</span>
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
            class="font-weight-medium"
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
          <div class="d-flex align-center justify-space-between pt-6">
            <div class="text-body-2 text-grey-darken-1">
              Showing <strong>1</strong> to
              <strong>{{ reports.length }}</strong> of
              <strong>{{ reports.length }}</strong> results
            </div>
            <div class="d-flex gap-2 align-center">
              <v-btn icon variant="text" color="grey-darken-1" size="small">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                size="small"
                elevation="0"
                class="font-weight-bold"
                style="min-width: 32px; height: 32px"
                >1</v-btn
              >
              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-medium"
                style="min-width: 32px; height: 32px"
                >2</v-btn
              >
              <v-btn icon variant="text" color="grey-darken-1" size="small">
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
  class: "text-caption font-weight-bold text-grey-darken-1 pb-4",
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
.gap-4 {
  gap: 16px;
}
.gap-3 {
  gap: 12px;
}
.gap-2 {
  gap: 8px;
}

:deep(.v-data-table) {
  background: transparent !important;
}
:deep(.v-data-table__tr:hover .v-data-table__td) {
  background-color: #f5f7fa !important;
}
:deep(.v-data-table__th) {
  background-color: transparent !important;
  border-bottom: 1px solid #eeeeee !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
:deep(.v-data-table__td) {
  border-bottom: 1px solid #f5f5f5 !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  height: 64px !important;
}
:deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
</style>
