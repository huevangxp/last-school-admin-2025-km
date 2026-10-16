<template>
  <div class="page">
    <PageHeader
      :title="$t('settings')"
      :subtitle="$t('settings-subtitle')"
      icon="mdi-cog-outline"
      :breadcrumbs="breadcrumbs"
    >
      <template v-if="!isAdmin" #actions>
        <span class="panel-chip panel-chip--amber">
          <v-icon size="14" class="mr-1">mdi-eye-outline</v-icon>
          {{ $t("view_only") }}
        </span>
      </template>
    </PageHeader>

    <v-row>
      <!-- Left: school identity -->
      <v-col cols="12" md="4">
        <v-card class="panel h-100 fade-in" elevation="0">
          <div class="school-hero">
            <div class="school-badge">
              <v-icon size="30">mdi-school-outline</v-icon>
            </div>
            <div class="school-name">{{ settings.school_name || "—" }}</div>
            <div class="school-sub">{{ $t("general-settings-desc") }}</div>
            <v-btn
              v-if="isAdmin"
              variant="flat"
              size="small"
              class="modern-action-btn secondary mt-4"
              @click="openSchoolDialog"
            >
              <v-icon start size="16">mdi-pencil-outline</v-icon>
              {{ $t("edit") }}
            </v-btn>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <v-icon size="16">mdi-cog-outline</v-icon>
            {{ $t("general-settings") }}
          </div>

          <div v-for="(item, i) in schoolDetails" :key="i" class="info-row">
            <div class="info-row-icon">
              <v-icon size="16">{{ item.icon }}</v-icon>
            </div>
            <div class="min-w-0">
              <div class="info-row-label">{{ item.title }}</div>
              <div class="info-row-value">{{ item.value || "—" }}</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Right: academic / notifications / security -->
      <v-col cols="12" md="8">
        <!-- Academic settings -->
        <v-card class="panel mb-4 fade-in" elevation="0">
          <div class="panel-head">
            <div class="d-flex align-center ga-3">
              <div class="section-icon" style="--sec-color: #15803d; --sec-tint: #f0fdf4">
                <v-icon size="20">mdi-book-open-page-variant-outline</v-icon>
              </div>
              <div>
                <div class="panel-title">{{ $t("academic-config") }}</div>
                <div class="panel-sub">{{ $t("academic-config-desc") }}</div>
              </div>
            </div>
            <v-btn
              v-if="isAdmin"
              icon="mdi-pencil-outline"
              variant="tonal"
              color="primary"
              size="small"
              @click="openSemesterDialog"
            ></v-btn>
          </div>

          <!-- Active academic year — real data from tb_academic_year. -->
          <div class="info-row">
            <div class="info-row-icon">
              <v-icon size="16">mdi-calendar-month-outline</v-icon>
            </div>
            <div class="flex-grow-1 min-w-0">
              <div class="info-row-label">{{ $t("academic-year") }}</div>
              <div class="info-row-value">{{ activeYear?.title || "—" }}</div>
            </div>
            <span
              v-if="activeYear"
              class="status-pill"
              :class="
                activeYear.status === 'active'
                  ? 'status-pill--green'
                  : 'status-pill--grey'
              "
            >
              <span class="status-dot"></span>
              {{ activeYear.status === "active" ? $t("active") : $t("inactive") }}
            </span>
          </div>

          <!-- Semester — stored in settings. -->
          <div class="info-row">
            <div class="info-row-icon">
              <v-icon size="16">mdi-calendar-range-outline</v-icon>
            </div>
            <div class="min-w-0">
              <div class="info-row-label">{{ $t("semester") }}</div>
              <div class="info-row-value">{{ settings.semester || "—" }}</div>
            </div>
          </div>

          <!-- Timeline — derived from the active year's dates (read-only). -->
          <div class="info-row">
            <div class="info-row-icon">
              <v-icon size="16">mdi-clock-time-four-outline</v-icon>
            </div>
            <div class="min-w-0">
              <div class="info-row-label">{{ $t("timeline") }}</div>
              <div class="info-row-value">{{ yearTimeline }}</div>
            </div>
          </div>
        </v-card>

        <v-row>
          <!-- Notifications -->
          <v-col cols="12" lg="6">
            <v-card class="panel h-100 fade-in" elevation="0">
              <div class="panel-head">
                <div class="d-flex align-center ga-3">
                  <div class="section-icon" style="--sec-color: #6d28d9; --sec-tint: #f5f3ff">
                    <v-icon size="20">mdi-bell-outline</v-icon>
                  </div>
                  <div>
                    <div class="panel-title">{{ $t("notifications") }}</div>
                    <div class="panel-sub">{{ $t("notifications-desc") }}</div>
                  </div>
                </div>
              </div>

              <div
                v-for="notif in notifications"
                :key="notif.key"
                class="info-row align-center"
              >
                <div class="info-row-icon">
                  <v-icon size="16">{{ notif.icon }}</v-icon>
                </div>
                <div class="flex-grow-1 min-w-0">
                  <div class="info-row-value">{{ notif.title }}</div>
                </div>
                <v-switch
                  :model-value="settings[notif.key]"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                  :disabled="!isAdmin || saving"
                  @update:model-value="toggle(notif.key, $event)"
                ></v-switch>
              </div>
            </v-card>
          </v-col>

          <!-- Security -->
          <v-col cols="12" lg="6">
            <v-card class="panel h-100 fade-in" elevation="0">
              <div class="panel-head">
                <div class="d-flex align-center ga-3">
                  <div class="section-icon" style="--sec-color: #b45309; --sec-tint: #fffbeb">
                    <v-icon size="20">mdi-shield-lock-outline</v-icon>
                  </div>
                  <div>
                    <div class="panel-title">{{ $t("security") }}</div>
                    <div class="panel-sub">{{ $t("security-desc") }}</div>
                  </div>
                </div>
              </div>

              <div class="info-row align-center">
                <div class="info-row-icon">
                  <v-icon size="16">mdi-two-factor-authentication</v-icon>
                </div>
                <div class="flex-grow-1 min-w-0">
                  <div class="info-row-value">{{ $t("two-factor-auth") }}</div>
                </div>
                <v-switch
                  :model-value="settings.two_factor"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                  :disabled="!isAdmin || saving"
                  @update:model-value="toggle('two_factor', $event)"
                ></v-switch>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Edit school info -->
    <v-dialog v-model="schoolDialog" width="480">
      <v-card class="pa-5 pa-md-6">
        <div class="d-flex align-center mb-5">
          <div class="page-icon mr-3">
            <v-icon size="20">mdi-school-outline</v-icon>
          </div>
          <div>
            <div class="panel-title">{{ $t("general-settings") }}</div>
            <div class="panel-sub">{{ $t("general-settings-desc") }}</div>
          </div>
        </div>

        <label class="field-label">{{ $t("school-name") }}</label>
        <v-text-field
          v-model="schoolForm.school_name"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
          prepend-inner-icon="mdi-school-outline"
        ></v-text-field>
        <label class="field-label">{{ $t("address") }}</label>
        <v-text-field
          v-model="schoolForm.address"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
          prepend-inner-icon="mdi-map-marker-outline"
        ></v-text-field>
        <label class="field-label">{{ $t("phone") }}</label>
        <v-text-field
          v-model="schoolForm.phone"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-phone-outline"
        ></v-text-field>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="schoolDialog = false"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            :loading="saving"
            @click="saveSchool"
          >
            {{ $t("save") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Edit semester -->
    <v-dialog v-model="semesterDialog" width="440">
      <v-card class="pa-5 pa-md-6">
        <div class="d-flex align-center mb-5">
          <div class="page-icon mr-3">
            <v-icon size="20">mdi-calendar-range-outline</v-icon>
          </div>
          <div>
            <div class="panel-title">{{ $t("semester") }}</div>
            <div class="panel-sub">{{ $t("academic-config-desc") }}</div>
          </div>
        </div>

        <label class="field-label">{{ $t("semester") }}</label>
        <v-text-field
          v-model="semesterForm"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-calendar-range-outline"
        ></v-text-field>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="semesterDialog = false"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            :loading="saving"
            @click="saveSemester"
          >
            {{ $t("save") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
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
/* School identity block at the top of the summary card */
.school-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 0 4px;
}
.school-badge {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, var(--ds-navy) 0%, #0f4c7a 100%);
  box-shadow: 0 14px 28px -16px rgba(10, 49, 84, 0.7);
  margin-bottom: 14px;
}
.school-name {
  font-size: 18px;
  font-weight: 900;
  color: var(--ds-text);
  line-height: 1.25;
  word-break: break-word;
}
.school-sub {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ds-muted);
  margin-top: 4px;
}

/* Coloured icon square in the panel heads */
.section-icon {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sec-color, var(--ds-navy));
  background: var(--sec-tint, var(--ds-navy-tint));
}

/* Tighten switches so the toggle rows stay compact */
:deep(.v-switch__track) {
  height: 20px !important;
  width: 40px !important;
}
:deep(.v-switch__thumb) {
  height: 14px !important;
  width: 14px !important;
}
:deep(.v-switch .v-selection-control) {
  min-height: 0;
}
</style>
