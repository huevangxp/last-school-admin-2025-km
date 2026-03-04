<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <div class="text-title mb-1">
          {{ t("management") }} {{ t("students") }}
        </div>
        <div class="text-detail">
          Manage your student database, enrollments, and statuses.
        </div>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
        >
          <v-icon icon="mdi-file-download-outline" start size="18"></v-icon>
          {{ t("export") }}
        </v-btn>

        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          to="/students/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("enroll") }} {{ t("students") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in studentStats" :key="i">
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

          <v-select
            :items="['All Statuses', 'Active', 'Inactive', 'Graduated']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 130px"
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
        :items="students"
        :search="search"
        class="premium-table"
        hover
      >
        <!-- Student Name with Image Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="32" class="mr-3 elevation-1 border-white">
              <v-img
                :src="`https://i.pravatar.cc/150?img=${item.studentId.replace('#', '')}`"
                cover
              ></v-img>
            </v-avatar>
            <div>
              <div class="text-title-small">
                {{ item.name }}
              </div>
              <div class="text-detail-tiny">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template>

        <!-- ID Number Slot -->
        <template v-slot:item.studentId="{ item }">
          <span class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded">
            {{ item.studentId }}
          </span>
        </template>

        <!-- Grade/Class Slot -->
        <template v-slot:item.grade="{ item }">
          <div>
            <div class="text-title-small">
              {{ item.grade }}
            </div>
            <div class="text-detail-tiny text-grey">
              {{ item.class || "Class A" }}
            </div>
          </div>
        </template>

        <!-- Parent Contact Slot -->
        <template v-slot:item.parentContact="{ item }">
          <div>
            <div class="text-title-small">
              {{ item.parentContact }}
            </div>
            <div class="text-detail-tiny text-grey">
              {{ item.parentName }}
            </div>
          </div>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="x-small"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil-outline"
            variant="text"
            size="x-small"
            color="primary"
          ></v-btn>
          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            size="x-small"
            color="error"
          ></v-btn>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Showing 1 to {{ students.length }} of 3,450 results
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
                variant="text"
                color="grey-darken-1"
                size="x-small"
                class="font-weight-black"
                style="min-width: 24px; height: 24px"
              >
                2
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
import { ref } from "vue";
const { t } = useI18n();

const search = ref("");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("students"), disabled: true, to: "/students" },
];

const studentStats = [
  {
    label: "total students",
    value: "3,450",
    icon: "mdi-account-group",
    color: "blue",
  },
  {
    label: "active enrollment",
    value: "3,200",
    icon: "mdi-check-circle",
    color: "green",
  },
  {
    label: "new enrollments",
    value: "150",
    icon: "mdi-account-plus",
    color: "purple",
  },
  {
    label: "pending",
    value: "45",
    icon: "mdi-clock-time-four-outline",
    color: "orange",
  },
];

const headers = [
  {
    title: t("firstname"),
    key: "name",
    align: "start" as const,
    sortable: true,
  },
  { title: t("id"), key: "studentId", align: "start" as const, sortable: true },
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
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({
  ...h,
  class: "text-detail-tiny pb-2",
}));

const students = ref([
  {
    studentId: "#202301",
    name: "Liam Johnson",
    email: "liam.j@school.com",
    grade: "Grade 10",
    class: "Class 10-A",
    parentContact: "+1 (555) 123-4567",
    parentName: "Sarah Johnson",
    status: "Active",
  },
  {
    studentId: "#202302",
    name: "Emma Smith",
    email: "emma.s@school.com",
    grade: "Grade 11",
    class: "Class 11-B",
    parentContact: "+1 (555) 987-6543",
    parentName: "John Smith",
    status: "Active",
  },
  {
    studentId: "#202303",
    name: "Noah Williams",
    email: "noah.w@school.com",
    grade: "Grade 9",
    class: "Class 9-C",
    parentContact: "+1 (555) 234-5678",
    parentName: "Mary Williams",
    status: "Active",
  },
  {
    studentId: "#202304",
    name: "Olivia Scott",
    email: "olivia.s@school.com",
    grade: "Grade 12",
    class: "Class 12-A",
    parentContact: "+1 (555) 456-7890",
    parentName: "David Scott",
    status: "Inactive",
  },
  {
    studentId: "#202305",
    name: "Ava Davis",
    email: "ava.d@school.com",
    grade: "Grade 10",
    class: "Class 10-C",
    parentContact: "+1 (555) 789-0123",
    parentName: "Robert Davis",
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
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
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
.gap-1 {
  gap: 4px;
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

/* Table Customization */
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

.cream-select :deep(.v-field__outline__start),
.cream-select :deep(.v-field__outline__end),
.cream-select :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.border-white {
  border: 1.5px solid #ffffff;
}

.border-t {
  border-top: 1px solid #f1f5f9;
}
</style>
