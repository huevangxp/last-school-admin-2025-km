<template>
  <v-container fluid class="pa-6 dashboard-container">
    <!-- Quick Actions Bar: Intelligence Style -->
    <div class="d-flex justify-end mb-6 fade-in">
      <div class="action-stack d-flex ga-2">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
        >
          <v-icon icon="mdi-file-download-outline" start size="18"></v-icon>
          Export
        </v-btn>

        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          to="/academic/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Matrix: Academic KPIs -->
    <v-row class="mb-6 ga-y-4">
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="(stat, i) in academicStats"
        :key="i"
      >
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

    <!-- Main Repository: Intelligence Area -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <!-- Search & Contextual Filters -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          :placeholder="$t('search')"
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
            :items="['All Years', '2023-24', '2024-25']"
            density="compact"
            variant="outlined"
            hide-details
            rounded="lg"
            style="min-width: 130px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>
        </div>
      </div>

      <!-- Data Intelligence Grid -->
      <v-data-table
        :headers="headers"
        :items="academics"
        :search="search"
        class="premium-table"
        hover
      >
        <template v-slot:item.id="{ index }">
          <span class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded">
            {{ index + 1 }}
          </span>
        </template>

        <!-- Academic Year Descriptor Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="blue-lighten-5"
              size="32"
              class="mr-3 elevation-1 border-white"
              rounded="lg"
            >
              <v-icon
                icon="mdi-calendar-range"
                size="16"
                color="blue-darken-2"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.title }}</div>
              <div class="text-detail-tiny">{{ hiddenId(item.id) }}</div>
            </div>
          </div>
        </template>

        <!-- Dates Specification Slot -->
        <template v-slot:item.startDate="{ item }">
          <div class="text-title-small">{{ formatDate(item.start_date) }}</div>
        </template>

        <template v-slot:item.endDate="{ item }">
          <div class="text-title-small">{{ formatDate(item.end_date) }}</div>
        </template>

        <!-- Lifecycle Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="
              item.status === 'active'
                ? 'success'
                : item.status === 'upcoming'
                  ? 'info'
                  : 'warning'
            "
            size="x-small"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Intelligence Actions Slot -->
        <template v-slot:item.action="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              icon="mdi-pencil-outline"
              size="x-small"
              variant="text"
              color="primary"
            ></v-btn>
            <v-btn
              icon="mdi-trash-can-outline"
              size="x-small"
              variant="text"
              color="error"
            ></v-btn>
          </div>
        </template>

        <!-- Navigation Architecture Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Displaying 1-{{ academics.length }} of
              {{ academics.length }} academic records
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
import { storeToRefs } from "pinia";
import { useAcademicStore } from "@/stores/apiAcademic";
import { formatDate, hiddenId } from "@/utils/formatDate";
const { t } = useI18n();

const search = ref("");
const academicStore = useAcademicStore();
const { fetchAcademics } = academicStore;
const { academics } = storeToRefs(academicStore);

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("academic"), disabled: true, to: "/academic" },
];

const academicStats = [
  {
    label: "Total Sessions",
    value: "12",
    icon: "mdi-calendar-range",
    color: "blue",
  },
  {
    label: "Active Year",
    value: "2024-25",
    icon: "mdi-check-circle",
    color: "green",
  },
  {
    label: "Students",
    value: "3,450",
    icon: "mdi-account-group",
    color: "purple",
  },
  {
    label: "Efficiency",
    value: "95%",
    icon: "mdi-chart-line",
    color: "orange",
  },
];

const headers = [
  { title: "ID", key: "id", align: "start" as const, sortable: true },
  {
    title: t("academic"),
    key: "title",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("start_date"),
    key: "startDate",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("end_date"),
    key: "endDate",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("status"),
    key: "status",
    align: "start" as const,
    sortable: true,
  },
  { title: "", key: "action", align: "end" as const, sortable: false },
].map((h) => ({
  ...h,
  class: "text-detail-tiny pb-2",
}));

onMounted(() => {
  fetchAcademics();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
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
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.intelligence-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.05);
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
