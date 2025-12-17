<template>
  <v-container fluid class="pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">
          <span> {{ $t("management") }} {{ $t("academic") }}</span>
        </h1>
        <!-- <p class="text-body-2 text-grey-darken-1">
          Manage academic years and terms
        </p> -->
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
          {{ $t("export") }}
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6"
          height="40"
          rounded="lg"
          elevation="0"
          prepend-icon="mdi-plus"
          to="/academic/add"
        >
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-4" elevation="0" style="max-width: 800px">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span>ສົກຮຽນທັງໝົດ</span>
              </p>
              <h4 class="text-h4 font-weight-bold text-grey-darken-4">
                <span>{{ academics.length }}</span>
              </h4>
            </div>
            <v-avatar color="blue-lighten-5" size="56">
              <v-icon color="blue" size="28">mdi-calendar-range</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-4" elevation="0">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span class="text-green">ສົກຮຽນປີນີ້</span>
              </p>
              <h4 class="text-h4 font-weight-bold text-grey-darken-4">
                <span>2024-25</span>
              </h4>
            </div>
            <v-avatar color="green-lighten-5" size="56">
              <v-icon color="green" size="28">mdi-check-circle</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-4" elevation="0">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span class="text-purple">ສົດຮຽນຜ່ານມາ</span>
              </p>
              <h4 class="text-h4 font-weight-bold text-grey-darken-4">
                <span>3,450</span>
              </h4>
            </div>
            <v-avatar color="purple-lighten-5" size="56">
              <v-icon color="purple" size="28">mdi-account-group</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-4" elevation="0">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span class="text-orange">ສົດຮຽນຜ່ານມາ</span>
              </p>
              <h4 class="text-h4 font-weight-bold text-grey-darken-4">
                <span>95%</span>
              </h4>
            </div>
            <v-avatar color="orange-lighten-5" size="56">
              <v-icon color="orange" size="28">mdi-chart-line</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card flat class="rounded-xl pa-6" color="white" elevation="0">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-4"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          :placeholder="$t('search')"
          density="comfortable"
          hide-details
          class="search-field transparent-border"
          style="max-width: 400px"
          bg-color="white"
          color="primary"
          rounded="lg"
          border="none"
        ></v-text-field>

        <div class="d-flex gap-3 align-center flex-wrap">
          <v-select
            :items="['All Years', '2023-2024', '2024-2025', '2025-2026']"
            density="comfortable"
            variant="outlined"
            hide-details
            rounded="lg"
            style="min-width: 150px"
            prepend-inner-icon="mdi-filter-variant"
          ></v-select>

          <v-select
            :items="['All Statuses', 'Active', 'Completed', 'Upcoming']"
            density="comfortable"
            hide-details
            variant="outlined"
            rounded="lg"
            style="min-width: 150px"
            prepend-inner-icon="mdi-filter-variant"
          ></v-select>
        </div>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="academics"
        :search="search"
        class="academic-table"
        hover
      >
        <!-- Academic Year Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="primary-lighten-5"
              size="48"
              class="mr-3 rounded-lg"
            >
              <v-icon
                icon="mdi-calendar-range"
                size="24"
                color="primary"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-grey-darken-4">
                {{ item.title }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ hiddenId(item.id) }}
              </div>
            </div>
          </div>
        </template>

        <!-- Start Date Slot -->
        <template v-slot:item.startDate="{ item }">
          <div>
            <div class="font-weight-medium text-grey-darken-3">
              {{ formatDate(item.start_date) }}
            </div>
            <div class="text-caption text-grey-darken-1">
              {{ t("start_date") }}
            </div>
          </div>
        </template>

        <!-- End Date Slot -->
        <template v-slot:item.endDate="{ item }">
          <div>
            <div class="font-weight-medium text-grey-darken-3">
              {{ formatDate(item.end_date) }}
            </div>
            <div class="text-caption text-grey-darken-1">End Date</div>
          </div>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="
              item.status === 'active'
                ? 'success'
                : item.status === 'upcoming'
                ? 'info'
                : 'warning'
            "
            size="small"
            class="font-weight-medium"
            label
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-6">
            <div class="text-body-2 text-grey-darken-1">
              {{ $t("showing") }} <strong>1</strong> {{ $t("to") }}
              <strong>{{ academics.length }}</strong> {{ $t("of") }}
              <strong>{{ academics.length }}</strong> {{ $t("results") }}
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
              >
                1
              </v-btn>

              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-medium"
                style="min-width: 32px; height: 32px"
              >
                2
              </v-btn>

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
import { storeToRefs } from "pinia";
import { useAcademicStore } from "@/stores/apiAcademic";
import { formatDate, hiddenId } from "@/utils/formatDate";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const search = ref("");

const academicStore = useAcademicStore();
const { fetchAcademics } = academicStore;
const { academics } = storeToRefs(academicStore);

const breadcrumbs = [
  { title: $t("dashboard"), disabled: false, to: "/" },
  { title: $t("academic"), disabled: true, to: "/academic" },
];

const headers = [
  {
    title: $t("academic"),
    key: "title",
    align: "start" as const,
    sortable: true,
  },
  {
    title: $t("start_date"),
    key: "startDate",
    align: "start" as const,
    sortable: true,
  },
  {
    title: $t("end_date"),
    key: "endDate",
    align: "start" as const,
    sortable: true,
  },
  {
    title: $t("status"),
    key: "status",
    align: "start" as const,
    sortable: true,
  },
].map((h) => ({
  ...h,
  class: "text-caption font-weight-bold text-grey-darken-1 pb-4",
}));

onMounted(() => {
  fetchAcademics();
});
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

/* Customizing Table Styles */
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
  height: 60px !important;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
</style>
