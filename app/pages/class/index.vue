<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-title mb-1">
          {{ t("management") }} {{ t("classes") }}
        </h1>
        <p class="text-detail">Manage class sections and schedules.</p>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="modern-action-btn secondary border"
          height="32"
          prepend-icon="mdi-download"
        >
          {{ t("export") }}
        </v-btn>

        <v-btn
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="32"
          prepend-icon="mdi-plus"
          to="/class/add"
        >
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in classStats" :key="i">
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
          :placeholder="t('search')"
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
            :items="[
              'All Grades',
              'Grade 9',
              'Grade 10',
              'Grade 11',
              'Grade 12',
            ]"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
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
        :items="classes"
        :search="search"
        class="premium-table"
        hover
      >
        <!-- Class Name Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="blue-lighten-5"
              size="32"
              class="mr-3 elevation-1 border-white"
            >
              <v-icon
                icon="mdi-google-classroom"
                size="16"
                color="blue-darken-2"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.title }}</div>
              <div class="text-detail-tiny">{{ item.classId }}</div>
            </div>
          </div>
        </template>

        <!-- Grade Slot -->
        <template v-slot:item.grade="{ item }">
          <div class="text-title-small">{{ item.grade }}</div>
          <div class="text-detail-tiny text-grey">
            {{ item.students }} Students
          </div>
        </template>

        <!-- Teacher Slot -->
        <template v-slot:item.teacher="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" class="mr-2 elevation-1">
              <v-img
                :src="`https://ui-avatars.com/api/?name=${item.teacher}&background=random`"
              ></v-img>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.teacher }}</div>
              <div class="text-detail-tiny">{{ item.teacherEmail }}</div>
            </div>
          </div>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'Active' ? 'success' : 'grey'"
            size="x-small"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Showing 1-{{ classes.length }} of {{ classes.length }} results
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
  { title: t("classes"), disabled: true, to: "/class" },
];

const classStats = [
  {
    label: "Total Classes",
    value: "24",
    icon: "mdi-google-classroom",
    color: "blue",
  },
  {
    label: "Active Sections",
    value: "22",
    icon: "mdi-check-circle",
    color: "green",
  },
  {
    label: "Total Capacity",
    value: "720",
    icon: "mdi-account-group",
    color: "purple",
  },
  {
    label: "Avg Class Size",
    value: "30",
    icon: "mdi-account-multiple",
    color: "orange",
  },
];

const headers = [
  {
    title: t("classes"),
    key: "title",
    align: "start" as const,
    sortable: true,
  },
  { title: t("grade"), key: "grade", align: "start" as const, sortable: true },
  {
    title: t("teachers"),
    key: "teacher",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("status"),
    key: "status",
    align: "start" as const,
    sortable: true,
  },
].map((h) => ({
  ...h,
  class: "text-detail-tiny pb-2",
}));

const classes = ref([
  {
    classId: "#CLS-101",
    title: "Mathematics 101",
    grade: "Grade 10",
    students: 30,
    teacher: "Sarah Wilson",
    teacherEmail: "s.wilson@school.com",
    status: "Active",
  },
  {
    classId: "#CLS-102",
    title: "Physics Advanced",
    grade: "Grade 11",
    students: 28,
    teacher: "James Miller",
    teacherEmail: "j.miller@school.com",
    status: "Active",
  },
  {
    classId: "#CLS-103",
    title: "English Literature",
    grade: "Grade 10",
    students: 32,
    teacher: "Emily Davis",
    teacherEmail: "e.davis@school.com",
    status: "Active",
  },
  {
    classId: "#CLS-104",
    title: "History & Geography",
    grade: "Grade 9",
    students: 25,
    teacher: "Robert Brown",
    teacherEmail: "r.brown@school.com",
    status: "Active",
  },
  {
    classId: "#CLS-105",
    title: "Computer Science",
    grade: "Grade 12",
    students: 35,
    teacher: "Michael Chen",
    teacherEmail: "m.chen@school.com",
    status: "Active",
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
