<template>
  <v-container fluid class="pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">
          <span>{{ t("management") }} {{ t("students") }} </span>
        </h1>
        <p class="text-body-2 text-grey-darken-1">
          Manage your student database, enrollments, and statuses.
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
          {{ t("export") }}
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6"
          height="40"
          rounded="lg"
          elevation="0"
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
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                 total students
              </p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">3,450</h2>
              <p class="text-caption text-success mt-1">
                <v-icon size="14" color="success">mdi-arrow-up</v-icon>
                +5.2% vs last semester
              </p>
            </div>
            <v-avatar color="blue-lighten-5" size="56">
              <v-icon color="blue" size="28">mdi-account-group</v-icon>
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
                active enrollment
              </p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">3,200</h2>
              <p class="text-caption text-success mt-1">
                <v-icon size="14" color="success">mdi-check-circle</v-icon>
                92% rate
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
              <p class="text-caption text-grey-darken-1 mb-1">
                new enrollments
              </p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">150</h2>
              <p class="text-caption text-purple mt-1">
                <v-icon size="14" color="purple">mdi-account-plus</v-icon>
                +12% this month
              </p>
            </div>
            <v-avatar color="purple-lighten-5" size="56">
              <v-icon color="purple" size="28">mdi-account-plus</v-icon>
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
                 pending 
              </p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">45</h2>
              <p class="text-caption text-orange mt-1">
                <v-icon size="14" color="orange">mdi-clock-outline</v-icon>
                requires action
              </p>
            </div>
            <v-avatar color="orange-lighten-5" size="56">
              <v-icon color="orange" size="28">mdi-clock-outline</v-icon>
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
          :placeholder="t('search')"
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
            :items="['All Statuses', 'Active', 'Inactive', 'Graduated']"
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
        :items="students"
        :search="search"
        class="student-table"
        hover
      >
        <!-- Student Name with Image Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="48" class="mr-3">
              <v-img
                :src="`https://i.pravatar.cc/150?img=${item.studentId}`"
                cover
              ></v-img>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-grey-darken-4">
                {{ item.name }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template>

        <!-- ID Number Slot -->
        <template v-slot:item.studentId="{ item }">
          <span class="font-weight-medium text-grey-darken-3">{{
            item.studentId
          }}</span>
        </template>

        <!-- Grade/Class Slot -->
        <template v-slot:item.grade="{ item }">
          <div>
            <div class="font-weight-medium text-grey-darken-3">
              {{ item.grade }}
            </div>
            <div class="text-caption text-grey-darken-1">
              {{ item.class || "Class A" }}
            </div>
          </div>
        </template>

        <!-- Parent Contact Slot -->
        <template v-slot:item.parentContact="{ item }">
          <div>
            <div class="text-body-2 text-grey-darken-3">
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
              {{ t("showing") }} <strong>1</strong> {{ t("to") }}
              <strong>{{ students.length }}</strong> {{ t("of") }}
              <strong>3,450</strong> {{ t("results") }}
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
                128
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
  class: "text-caption font-weight-bold text-grey-darken-1 pb-4",
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
