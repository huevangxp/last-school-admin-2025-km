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
          {{ t("management") }} {{ t("students") }}
        </h1>
        <p class="text-body-2 text-grey-darken-1 font-weight-medium">
          Manage your student database, enrollments, and statuses.
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
          to="/students/add"
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
                total students
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">3,450</h2>
            </div>
            <v-avatar
              color="blue-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="blue-darken-2" size="26">mdi-account-group</v-icon>
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
                active enrollment
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">3,200</h2>
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
                new enrollments
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
                >mdi-account-plus</v-icon
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
                pending
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">45</h2>
            </div>
            <v-avatar
              color="orange-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="orange-darken-2" size="26"
                >mdi-clock-time-four-outline</v-icon
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
            :items="['All Statuses', 'Active', 'Inactive', 'Graduated']"
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
        :items="students"
        :search="search"
        class="student-table"
        hover
      >
        <!-- Student Name with Image Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              size="48"
              class="mr-3 border-cream shadow-sm"
              rounded="lg"
            >
              <v-img
                :src="`https://i.pravatar.cc/150?img=${item.studentId}`"
                cover
              ></v-img>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-secondary">
                {{ item.name }}
              </div>
              <div class="text-caption text-grey-darken-1 font-weight-medium">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template>

        <!-- ID Number Slot -->
        <template v-slot:item.studentId="{ item }">
          <span
            class="font-weight-bold text-secondary bg-grey-lighten-4 px-2 py-1 rounded text-caption"
            >{{ item.studentId }}</span
          >
        </template>

        <!-- Grade/Class Slot -->
        <template v-slot:item.grade="{ item }">
          <div>
            <div class="font-weight-bold text-secondary">
              {{ item.grade }}
            </div>
            <div class="text-caption text-grey-darken-1 font-weight-medium">
              {{ item.class || "Class A" }}
            </div>
          </div>
        </template>

        <!-- Parent Contact Slot -->
        <template v-slot:item.parentContact="{ item }">
          <div>
            <div class="text-body-2 font-weight-medium text-secondary">
              {{ item.parentContact }}
            </div>
            <div class="text-caption text-grey-darken-1">
              {{ item.parentName }}
            </div>
          </div>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
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
              <strong class="text-secondary">{{ students.length }}</strong>
              {{ t("of") }} <strong class="text-secondary">3,450</strong>
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
                128
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
  { title: t("students"), disabled: true, to: "/students" },
];

const headers = [
  {
    title: t("firstname"),
    key: "name",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("id"),
    key: "studentId",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("classes"),
    key: "grade",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("parent"),
    key: "parentContact",
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

const students = ref([
  {
    studentId: "#202301",
    name: "Liam Johnson",
    email: "liam.j@school.com",
    grade: "Grade 10",
    class: "Class 10-A",
    parentContact: "+1 (555) 123-4567",
    parentName: "Sarah Johnson (Mother)",
    status: "Active",
  },
  {
    studentId: "#202302",
    name: "Emma Smith",
    email: "emma.s@school.com",
    grade: "Grade 11",
    class: "Class 11-B",
    parentContact: "+1 (555) 987-6543",
    parentName: "John Smith (Father)",
    status: "Active",
  },
  {
    studentId: "#202303",
    name: "Noah Williams",
    email: "noah.w@school.com",
    grade: "Grade 9",
    class: "Class 9-C",
    parentContact: "+1 (555) 234-5678",
    parentName: "Mary Williams (Mother)",
    status: "Active",
  },
  {
    studentId: "#202304",
    name: "Olivia Scott",
    email: "olivia.s@school.com",
    grade: "Grade 12",
    class: "Class 12-A",
    parentContact: "+1 (555) 456-7890",
    parentName: "David Scott (Father)",
    status: "Inactive",
  },
  {
    studentId: "#202305",
    name: "Ava Davis",
    email: "ava.d@school.com",
    grade: "Grade 10",
    class: "Class 10-C",
    parentContact: "+1 (555) 789-0123",
    parentName: "Robert Davis (Father)",
    status: "Active",
  },
]);

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "success";
    case "graduated":
      return "info";
    case "inactive":
      return "grey";
    default:
      return "grey";
  }
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
