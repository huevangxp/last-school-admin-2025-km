<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-title mb-1">{{ $t("settings") }}</h1>
        <p class="text-detail">{{ $t("settings-subtitle") }}</p>
      </div>
    </div>

    <!-- Settings Cards Grid -->
    <v-row class="ga-y-4">
      <!-- General Settings -->
      <v-col cols="12" md="6">
        <v-card class="intelligence-card pa-4 h-100" elevation="0">
          <div class="d-flex align-center mb-4">
            <v-avatar color="blue-lighten-5" size="40" class="mr-3 rounded-0">
              <v-icon color="blue-darken-2" size="20">mdi-cog-outline</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-title">{{ $t("general-settings") }}</h3>
              <p class="text-detail-tiny">
                {{ $t("general-settings-desc") }}
              </p>
            </div>
          </div>

          <v-divider class="mb-2 opacity-10"></v-divider>

          <v-list class="bg-transparent" lines="two">
            <v-list-item
              class="px-0 py-1"
              v-for="(item, i) in schoolDetails"
              :key="i"
            >
              <template v-slot:prepend>
                <div
                  class="mr-3 d-flex align-center justify-center rounded-0 bg-grey-lighten-4"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="secondary" size="16">{{ item.icon }}</v-icon>
                </div>
              </template>
              <v-list-item-title class="text-title-small">{{
                item.title
              }}</v-list-item-title>
              <v-list-item-subtitle class="text-detail">{{
                item.value
              }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil-outline"
                  variant="text"
                  size="x-small"
                  color="primary"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Academic Settings -->
      <v-col cols="12" md="6">
        <v-card class="intelligence-card pa-4 h-100" elevation="0">
          <div class="d-flex align-center mb-4">
            <v-avatar color="green-lighten-5" size="40" class="mr-3 rounded-0">
              <v-icon color="green-darken-2" size="20"
                >mdi-book-open-page-variant-outline</v-icon
              >
            </v-avatar>
            <div>
              <h3 class="text-title">{{ $t("academic-config") }}</h3>
              <p class="text-detail-tiny">{{ $t("academic-config-desc") }}</p>
            </div>
          </div>

          <v-divider class="mb-2 opacity-10"></v-divider>

          <v-list class="bg-transparent" lines="two">
            <v-list-item class="px-0 py-1">
              <template v-slot:prepend>
                <div
                  class="mr-3 d-flex align-center justify-center rounded-0 bg-grey-lighten-4"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="secondary" size="16"
                    >mdi-calendar-month-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title class="text-title-small"
                >{{ $t("academic-year") }}</v-list-item-title
              >
              <v-list-item-subtitle class="text-detail"
                >2024-2025</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-chip
                  color="green-lighten-4"
                  class="text-dark font-weight-black"
                  size="x-small"
                  variant="flat"
                  label
                  >ACTIVE</v-chip
                >
              </template>
            </v-list-item>

            <v-list-item
              class="px-0 py-1"
              v-for="(item, i) in academicDetails"
              :key="i"
            >
              <template v-slot:prepend>
                <div
                  class="mr-3 d-flex align-center justify-center rounded-0 bg-grey-lighten-4"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="secondary" size="16">{{ item.icon }}</v-icon>
                </div>
              </template>
              <v-list-item-title class="text-title-small">{{
                item.title
              }}</v-list-item-title>
              <v-list-item-subtitle class="text-detail">{{
                item.value
              }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil-outline"
                  variant="text"
                  size="x-small"
                  color="primary"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Notification Settings -->
      <v-col cols="12" md="6">
        <v-card class="intelligence-card pa-4 h-100" elevation="0">
          <div class="d-flex align-center mb-4">
            <v-avatar
              color="purple-lighten-5"
              size="40"
              class="mr-3 rounded-0"
            >
              <v-icon color="purple-darken-2" size="20"
                >mdi-bell-outline</v-icon
              >
            </v-avatar>
            <div>
              <h3 class="text-title">Notifications</h3>
              <p class="text-detail-tiny">Alert system preferences</p>
            </div>
          </div>
          <v-divider class="mb-2 opacity-10"></v-divider>
          <v-list class="bg-transparent">
            <v-list-item
              class="px-0 py-1"
              v-for="(notif, i) in notifications"
              :key="i"
            >
              <template v-slot:prepend>
                <div
                  class="mr-3 d-flex align-center justify-center rounded-0 bg-grey-lighten-4"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="secondary" size="16">{{ notif.icon }}</v-icon>
                </div>
              </template>
              <v-list-item-title class="text-title-small">{{
                notif.title
              }}</v-list-item-title>
              <template v-slot:append>
                <v-switch
                  v-model="notif.enabled"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                ></v-switch>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Security & Access -->
      <v-col cols="12" md="6">
        <v-card class="intelligence-card pa-4 h-100" elevation="0">
          <div class="d-flex align-center mb-4">
            <v-avatar
              color="orange-lighten-5"
              size="40"
              class="mr-3 rounded-0"
            >
              <v-icon color="orange-darken-2" size="20"
                >mdi-shield-lock-outline</v-icon
              >
            </v-avatar>
            <div>
              <h3 class="text-title">Security</h3>
              <p class="text-detail-tiny">Account & safety protocols</p>
            </div>
          </div>
          <v-divider class="mb-2 opacity-10"></v-divider>
          <v-list class="bg-transparent">
            <v-list-item class="px-0 py-1">
              <template v-slot:prepend>
                <div
                  class="mr-3 d-flex align-center justify-center rounded-0 bg-grey-lighten-4"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="secondary" size="16">mdi-key-outline</v-icon>
                </div>
              </template>
              <v-list-item-title class="text-title-small"
                >Change Password</v-list-item-title
              >
              <template v-slot:append>
                <v-btn
                  variant="tonal"
                  size="x-small"
                  color="primary"
                  class="font-weight-black"
                  >RESET</v-btn
                >
              </template>
            </v-list-item>
            <v-list-item class="px-0 py-1">
              <template v-slot:prepend>
                <div
                  class="mr-3 d-flex align-center justify-center rounded-0 bg-grey-lighten-4"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="secondary" size="16"
                    >mdi-two-factor-authentication</v-icon
                  >
                </div>
              </template>
              <v-list-item-title class="text-title-small"
                >Two-Factor Auth</v-list-item-title
              >
              <template v-slot:append>
                <v-switch
                  v-model="twoFactorAuth"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                ></v-switch>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
const { t } = useI18n();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("settings"), disabled: true, to: "/settings" },
];

const schoolDetails = [
  { title: "School Name", value: "ມ.ສ ກາງໃໝ່", icon: "mdi-school-outline" },
  {
    title: "Address",
    value: "ບ້ານ ກາງໃໝ່, ເມືອງ ໄຊທານີ",
    icon: "mdi-map-marker-outline",
  },
  { title: "Phone", value: "+856 20 5555 5555", icon: "mdi-phone-outline" },
];

const academicDetails = [
  {
    title: "Semester",
    value: "Semester 1",
    icon: "mdi-calendar-range-outline",
  },
  {
    title: "Timeline",
    value: "01/09/24 - 30/06/25",
    icon: "mdi-clock-time-four-outline",
  },
];

const notifications = ref([
  { title: "Email Notifications", enabled: true, icon: "mdi-email-outline" },
  { title: "SMS Alerts", enabled: false, icon: "mdi-message-text-outline" },
  { title: "Push System", enabled: true, icon: "mdi-bell-ring-outline" },
]);

const twoFactorAuth = ref(false);
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}

:deep(.v-list-item-title) {
  line-height: 1.2 !important;
}

:deep(.v-list-item-subtitle) {
  opacity: 0.8;
}

/* Tighten switches */
:deep(.v-switch__track) {
  height: 20px !important;
  width: 40px !important;
}
:deep(.v-switch__thumb) {
  height: 14px !important;
  width: 14px !important;
}
</style>
