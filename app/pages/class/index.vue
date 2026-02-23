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
          {{ t("management") }} {{ t("classes") }}
        </h1>
        <p class="text-body-2 text-grey-darken-1 font-weight-medium">
          Manage class sections and schedules.
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
          {{ t("export") }}
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6 font-weight-bold"
          height="44"
          rounded="xl"
          elevation="4"
          prepend-icon="mdi-plus"
          to="/class/add"
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
                total classes
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">
                {{ classes.length }}
              </h2>
            </div>
            <v-avatar
              color="blue-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="blue-darken-2" size="26"
                >mdi-google-classroom</v-icon
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
                active classes
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">
                {{ classes.filter((c) => c.status === "Active").length }}
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
                total students
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">150</h2>
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
                avg class size
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">30</h2>
            </div>
            <v-avatar
              color="orange-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="orange-darken-2" size="26"
                >mdi-account-multiple</v-icon
              >
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
          :placeholder="t('search')"
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
            style="min-width: 150px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>

          <v-select
            :items="['All Statuses', 'Active', 'Inactive']"
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
        :items="classes"
        :search="search"
        class="class-table"
        hover
      >
        <!-- Class Name Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="blue-lighten-5"
              size="48"
              class="mr-3 rounded-lg border-cream shadow-sm"
            >
              <v-icon
                icon="mdi-google-classroom"
                size="24"
                color="blue-darken-2"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-secondary">
                {{ item.title }}
              </div>
              <div class="text-caption text-grey-darken-1 font-weight-medium">
                {{ item.classId }}
              </div>
            </div>
          </div>
        </template>

        <!-- Grade Slot -->
        <template v-slot:item.grade="{ item }">
          <div>
            <div class="font-weight-bold text-secondary">
              {{ item.grade }}
            </div>
            <div class="text-caption text-grey-darken-1">
              {{ item.students }} students
            </div>
          </div>
        </template>

        <!-- Teacher Slot -->
        <template v-slot:item.teacher="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" class="mr-2">
              <v-img
                :src="`https://ui-avatars.com/api/?name=${item.teacher}&background=random`"
              ></v-img>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-medium text-secondary">
                {{ item.teacher }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ item.teacherEmail }}
              </div>
            </div>
          </div>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'Active' ? 'success' : 'grey'"
            size="small"
            class="font-weight-bold text-uppercase"
            label
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-8 border-t">
            <div class="text-caption text-grey-darken-1 font-weight-bold">
              {{ t("showing") }} <strong class="text-secondary">1</strong>
              {{ t("to") }}
              <strong class="text-secondary">{{ classes.length }}</strong>
              {{ t("of") }}
              <strong class="text-secondary">{{ classes.length }}</strong>
              {{ t("results") }}
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
              >
                1
              </v-btn>

              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 32px; height: 32px"
              >
                2
              </v-btn>

              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 32px; height: 32px"
              >
                3
              </v-btn>

              <span class="text-grey mx-2 font-weight-bold">...</span>

              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 32px; height: 32px"
              >
                10
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
import { ref } from "vue";
const { t } = useI18n();

const search = ref("");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("classes"), disabled: true, to: "/class" },
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
  class:
    "text-caption font-weight-bold text-grey-darken-1 pb-4 text-uppercase tracking-wider",
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
