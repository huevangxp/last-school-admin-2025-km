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
          {{ $t("management") }} {{ $t("academic") }}
        </h1>
        <p class="text-body-2 text-grey-darken-1 font-weight-medium">
          Manage academic years and terms
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
          {{ $t("export") }}
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6 font-weight-bold"
          height="44"
          rounded="xl"
          elevation="4"
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
                ສົກຮຽນທັງໝົດ
              </p>
              <h4 class="text-h4 font-weight-bold text-secondary">
                <span>{{ academics.length }}</span>
              </h4>
            </div>
            <v-avatar
              color="blue-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="blue-darken-2" size="26"
                >mdi-calendar-range</v-icon
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
                <span class="text-green-darken-1">ສົກຮຽນປີນີ້</span>
              </p>
              <h4 class="text-h4 font-weight-bold text-secondary">
                <span>2024-25</span>
              </h4>
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
                <span class="text-purple-darken-1">ສົດຮຽນຜ່ານມາ</span>
              </p>
              <h4 class="text-h4 font-weight-bold text-secondary">
                <span>3,450</span>
              </h4>
            </div>
            <v-avatar
              color="purple-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="purple-darken-2" size="26"
                >mdi-account-group</v-icon
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
                <span class="text-orange-darken-1">ສົດຮຽນຜ່ານມາ</span>
              </p>
              <h4 class="text-h4 font-weight-bold text-secondary">
                <span>95%</span>
              </h4>
            </div>
            <v-avatar
              color="orange-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="orange-darken-2" size="26">mdi-chart-line</v-icon>
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
          variant="outlined"
          :placeholder="$t('search')"
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
            :items="['All Years', '2023-2024', '2024-2025', '2025-2026']"
            density="compact"
            variant="outlined"
            hide-details
            rounded="lg"
            style="min-width: 150px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>

          <v-select
            :items="['All Statuses', 'Active', 'Completed', 'Upcoming']"
            density="compact"
            hide-details
            variant="outlined"
            rounded="lg"
            style="min-width: 150px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select"
            color="primary"
            base-color="grey-lighten-1"
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
        <template v-slot:item.id="{ index }">
          <div
            class="font-weight-bold text-secondary bg-grey-lighten-4 px-3 py-1 rounded text-center d-inline-block"
          >
            {{ index + 1 }}
          </div>
        </template>
        <!-- Academic Year Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="blue-lighten-5"
              size="46"
              class="mr-3 rounded-lg border-white shadow-sm"
            >
              <v-icon
                icon="mdi-calendar-range"
                size="24"
                color="blue-darken-2"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-secondary">
                <span>{{ item.title }}</span>
              </div>
              <div
                class="text-caption text-grey-darken-1 text-uppercase font-weight-medium"
              >
                {{ hiddenId(item.id) }}
              </div>
            </div>
          </div>
        </template>

        <!-- Start Date Slot -->
        <template v-slot:item.startDate="{ item }">
          <div>
            <div class="font-weight-bold text-secondary">
              <span>{{ formatDate(item.start_date) }}</span>
            </div>
            <div class="text-caption text-grey-darken-1">
              <span>{{ t("start_date") }}</span>
            </div>
          </div>
        </template>

        <!-- End Date Slot -->
        <template v-slot:item.endDate="{ item }">
          <div>
            <div class="font-weight-bold text-secondary">
              <span>{{ formatDate(item.end_date) }}</span>
            </div>
            <div class="text-caption text-grey-darken-1">
              <span>{{ t("end_date") }}</span>
            </div>
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
            class="font-weight-bold text-uppercase"
            label
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Action Slot -->
        <template v-slot:item.action="{ item }">
          <v-btn icon size="small" variant="text" color="grey-darken-1">
            <v-icon icon="mdi-pencil-outline"></v-icon>
          </v-btn>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div
            class="d-flex flex-column flex-md-row align-center justify-space-between pt-8 border-t"
          >
            <div
              class="text-caption text-grey-darken-1 font-weight-bold mb-4 mb-md-0"
            >
              <span>{{ $t("showing") }}</span>
              <span class="text-secondary px-1">1-{{ academics.length }}</span>
              <span> {{ $t("of") }} </span>
              <span class="text-secondary px-1">{{ academics.length }}</span>
              <span> {{ $t("results") }} </span>
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
                style="min-width: 36px; height: 36px"
              >
                1
              </v-btn>

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
    title: $t("id"),
    key: "id",
    align: "start" as const,
    sortable: true,
  },
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
  {
    title: $t("action"),
    key: "action",
    align: "start" as const,
    sortable: false,
  },
].map((h) => ({
  ...h,
  class:
    "text-caption font-weight-bold text-grey-darken-1 pb-4 text-uppercase tracking-wider",
}));

onMounted(() => {
  fetchAcademics();
});
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

.border-white {
  border: 2px solid #ffffff;
}
.border-t {
  border-top: 1px solid #e2e8f0;
}
.shadow-sm {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
