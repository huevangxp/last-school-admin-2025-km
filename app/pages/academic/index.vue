<template>
  <div class="page">
    <PageHeader
      :title="t('academic')"
      :subtitle="t('academic-config-desc')"
      icon="mdi-calendar-range"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <v-btn
          variant="flat"
          class="modern-action-btn secondary"
          @click="exportList"
        >
          <v-icon icon="mdi-file-download-outline" start size="18"></v-icon>
          {{ t("export") }}
        </v-btn>
        <v-btn
          variant="flat"
          class="modern-action-btn primary"
          to="/academic/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("add") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- KPI cards -->
    <v-row class="mb-2 fade-in">
      <v-col v-for="(stat, i) in academicStats" :key="i" cols="6" lg="3">
        <StatCard
          :icon="stat.icon"
          :label="stat.label"
          :value="stat.value"
          :color="statPalette[stat.color]?.color"
          :tint="statPalette[stat.color]?.tint"
        />
      </v-col>
    </v-row>

    <!-- Academic years table -->
    <v-card elevation="0" class="panel panel--flush fade-in">
      <div class="panel-head">
        <div>
          <div class="panel-title">{{ t("academic") }}</div>
          <div class="panel-sub">{{ t("academic-config-desc") }}</div>
        </div>
        <span class="panel-chip">
          {{ (academics || []).length }} {{ t("total") }}
        </span>
      </div>

      <div class="pa-4 pa-md-5 pb-0 pb-md-0">
        <div class="filter-bar">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="t('search')"
            variant="outlined"
            density="compact"
            hide-details
            class="filter-search"
            color="primary"
          ></v-text-field>
        </div>
      </div>

      <div class="table-wrap">
        <v-data-table
          :headers="headers"
          :items="academics"
          :search="search"
          class="premium-table"
          hover
        >
          <template v-slot:no-data>
            <div class="pa-4">
              <EmptyState icon="mdi-calendar-blank-outline" :title="t('no-data')" />
            </div>
          </template>

          <!-- Row number -->
          <template v-slot:item.id="{ index }">
            <span class="code-chip">{{ index + 1 }}</span>
          </template>

          <!-- Academic year -->
          <template v-slot:item.title="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <div class="avatar-chip">
                <v-icon icon="mdi-calendar-range" size="16"></v-icon>
              </div>
              <div class="min-w-0">
                <div class="cell-title">{{ item.title }}</div>
                <div class="cell-sub">{{ hiddenId(item.id) }}</div>
              </div>
            </div>
          </template>

          <!-- Dates -->
          <template v-slot:item.startDate="{ item }">
            <span class="cell-title font-weight-medium">
              {{ formatDate(item.start_date) }}
            </span>
          </template>
          <template v-slot:item.endDate="{ item }">
            <span class="cell-title font-weight-medium">
              {{ formatDate(item.end_date) }}
            </span>
          </template>

          <!-- Status -->
          <template v-slot:item.status="{ item }">
            <span
              class="status-pill"
              :class="
                item.status === 'active'
                  ? 'status-pill--green'
                  : item.status === 'upcoming'
                    ? 'status-pill--indigo'
                    : 'status-pill--grey'
              "
            >
              <span class="status-dot"></span>
              {{
                item.status === "active"
                  ? t("active")
                  : item.status === "upcoming"
                    ? t("upcoming")
                    : t("archived")
              }}
            </span>
          </template>

          <!-- Actions -->
          <template v-slot:item.action="{ item }">
            <div class="row-actions">
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="small"
                color="primary"
                @click="openEdit(item)"
              ></v-btn>
              <v-btn
                icon="mdi-trash-can-outline"
                variant="text"
                size="small"
                color="error"
                @click="removeAcademic(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <!-- Edit Academic Year Dialog -->
    <v-dialog v-model="editDialog" width="520">
      <v-card elevation="0" class="pa-5 pa-md-6">
        <div class="panel-head">
          <div>
            <div class="panel-title">{{ t("edit") }} {{ t("academic") }}</div>
            <div class="panel-sub">{{ editForm.title }}</div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="editDialog = false"
          ></v-btn>
        </div>

        <label class="field-label">{{ t("title") }}</label>
        <v-text-field
          v-model="editForm.title"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
        ></v-text-field>

        <v-row dense>
          <v-col cols="12" sm="6">
            <label class="field-label">{{ t("start_date") }}</label>
            <DialogDate
              v-model="showStartDatePicker"
              :date="editForm.startDate"
              @update:date="editForm.startDate = $event"
            />
            <v-text-field
              v-model="editForm.startDate"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-calendar-start"
              readonly
              class="mb-4"
              @click="showStartDatePicker = true"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <label class="field-label">{{ t("end_date") }}</label>
            <DialogDate
              v-model="showEndDatePicker"
              :date="editForm.endDate"
              @update:date="editForm.endDate = $event"
            />
            <v-text-field
              v-model="editForm.endDate"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-calendar-end"
              readonly
              class="mb-4"
              @click="showEndDatePicker = true"
            ></v-text-field>
          </v-col>
        </v-row>

        <label class="field-label">{{ t("description") }}</label>
        <v-text-field
          v-model="editForm.description"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
        ></v-text-field>

        <label class="field-label">{{ t("status") }}</label>
        <v-select
          v-model="editForm.status"
          :items="['active', 'inactive']"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>

        <v-alert
          v-if="editError"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-4"
        >
          {{ editError }}
        </v-alert>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="editDialog = false"
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            :loading="saving"
            @click="saveEdit"
          >
            {{ t("save") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
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

// Presentation-only: map the stat colour names above to hex values for StatCard.
const statPalette: Record<string, { color: string; tint: string }> = {
  blue: { color: "#0a3154", tint: "#e6ecf2" },
  green: { color: "#16a34a", tint: "#f0fdf4" },
  purple: { color: "#7c3aed", tint: "#f5f3ff" },
  orange: { color: "#ea580c", tint: "#fff7ed" },
};
</script>

<style scoped>
/* Date cells should never wrap onto two lines */
.premium-table :deep(td .cell-title) {
  white-space: nowrap;
}
</style>
