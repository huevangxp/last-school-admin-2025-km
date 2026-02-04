<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8"
    >
      <div>
        <h1
          class="text-h4 font-weight-bold text-brown-darken-4 mb-1"
          style="letter-spacing: -0.5px"
        >
          {{ $t("management") }} {{ $t("subject") }}
        </h1>
        <p class="text-body-2 text-brown-lighten-1 font-weight-medium">
          Oversee curriculum and course management.
        </p>
      </div>

      <div class="d-flex gap-3 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="brown-lighten-2"
          class="text-none font-weight-bold"
          height="44"
          rounded="xl"
          prepend-icon="mdi-tray-arrow-down"
          border
        >
          {{ t("export") }}
        </v-btn>

        <v-btn
          color="brown-darken-3"
          class="text-none px-6 font-weight-bold"
          height="44"
          rounded="xl"
          elevation="4"
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
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-brown-lighten-2 text-uppercase mb-1 tracking-wide"
              >
                total subjects
              </p>
              <h2 class="text-h4 font-weight-bold text-brown-darken-4">
                {{ subjects.length }}
              </h2>
            </div>
            <v-avatar
              color="teal-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="teal-darken-2" size="26"
                >mdi-book-open-page-variant-outline</v-icon
              >
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2">
            <span class="text-caption font-weight-medium text-brown-lighten-2"
              >Curriculum offerings</span
            >
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
                class="text-caption font-weight-bold text-brown-lighten-2 text-uppercase mb-1 tracking-wide"
              >
                active subjects
              </p>
              <h2 class="text-h4 font-weight-bold text-brown-darken-4">
                {{ subjects.filter((s) => s.status === "Active").length }}
              </h2>
            </div>
            <v-avatar
              color="green-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="green-darken-2" size="26"
                >mdi-check-circle-outline</v-icon
              >
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2">
            <span class="text-caption font-weight-medium text-brown-lighten-2"
              >Currently in session</span
            >
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
                class="text-caption font-weight-bold text-brown-lighten-2 text-uppercase mb-1 tracking-wide"
              >
                total teachers
              </p>
              <h2 class="text-h4 font-weight-bold text-brown-darken-4">12</h2>
            </div>
            <v-avatar
              color="purple-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="purple-darken-2" size="26"
                >mdi-account-tie-outline</v-icon
              >
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2">
            <span class="text-caption font-weight-medium text-brown-lighten-2"
              >Assigned instructors</span
            >
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
                class="text-caption font-weight-bold text-brown-lighten-2 text-uppercase mb-1 tracking-wide"
              >
                avg students
              </p>
              <h2 class="text-h4 font-weight-bold text-brown-darken-4">280</h2>
            </div>
            <v-avatar
              color="orange-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="orange-darken-2" size="26"
                >mdi-account-group-outline</v-icon
              >
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2">
            <span class="text-caption font-weight-medium text-brown-lighten-2"
              >Per subject</span
            >
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
          color="brown-darken-2"
          base-color="brown-lighten-3"
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
            color="brown-darken-2"
            base-color="brown-lighten-3"
            class="cream-select"
            style="min-width: 160px"
            prepend-inner-icon="mdi-filter-variant"
          ></v-select>

          <v-select
            :items="['All Statuses', 'Active', 'Inactive']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            color="brown-darken-2"
            base-color="brown-lighten-3"
            class="cream-select"
            style="min-width: 160px"
          ></v-select>

          <v-btn
            variant="outlined"
            color="brown-lighten-2"
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
        :items="subjects"
        :search="search"
        class="subject-table"
        hover
      >
        <!-- Subject Name Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="teal-lighten-5"
              size="46"
              class="mr-3 rounded-lg border-cream shadow-sm"
            >
              <v-icon
                icon="mdi-book-open-page-variant-outline"
                size="24"
                color="teal-darken-2"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-brown-darken-4">
                {{ item.title }}
              </div>
              <div
                class="text-caption text-brown-lighten-1 font-weight-medium text-uppercase tracking-wide"
              >
                {{ item.id }}
              </div>
            </div>
          </div>
        </template>

        <!-- Grade Slot -->
        <template v-slot:item.grade="{ item }">
          <div>
            <div class="font-weight-bold text-brown-darken-3">
              {{ item.grade }}
            </div>
            <div class="text-caption text-brown-lighten-1 font-weight-medium">
              {{ item.students }} students
            </div>
          </div>
        </template>

        <!-- Teacher Slot -->
        <template v-slot:item.teacher="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" class="mr-2 border-cream shadow-sm">
              <v-img
                :src="`https://ui-avatars.com/api/?name=${item.teacher}&background=random`"
              ></v-img>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-bold text-brown-darken-3">
                {{ item.teacher }}
              </div>
              <div class="text-caption text-brown-lighten-1 font-weight-medium">
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
            variant="flat"
            label
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div
            class="d-flex flex-column flex-md-row align-center justify-space-between pt-8 border-t-cream"
          >
            <div
              class="text-caption text-brown-lighten-1 font-weight-bold mb-4 mb-md-0"
            >
              {{ $t("showing") }}
              <span class="text-brown-darken-3">1-{{ subjects.length }}</span>
              {{ $t("of") }}
              <span class="text-brown-darken-3">{{ subjects.length }}</span>
              {{ $t("results") }}
            </div>
            <div class="d-flex gap-2 align-center">
              <v-btn
                icon
                variant="outlined"
                color="brown-lighten-3"
                size="small"
                rounded="lg"
                class="mr-2"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                color="brown-darken-3"
                size="small"
                elevation="2"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 36px; height: 36px"
              >
                1
              </v-btn>

              <v-btn
                variant="text"
                color="brown-lighten-1"
                size="small"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 36px; height: 36px"
              >
                2
              </v-btn>

              <v-btn
                variant="text"
                color="brown-lighten-1"
                size="small"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 36px; height: 36px"
              >
                3
              </v-btn>

              <span class="text-brown-lighten-2 mx-1 font-weight-bold"
                >...</span
              >

              <v-btn
                variant="text"
                color="brown-lighten-1"
                size="small"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 36px; height: 36px"
              >
                10
              </v-btn>

              <v-btn
                icon
                variant="outlined"
                color="brown-lighten-3"
                size="small"
                rounded="lg"
                class="ml-2"
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
  class:
    "text-caption font-weight-bold text-brown-lighten-1 pb-4 text-uppercase tracking-wider",
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
/* Cream UI Variables */
.dashboard-container {
  --cream-bg: #fafaf5;
  --cream-card: #ffffff;
  --cream-border: #efebe0;
  --text-primary: #4a4036;
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
  background-color: var(--cream-card);
  border: 1px solid var(--cream-border) !important;
  box-shadow: 0 4px 12px -2px rgba(166, 155, 140, 0.05) !important;
  transition: all 0.3s ease;
}

.bean-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(166, 155, 140, 0.1) !important;
  border-color: #e6dccd !important;
}

/* Table Styling */
:deep(.v-data-table) {
  background: transparent !important;
}

:deep(.v-data-table__tr:hover .v-data-table__td) {
  background-color: #fafaf8 !important; /* Soft Cream Hover */
}

:deep(.v-data-table__th) {
  background-color: transparent !important;
  border-bottom: 1px solid var(--cream-border) !important;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #f5f2eb !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  height: 72px !important;
}

/* Input Customization */
.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e6e0d4 !important;
}

.cream-input :deep(.v-field--focused .v-field__outline__start),
.cream-input :deep(.v-field--focused .v-field__outline__end),
.cream-input :deep(.v-field--focused .v-field__outline__notch) {
  border-color: #8d6e63 !important; /* Brown darken 1 */
  border-width: 1px !important;
}

/* Select Customization */
.cream-select :deep(.v-field__outline__start),
.cream-select :deep(.v-field__outline__end),
.cream-select :deep(.v-field__outline__notch) {
  border-color: #e6e0d4 !important;
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
.border-t-cream {
  border-top: 1px solid var(--cream-border);
}
.shadow-sm {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.bg-brown-lighten-5 {
  background-color: #efebe9 !important;
}
</style>
