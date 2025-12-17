<template>
  <v-container fluid class="pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">
          <span>{{ $t("management") }} {{ $t("subject") }}</span>
        </h1>
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
          {{ t("export") }}
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6"
          height="40"
          rounded="lg"
          elevation="0"
          prepend-icon="mdi-plus"
          to="/subjects/add"
        >
          {{ $t("add") }}
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
              <p class="text-caption text-grey-darken-1 mb-1">total subjects</p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">
                {{ subjects.length }}
              </h2>
            </div>
            <v-avatar color="teal-lighten-5" size="56">
              <v-icon color="teal" size="28">mdi-book-open-page-variant</v-icon>
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
              <p class="text-caption text-grey-darken-1 mb-1">
                active subjects
              </p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">
                {{ subjects.filter((s) => s.status === "Active").length }}
              </h2>
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
              <p class="text-caption text-grey-darken-1 mb-1">total teachers</p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">12</h2>
            </div>
            <v-avatar color="purple-lighten-5" size="56">
              <v-icon color="purple" size="28">mdi-account-tie</v-icon>
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
              <p class="text-caption text-grey-darken-1 mb-1">avg students</p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">280</h2>
            </div>
            <v-avatar color="orange-lighten-5" size="56">
              <v-icon color="orange" size="28">mdi-account-group</v-icon>
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
          :placeholder="$t('search')"
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
          ></v-select>

          <v-select
            :items="['All Statuses', 'Active', 'Inactive']"
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
        :items="subjects"
        :search="search"
        class="subject-table"
        hover
      >
        <!-- Subject Name Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar color="teal-lighten-5" size="48" class="mr-3 rounded-lg">
              <v-icon
                icon="mdi-book-open-page-variant"
                size="24"
                color="teal"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-grey-darken-4">
                {{ item.title }}
              </div>
              <div class="text-caption text-grey-darken-1">{{ item.id }}</div>
            </div>
          </div>
        </template>

        <!-- Grade Slot -->
        <template v-slot:item.grade="{ item }">
          <div>
            <div class="font-weight-medium text-grey-darken-3">
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
              <div class="text-body-2 font-weight-medium text-grey-darken-3">
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
              <strong>{{ subjects.length }}</strong> {{ $t("of") }}
              <strong>{{ subjects.length }}</strong> {{ $t("results") }}
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

              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-medium"
                style="min-width: 32px; height: 32px"
              >
                3
              </v-btn>

              <span class="text-grey-darken-1 mx-2">...</span>

              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-medium"
                style="min-width: 32px; height: 32px"
              >
                10
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
import { ref } from "vue";
const { t } = useI18n();

const search = ref("");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("subject"), disabled: true, to: "/subjects" },
];

const headers = [
  {
    title: t("subject"),
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
  class: "text-caption font-weight-bold text-grey-darken-1 pb-4",
}));

const subjects = ref([
  {
    id: "#SUB-001",
    title: "Mathematics",
    grade: "Grade 10",
    students: 280,
    teacher: "Sarah Wilson",
    teacherEmail: "s.wilson@school.com",
    status: "Active",
  },
  {
    id: "#SUB-002",
    title: "Physics",
    grade: "Grade 11",
    students: 250,
    teacher: "James Miller",
    teacherEmail: "j.miller@school.com",
    status: "Active",
  },
  {
    id: "#SUB-003",
    title: "English Literature",
    grade: "Grade 10",
    students: 300,
    teacher: "Emily Davis",
    teacherEmail: "e.davis@school.com",
    status: "Active",
  },
  {
    id: "#SUB-004",
    title: "History",
    grade: "Grade 9",
    students: 220,
    teacher: "Robert Brown",
    teacherEmail: "r.brown@school.com",
    status: "Active",
  },
  {
    id: "#SUB-005",
    title: "Computer Science",
    grade: "Grade 12",
    students: 350,
    teacher: "Michael Chen",
    teacherEmail: "m.chen@school.com",
    status: "Active",
  },
]);
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
