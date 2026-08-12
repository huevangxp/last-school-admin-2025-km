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
          @click="exportList"
        >
          <v-icon icon="mdi-file-download-outline" start size="18"></v-icon>
          {{ t("export") }}
        </v-btn>

        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          to="/academic/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Matrix: Academic KPIs -->
    <v-row class="mb-6 ga-y-4">
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="(stat, i) in academicStats"
        :key="i"
      >
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

    <!-- Main Repository: Intelligence Area -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <!-- Search & Contextual Filters -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          :placeholder="$t('search')"
          density="compact"
          hide-details
          class="cream-input"
          style="max-width: 320px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
        ></v-text-field>

        <div class="d-flex gap-2 align-center flex-wrap">
          <v-select
            :items="['All Years', '2023-24', '2024-25']"
            density="compact"
            variant="outlined"
            hide-details
            style="min-width: 130px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>
        </div>
      </div>

      <!-- Data Intelligence Grid -->
      <v-data-table
        :headers="headers"
        :items="academics"
        :search="search"
        class="premium-table"
        hover
      >
        <template v-slot:item.id="{ index }">
          <span class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded-0">
            {{ index + 1 }}
          </span>
        </template>

        <!-- Academic Year Descriptor Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="blue-lighten-5"
              size="32"
              class="mr-3 elevation-1 border-white"
            >
              <v-icon
                icon="mdi-calendar-range"
                size="16"
                color="blue-darken-2"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.title }}</div>
              <div class="text-detail-tiny">{{ hiddenId(item.id) }}</div>
            </div>
          </div>
        </template>

        <!-- Dates Specification Slot -->
        <template v-slot:item.startDate="{ item }">
          <div class="text-title-small">{{ formatDate(item.start_date) }}</div>
        </template>

        <template v-slot:item.endDate="{ item }">
          <div class="text-title-small">{{ formatDate(item.end_date) }}</div>
        </template>

        <!-- Lifecycle Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="
              item.status === 'active'
                ? 'success'
                : item.status === 'upcoming'
                  ? 'info'
                  : 'red'
            "
            size="x-small"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status === 'active'
              ? t('ເປີດ')
              : item.status === 'upcoming'
                ? t('ກຳລັງເປີດ')
                : t('ປິດ') }}
          </v-chip>
        </template>

        <!-- Intelligence Actions Slot -->
        <template v-slot:item.action="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              icon="mdi-pencil-outline"
              size="x-small"
              variant="text"
              color="primary"
              @click="openEdit(item)"
            ></v-btn>
            <v-btn
              icon="mdi-trash-can-outline"
              size="x-small"
              variant="text"
              color="error"
              @click="removeAcademic(item)"
            ></v-btn>
          </div>
        </template>

        <!-- Navigation Architecture Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Displaying 1-{{ academics.length }} of
              {{ academics.length }} academic records
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
                class="font-weight-black rounded-0"
                style="min-width: 24px; height: 24px"
              >
                1
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

    <!-- Edit Academic Year Dialog -->
    <v-dialog v-model="editDialog" width="480">
      <v-card class="pa-6">
        <div class="text-title mb-4">{{ t("edit") }} {{ t("academic") }}</div>
        <label class="text-detail-tiny mb-1 d-block">{{ t("title") }}</label>
        <v-text-field
          v-model="editForm.title"
          variant="outlined"
          density="compact"
          hide-details
          class="mb-3"
        ></v-text-field>
        <v-row>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{
              t("start_date")
            }}</label>
            <DialogDate
              v-model="showStartDatePicker"
              :date="editForm.startDate"
              @update:date="editForm.startDate = $event"
            />
            <v-text-field
              v-model="editForm.startDate"
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-calendar-start"
              readonly
              @click="showStartDatePicker = true"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{
              t("end_date")
            }}</label>
            <DialogDate
              v-model="showEndDatePicker"
              :date="editForm.endDate"
              @update:date="editForm.endDate = $event"
            />
            <v-text-field
              v-model="editForm.endDate"
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-calendar-end"
              readonly
              @click="showEndDatePicker = true"
            ></v-text-field>
          </v-col>
        </v-row>
        <label class="text-detail-tiny mb-1 mt-3 d-block">{{
          t("description")
        }}</label>
        <v-text-field
          v-model="editForm.description"
          variant="outlined"
          density="compact"
          hide-details
          class="mb-3"
        ></v-text-field>
        <label class="text-detail-tiny mb-1 d-block">{{ t("status") }}</label>
        <v-select
          v-model="editForm.status"
          :items="['active', 'inactive']"
          variant="outlined"
          density="compact"
          hide-details
        ></v-select>

        <v-alert
          v-if="editError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ editError }}</v-alert
        >

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="editDialog = false">{{
            t("cancel")
          }}</v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="saving"
            @click="saveEdit"
            >{{ t("save") }}</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAcademicStore } from "@/stores/apiAcademic";
import { useUiStore } from "~/stores/ui";
import { formatDate, hiddenId } from "@/utils/formatDate";
const { t } = useI18n();

const search = ref("");
const academicStore = useAcademicStore();
const ui = useUiStore();
const { fetchAcademics } = academicStore;
const { academics } = storeToRefs(academicStore);

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("academic"), disabled: true, to: "/academic" },
];

// ---- Edit / Delete ----
const editDialog = ref(false);
const saving = ref(false);
const editError = ref("");
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);

const editForm = ref({
  id: "",
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  status: "active",
});

const openEdit = (item: any) => {
  editError.value = "";
  editForm.value = {
    id: item.id,
    title: item.title || "",
    startDate: item.start_date ? String(item.start_date).substring(0, 10) : "",
    endDate: item.end_date ? String(item.end_date).substring(0, 10) : "",
    description: item.description || "",
    status: item.status || "active",
  };
  editDialog.value = true;
};

const saveEdit = async () => {
  saving.value = true;
  try {
    await academicStore.updateAcademic(editForm.value.id, {
      title: editForm.value.title,
      startDate: editForm.value.startDate,
      endDate: editForm.value.endDate,
      description: editForm.value.description || "-",
      status: editForm.value.status,
    });
    editDialog.value = false;
    await fetchAcademics();
  } catch (error: any) {
    editError.value = error.response?.data?.message || "Failed to update.";
  } finally {
    saving.value = false;
  }
};

const removeAcademic = async (item: any) => {
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await academicStore.deleteAcademic(item.id);
    await fetchAcademics();
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify("Failed to delete.", "error");
  }
};

const { exportRows } = useExcel();
const exportList = () =>
  exportRows(
    "academic-years",
    [
      { label: t("academic"), key: "title" },
      { label: t("start_date"), key: "start_date" },
      { label: t("end_date"), key: "end_date" },
      { label: t("status"), key: "status" },
      { label: t("description"), key: "description" },
    ],
    academics.value || []
  );

// Real KPIs derived from the loaded academic years (no more hardcoded mock).
const academicStats = computed(() => {
  const list = academics.value || [];
  const active = list.find((a: any) => a.status === "active");
  return [
    {
      label: t("total-sessions"),
      value: String(list.length),
      icon: "mdi-calendar-range",
      color: "blue",
    },
    {
      label: t("active"),
      value: active?.title || "—",
      icon: "mdi-check-circle",
      color: "green",
    },
    {
      label: t("upcoming"),
      value: String(list.filter((a: any) => a.status === "upcoming").length),
      icon: "mdi-clock-outline",
      color: "purple",
    },
    {
      label: t("archived"),
      value: String(list.filter((a: any) => a.status === "archived").length),
      icon: "mdi-archive-outline",
      color: "orange",
    },
  ];
});

const headers = [
  { title: "ID", key: "id", align: "start" as const, sortable: true },
  {
    title: t("academic"),
    key: "title",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("start_date"),
    key: "startDate",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("end_date"),
    key: "endDate",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("status"),
    key: "status",
    align: "start" as const,
    sortable: true,
  },
  { title: "", key: "action", align: "end" as const, sortable: false },
].map((h) => ({
  ...h,
  class: "text-detail-tiny pb-2",
}));

onMounted(() => {
  fetchAcademics();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.metric-card {
  background: white;
  border: 1px solid #f1f5f9;
}

.metric-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.intelligence-card {
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
