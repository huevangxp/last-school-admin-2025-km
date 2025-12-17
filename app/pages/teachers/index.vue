<template>
  <v-container fluid class="pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">
          <span> {{ t("management") }} {{ t("teachers") }}</span>
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
          to="/teachers/add"
        >
          {{ t("add") }}
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
              <p class="text-caption text-grey-darken-1 mb-1">total teachers</p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">
                {{ teachers.length }}
              </h2>
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
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">
                {{ teachers.filter((t) => t.status === "Active").length }}
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
              <p class="text-caption text-grey-darken-1 mb-1">new teachers</p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">2</h2>
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
              <p class="text-caption text-grey-darken-1 mb-1">pending</p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">0</h2>
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
            :items="['All Statuses', 'Active', 'Inactive', 'Suspended']"
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
        :items="teachers"
        :search="search"
        class="teacher-table"
        hover
      >
        <!-- Teacher Name with Image Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="48" class="mr-3">
              <v-img :src="item.image" cover></v-img>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-grey-darken-4">
                {{ item.username }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ item.email || "No email" }}
              </div>
            </div>
          </div>
        </template>

        <!-- ID Number Slot -->
        <template v-slot:item.id="{ item }">
          <span class="font-weight-medium text-grey-darken-3">{{
            item.id
          }}</span>
        </template>

        <!-- Subject/Class Slot -->
        <template v-slot:item.teacherSubject="{ item }">
          <div>
            <div class="font-weight-medium text-grey-darken-3">
              {{ item.teacherSubject }}
            </div>
            <div class="text-caption text-grey-darken-1">
              {{ item.grade || "Grade 10-A" }}
            </div>
          </div>
        </template>

        <!-- Parent Contact Slot -->
        <template v-slot:item.phone="{ item }">
          <div>
            <div class="text-body-2 text-grey-darken-3">{{ item.phone }}</div>
            <div class="text-caption text-grey-darken-1">
              {{ item.parentName || "(Phone)" }}
            </div>
          </div>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="
              item.status === 'Active'
                ? 'success'
                : item.status === 'Suspended'
                ? 'error'
                : 'grey'
            "
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
              <strong>{{ teachers.length }}</strong> {{ t("of") }}
              <strong>{{ teachers.length }}</strong> {{ t("results") }}
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
  { title: t("teachers"), disabled: true, to: "/teachers" },
];

const headers = [
  { title: t("id"), key: "id", align: "start" as const, sortable: true },
  { title: t("image"), key: "image", align: "start" as const, sortable: false },
  {
    title: t("teachers"),
    key: "username",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("subject"),
    key: "teacherSubject",
    align: "start" as const,
    sortable: true,
  },
  { title: t("phone"), key: "phone", align: "start" as const, sortable: true },
  {
    title: t("actions"),
    key: "actions",
    align: "end" as const,
    sortable: false,
  },
].map((h) => ({
  ...h,
  class: "text-caption font-weight-bold text-grey-darken-1 pb-4",
}));

const teachers = [
  {
    id: "#202301",
    image: "https://i.pravatar.cc/150?img=1",
    username: "Huevang",
    email: "huevang@school.com",
    teacherSubject: "ຄະນິດສາດ",
    grade: "Grade 10-A",
    phone: "+1 (555) 123-4567",
    parentName: "Sarah Johnson (Mother)",
    status: "Active",
  },
  {
    id: "#202302",
    image: "https://i.pravatar.cc/150?img=2",
    username: "Chanthavong",
    email: "chantha@school.com",
    teacherSubject: "ຟິຊິກສາດ",
    grade: "Grade 11-B",
    phone: "+1 (555) 987-6543",
    parentName: "John Smith (Father)",
    status: "Active",
  },
  {
    id: "#202303",
    image: "https://i.pravatar.cc/150?img=3",
    username: "Vilayphone",
    email: "vilay@school.com",
    teacherSubject: "ຊີວະວິທະຍາຊາດ",
    grade: "Grade 12-A",
    phone: "+1 (555) 234-5678",
    parentName: "Mary Williams (Mother)",
    status: "Active",
  },
  {
    id: "#202304",
    image: "https://i.pravatar.cc/150?img=4",
    username: "Khamla",
    email: "khamla@school.com",
    teacherSubject: "ເຄມີສາດ",
    grade: "Grade 10-C",
    phone: "+1 (555) 789-0123",
    parentName: "David Scott (Father)",
    status: "Suspended",
  },
  {
    id: "#202305",
    image: "https://i.pravatar.cc/150?img=5",
    username: "Xayphong",
    email: "xay@school.com",
    teacherSubject: "ພາສາອັງກິດ",
    grade: "Grade 9-A",
    phone: "+1 (555) 789-0123",
    parentName: "Robert Davis (Father)",
    status: "Active",
  },
];
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
  height: 64px !important;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
</style>
