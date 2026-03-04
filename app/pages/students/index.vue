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
          to="/students/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("enroll") }} {{ t("students") }}
        </v-btn>
      </div>
    </div>

    <!-- Section: High-Signal Metrics -->
    <v-row class="mb-6 ga-y-4 fade-in">
      <v-col cols="12" sm="6" lg="3" v-for="(stat, i) in studentStats" :key="i">
        <v-card elevation="0" class="metric-card h-100 overflow-hidden">
          <div class="pa-4">
            <div class="d-flex justify-space-between align-center mb-4">
              <div :class="`metric-icon-box bg-${stat.color}-lighten-5`">
                <v-icon
                  :icon="stat.icon"
                  :color="`${stat.color}-darken-2`"
                  size="18"
                ></v-icon>
              </div>
              <v-chip
                color="grey-lighten-4"
                class="text-detail-tiny font-weight-black"
                size="x-small"
                variant="flat"
              >
                LIVE CAPTURE
              </v-chip>
            </div>

            <div class="metric-info">
              <div class="text-detail mb-1 uppercase">{{ stat.label }}</div>
              <div class="text-title" style="font-size: 18px !important">
                {{ stat.value }}
              </div>
            </div>
          </div>
          <div
            class="metric-footer-line"
            :style="`background: var(--v-${stat.color}-base)`"
          ></div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Repository: Intelligence Area -->
    <v-card elevation="0" class="intelligence-card pa-6 fade-in">
      <!-- Search & Contextual Filters -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8 gap-4"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('search')"
          variant="outlined"
          density="compact"
          hide-details
          class="cream-input"
          style="max-width: 400px"
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
            style="min-width: 150px"
            prepend-inner-icon="mdi-school-outline"
            class="cream-select text-detail"
          ></v-select>

          <v-select
            :items="['All Statuses', 'Active', 'Inactive', 'Graduated']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 140px"
            class="cream-select text-detail"
          ></v-select>

          <v-btn
            variant="flat"
            color="white"
            class="modern-action-btn secondary border px-0"
            height="40"
            width="40"
            min-width="40"
          >
            <v-icon icon="mdi-tune" size="18"></v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Data Intelligence Grid -->
      <v-data-table
        :headers="headers"
        :items="students"
        :search="search"
        class="premium-table"
        hover
      >
        <!-- Student Identity Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              size="36"
              class="mr-3 elevation-1 border-white"
              rounded="lg"
            >
              <v-img
                :src="`https://i.pravatar.cc/150?img=${item.studentId.replace('#', '')}`"
                cover
              ></v-img>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.name }}</div>
              <div class="text-detail-tiny">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <!-- Academic Identifier Slot -->
        <template v-slot:item.studentId="{ item }">
          <span
            class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded-md font-weight-black"
          >
            {{ item.studentId }}
          </span>
        </template>

        <!-- Curricular Level Slot -->
        <template v-slot:item.grade="{ item }">
          <div>
            <div class="text-title-small">{{ item.grade }}</div>
            <div class="text-detail-tiny text-grey">
              {{ item.class || "Class A" }}
            </div>
          </div>
        </template>

        <!-- Guardian Intelligence Slot -->
        <template v-slot:item.parentContact="{ item }">
          <div>
            <div class="text-detail font-weight-bold">
              {{ item.parentContact }}
            </div>
            <div class="text-detail-tiny text-grey">{{ item.parentName }}</div>
          </div>
        </template>

        <!-- Lifecycle Status Slot -->
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

        <!-- Intelligence Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn
              icon="mdi-pencil-outline"
              variant="text"
              size="x-small"
              color="primary"
            ></v-btn>
            <v-btn
              icon="mdi-clipboard-text-outline"
              variant="text"
              size="x-small"
              color="info"
            ></v-btn>
            <v-btn
              icon="mdi-trash-can-outline"
              variant="text"
              size="x-small"
              color="error"
            ></v-btn>
          </div>
        </template>

        <!-- Navigation Architecture Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Displaying 1 to {{ students.length }} of 3,450 academic records
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
    label: "pending capture",
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
  {
    title: "STUDENT ID",
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

.metric-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-footer-line {
  height: 3px;
  width: 100%;
  opacity: 0.15;
}

.intelligence-card {
  border-radius: 20px !important;
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
