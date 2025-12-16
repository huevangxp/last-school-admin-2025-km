<template>
  <v-container fluid class="pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">
          {{ t("management") }} {{ t("admin") }}
        </h1>
        <p class="text-body-2 text-grey-darken-1">
          Manage system administrators and permissions
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
          to="/admin/add"
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
              <p class="text-caption text-grey-darken-1 mb-1">
                {{ t("total_admins") }}
              </p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">
                {{ admins.length }}
              </h2>
              <p class="text-caption text-success mt-1">
                <v-icon size="14" color="success">mdi-shield-check</v-icon>
                {{ t("system_users") }}
              </p>
            </div>
            <v-avatar color="blue-lighten-5" size="56">
              <v-icon color="blue" size="28">mdi-shield-account</v-icon>
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
                {{ t("active_admins") }}
              </p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">
                {{ admins.filter((a) => a.status === "Active").length }}
              </h2>
              <p class="text-caption text-success mt-1">
                <v-icon size="14" color="success">mdi-check-circle</v-icon>
                {{ t("online") }}
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
                {{ t("super_admins") }}
              </p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">2</h2>
              <p class="text-caption text-purple mt-1">
                <v-icon size="14" color="purple">mdi-crown</v-icon>
                {{ t("full_access") }}
              </p>
            </div>
            <v-avatar color="purple-lighten-5" size="56">
              <v-icon color="purple" size="28">mdi-crown</v-icon>
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
                {{ t("pending_approval") }}
              </p>
              <h2 class="text-h4 font-weight-bold text-grey-darken-4">0</h2>
              <p class="text-caption text-orange mt-1">
                <v-icon size="14" color="orange">mdi-clock-outline</v-icon>
                {{ t("requires_action") }}
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
            :items="['All Roles', 'Super Admin', 'Admin', 'Moderator']"
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
        :items="admins"
        :search="search"
        class="admin-table"
        hover
      >
        <!-- Admin Name with Image Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="48" class="mr-3">
              <v-img :src="item.image" cover></v-img>
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
        <template v-slot:item.id="{ item }">
          <span class="font-weight-medium text-grey-darken-3">{{
            item.id
          }}</span>
        </template>

        <!-- Role Slot -->
        <template v-slot:item.role="{ item }">
          <div>
            <div class="font-weight-medium text-grey-darken-3">
              {{ item.role }}
            </div>
            <div class="text-caption text-grey-darken-1">
              {{ item.department }}
            </div>
          </div>
        </template>

        <!-- Contact Slot -->
        <template v-slot:item.phone="{ item }">
          <div>
            <div class="text-body-2 text-grey-darken-3">{{ item.phone }}</div>
            <div class="text-caption text-grey-darken-1">(Phone)</div>
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
              {{ t("showing") }} <strong>1</strong> {{ t("to") }}
              <strong>{{ admins.length }}</strong> {{ t("of") }}
              <strong>{{ admins.length }}</strong> {{ t("results") }}
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

definePageMeta({
  layout: "admin",
});

const search = ref("");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("admin"), disabled: true, to: "/admin" },
];

const headers = [
  {
    title: t("admin_name"),
    key: "name",
    align: "start" as const,
    sortable: true,
  },
  { title: t("id_number"), key: "id", align: "start" as const, sortable: true },
  { title: t("role"), key: "role", align: "start" as const, sortable: true },
  {
    title: t("contact"),
    key: "phone",
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

const admins = ref([
  {
    id: "#ADM-001",
    name: "Alex Morgan",
    email: "alex.m@school.com",
    image: "https://i.pravatar.cc/150?img=10",
    role: "Super Admin",
    department: "IT Department",
    phone: "+1 (555) 123-4567",
    status: "Active",
  },
  {
    id: "#ADM-002",
    name: "Jessica Lee",
    email: "jessica.l@school.com",
    image: "https://i.pravatar.cc/150?img=20",
    role: "Admin",
    department: "Academic Affairs",
    phone: "+1 (555) 987-6543",
    status: "Active",
  },
  {
    id: "#ADM-003",
    name: "Michael Brown",
    email: "michael.b@school.com",
    image: "https://i.pravatar.cc/150?img=30",
    role: "Moderator",
    department: "Student Services",
    phone: "+1 (555) 234-5678",
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
