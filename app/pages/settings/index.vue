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
      <v-chip
        v-if="!isAdmin"
        color="orange-lighten-4"
        class="text-orange-darken-4 font-weight-black mt-3 mt-md-0"
        size="small"
        variant="flat"
        label
        prepend-icon="mdi-eye-outline"
      >
        {{ $t("view_only") }}
      </v-chip>
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
            <v-spacer></v-spacer>
            <v-btn
              v-if="isAdmin"
              icon="mdi-pencil-outline"
              variant="text"
              size="x-small"
              color="primary"
              @click="openSchoolDialog"
            ></v-btn>
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
                item.value || "—"
              }}</v-list-item-subtitle>
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
            <v-spacer></v-spacer>
            <v-btn
              v-if="isAdmin"
              icon="mdi-pencil-outline"
              variant="text"
              size="x-small"
              color="primary"
              @click="openSemesterDialog"
            ></v-btn>
          </div>

          <v-divider class="mb-2 opacity-10"></v-divider>

          <v-list class="bg-transparent" lines="two">
            <!-- Active academic year — real data from tb_academic_year. -->
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
              <v-list-item-title class="text-title-small">{{
                $t("academic-year")
              }}</v-list-item-title>
              <v-list-item-subtitle class="text-detail">{{
                activeYear?.title || "—"
              }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-chip
                  v-if="activeYear"
                  :color="
                    activeYear.status === 'active'
                      ? 'green-lighten-4'
                      : 'grey-lighten-3'
                  "
                  class="text-dark font-weight-black"
                  size="x-small"
                  variant="flat"
                  label
                  >{{
                    activeYear.status === "active"
                      ? $t("active")
                      : $t("inactive")
                  }}</v-chip
                >
              </template>
            </v-list-item>

            <!-- Semester — stored in settings. -->
            <v-list-item class="px-0 py-1">
              <template v-slot:prepend>
                <div
                  class="mr-3 d-flex align-center justify-center rounded-0 bg-grey-lighten-4"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="secondary" size="16"
                    >mdi-calendar-range-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title class="text-title-small">{{
                $t("semester")
              }}</v-list-item-title>
              <v-list-item-subtitle class="text-detail">{{
                settings.semester || "—"
              }}</v-list-item-subtitle>
            </v-list-item>

            <!-- Timeline — derived from the active year's dates (read-only). -->
            <v-list-item class="px-0 py-1">
              <template v-slot:prepend>
                <div
                  class="mr-3 d-flex align-center justify-center rounded-0 bg-grey-lighten-4"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="secondary" size="16"
                    >mdi-clock-time-four-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title class="text-title-small">{{
                $t("timeline")
              }}</v-list-item-title>
              <v-list-item-subtitle class="text-detail">{{
                yearTimeline
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Notification Settings -->
      <v-col cols="12" md="6">
        <v-card class="intelligence-card pa-4 h-100" elevation="0">
          <div class="d-flex align-center mb-4">
            <v-avatar color="purple-lighten-5" size="40" class="mr-3 rounded-0">
              <v-icon color="purple-darken-2" size="20"
                >mdi-bell-outline</v-icon
              >
            </v-avatar>
            <div>
              <h3 class="text-title">{{ $t("notifications") }}</h3>
              <p class="text-detail-tiny">{{ $t("notifications-desc") }}</p>
            </div>
          </div>
          <v-divider class="mb-2 opacity-10"></v-divider>
          <v-list class="bg-transparent">
            <v-list-item
              class="px-0 py-1"
              v-for="notif in notifications"
              :key="notif.key"
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
                  :model-value="settings[notif.key]"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                  :disabled="!isAdmin || saving"
                  @update:model-value="toggle(notif.key, $event)"
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
            <v-avatar color="orange-lighten-5" size="40" class="mr-3 rounded-0">
              <v-icon color="orange-darken-2" size="20"
                >mdi-shield-lock-outline</v-icon
              >
            </v-avatar>
            <div>
              <h3 class="text-title">{{ $t("security") }}</h3>
              <p class="text-detail-tiny">{{ $t("security-desc") }}</p>
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
                  <v-icon color="secondary" size="16"
                    >mdi-two-factor-authentication</v-icon
                  >
                </div>
              </template>
              <v-list-item-title class="text-title-small">{{
                $t("two-factor-auth")
              }}</v-list-item-title>
              <template v-slot:append>
                <v-switch
                  :model-value="settings.two_factor"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                  :disabled="!isAdmin || saving"
                  @update:model-value="toggle('two_factor', $event)"
                ></v-switch>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit school info -->
    <v-dialog v-model="schoolDialog" width="460">
      <v-card class="pa-6">
        <div class="text-title mb-4">{{ $t("general-settings") }}</div>
        <label class="text-detail-tiny mb-1 d-block">{{ $t("school-name") }}</label>
        <v-text-field
          v-model="schoolForm.school_name"
          variant="outlined"
          density="compact"
          hide-details
          class="mb-3"
        ></v-text-field>
        <label class="text-detail-tiny mb-1 d-block">{{ $t("address") }}</label>
        <v-text-field
          v-model="schoolForm.address"
          variant="outlined"
          density="compact"
          hide-details
          class="mb-3"
        ></v-text-field>
        <label class="text-detail-tiny mb-1 d-block">{{ $t("phone") }}</label>
        <v-text-field
          v-model="schoolForm.phone"
          variant="outlined"
          density="compact"
          hide-details
        ></v-text-field>
        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="schoolDialog = false">{{ $t("cancel") }}</v-btn>
          <v-btn color="primary" :loading="saving" @click="saveSchool">{{ $t("save") }}</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Edit semester -->
    <v-dialog v-model="semesterDialog" width="420">
      <v-card class="pa-6">
        <div class="text-title mb-4">{{ $t("semester") }}</div>
        <v-text-field
          v-model="semesterForm"
          variant="outlined"
          density="compact"
          hide-details
          placeholder="Semester 1"
        ></v-text-field>
        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="semesterDialog = false">{{ $t("cancel") }}</v-btn>
          <v-btn color="primary" :loading="saving" @click="saveSemester">{{ $t("save") }}</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSettingStore } from "~/stores/apiSetting";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useUiStore } from "~/stores/ui";

const { t } = useI18n();
const settingStore = useSettingStore();
const classroomStore = useClassroomStore();
const ui = useUiStore();

// Editing global settings is admin-only (mirrors the backend PUT guard).
const role = useCookie<string>("role", { default: () => "" });
const isAdmin = computed(() =>
  ["admin", "administrator"].includes((role.value || "").toLowerCase())
);

const settings = computed(() => settingStore.settings);
const saving = ref(false);

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("settings"), disabled: true, to: "/settings" },
];

onMounted(() => {
  settingStore.fetchSettings();
  if (!classroomStore.academicYears.length) classroomStore.fetchAcademicYears();
});

// ---- Academic year (real data) ----
const activeYear = computed(() => classroomStore.latestAcademicYear);
const fmt = (d?: string) => (d ? String(d).substring(0, 10) : "");
const yearTimeline = computed(() => {
  const y = activeYear.value;
  if (!y || (!y.start_date && !y.end_date)) return "—";
  return `${fmt(y.start_date)} → ${fmt(y.end_date)}`;
});

// ---- Displayed school rows ----
const schoolDetails = computed(() => [
  { title: t("school-name"), value: settings.value.school_name, icon: "mdi-school-outline" },
  { title: t("address"), value: settings.value.address, icon: "mdi-map-marker-outline" },
  { title: t("phone"), value: settings.value.phone, icon: "mdi-phone-outline" },
]);

const notifications = [
  { key: "notif_email" as const, title: t("email-notifications"), icon: "mdi-email-outline" },
  { key: "notif_sms" as const, title: t("sms-alerts"), icon: "mdi-message-text-outline" },
  { key: "notif_push" as const, title: t("push-system"), icon: "mdi-bell-ring-outline" },
];

// ---- Toggle a boolean setting and persist immediately ----
const toggle = async (key: string, value: boolean | null) => {
  if (!isAdmin.value) return;
  saving.value = true;
  try {
    await settingStore.updateSettings({ [key]: !!value });
    ui.notify(t("saved-successfully"), "success");
  } catch (error: any) {
    ui.notify(error.response?.data?.message || t("failed-to-save"), "error");
  } finally {
    saving.value = false;
  }
};

// ---- School info dialog ----
const schoolDialog = ref(false);
const schoolForm = ref({ school_name: "", address: "", phone: "" });
const openSchoolDialog = () => {
  schoolForm.value = {
    school_name: settings.value.school_name || "",
    address: settings.value.address || "",
    phone: settings.value.phone || "",
  };
  schoolDialog.value = true;
};
const saveSchool = async () => {
  saving.value = true;
  try {
    await settingStore.updateSettings({ ...schoolForm.value });
    schoolDialog.value = false;
    ui.notify(t("saved-successfully"), "success");
  } catch (error: any) {
    ui.notify(error.response?.data?.message || t("failed-to-save"), "error");
  } finally {
    saving.value = false;
  }
};

// ---- Semester dialog ----
const semesterDialog = ref(false);
const semesterForm = ref("");
const openSemesterDialog = () => {
  semesterForm.value = settings.value.semester || "";
  semesterDialog.value = true;
};
const saveSemester = async () => {
  saving.value = true;
  try {
    await settingStore.updateSettings({ semester: semesterForm.value });
    semesterDialog.value = false;
    ui.notify(t("saved-successfully"), "success");
  } catch (error: any) {
    ui.notify(error.response?.data?.message || t("failed-to-save"), "error");
  } finally {
    saving.value = false;
  }
};
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
