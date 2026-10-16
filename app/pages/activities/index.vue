<template>
  <div class="page">
    <PageHeader
      :title="$t('activities')"
      :subtitle="$t('manage-activities-subtitle')"
      icon="mdi-calendar-star-outline"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <v-btn variant="flat" class="modern-action-btn primary" @click="openCreate">
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ $t("add") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- KPI tiles -->
    <v-row class="mb-2 fade-in">
      <v-col v-for="(stat, i) in activityStats" :key="i" cols="6" md="4">
        <StatCard
          :icon="stat.icon"
          :label="stat.label"
          :value="stat.value"
          :color="statPalette[stat.color]?.color"
          :tint="statPalette[stat.color]?.tint"
        />
      </v-col>
    </v-row>

    <!-- List -->
    <v-card elevation="0" class="panel panel--flush fade-in">
      <div class="px-4 px-md-6 pt-4 pt-md-5">
        <div class="filter-bar">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="$t('search')"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            class="filter-search"
          ></v-text-field>
          <div class="filter-spacer"></div>
          <span class="panel-chip">
            {{ activityStore.activities.length }} {{ $t("total") }}
          </span>
        </div>
      </div>

      <div class="table-wrap">
        <v-data-table
          :headers="headers"
          :items="activityStore.activities"
          :search="search"
          :loading="activityStore.loading"
          class="premium-table"
          hover
        >
          <template v-slot:no-data>
            <div class="pa-4">
              <EmptyState
                icon="mdi-calendar-star-outline"
                :title="$t('no-activities-yet')"
              />
            </div>
          </template>

          <template v-slot:item.title="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <div class="avatar-chip" style="color: #7c3aed; background: #f3e8ff">
                <v-icon icon="mdi-calendar-star" size="18"></v-icon>
              </div>
              <div class="min-w-0">
                <div class="cell-title">{{ item.title }}</div>
                <div class="cell-sub text-truncate cell-desc">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </template>

          <template v-slot:item.location="{ item }">
            <div class="d-flex align-center ga-1 text-no-wrap">
              <v-icon size="14" color="grey">mdi-map-marker-outline</v-icon>
              <span class="cell-value">{{ item.location || "—" }}</span>
            </div>
          </template>

          <template v-slot:item.activity_date="{ item }">
            <div class="d-flex align-center ga-1 text-no-wrap">
              <v-icon size="14" color="grey">mdi-calendar-outline</v-icon>
              <span class="cell-value">
                {{ item.activity_date ? formatDate(item.activity_date) : "—" }}
              </span>
            </div>
          </template>

          <template v-slot:item.activity_status="{ item }">
            <span
              class="status-pill"
              :class="
                item.activity_status === 'active'
                  ? 'status-pill--green'
                  : 'status-pill--grey'
              "
            >
              <span class="status-dot"></span>
              {{ item.activity_status === "active" ? $t("active") : $t("hidden") }}
            </span>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="row-actions">
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="small"
                color="primary"
                @click="openEdit(item)"
              ></v-btn>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="small"
                color="error"
                @click="removeItem(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <!-- Create / Edit Dialog -->
    <v-dialog v-model="dialog" width="560">
      <v-card class="pa-5 pa-md-6">
        <div class="dialog-head">
          <div class="page-icon">
            <v-icon size="20">mdi-calendar-star-outline</v-icon>
          </div>
          <div class="min-w-0 flex-grow-1">
            <div class="panel-title">
              {{ isEdit ? t("edit") : t("add") }} {{ $t("activities") }}
            </div>
            <div class="panel-sub">{{ $t("manage-activities-subtitle") }}</div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="dialog = false"
          ></v-btn>
        </div>

        <label class="field-label">{{ t("title") }}</label>
        <v-text-field
          v-model="form.title"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
        ></v-text-field>

        <label class="field-label">{{ t("description") }}</label>
        <v-textarea
          v-model="form.description"
          variant="outlined"
          density="comfortable"
          rows="4"
          hide-details
          class="mb-4"
        ></v-textarea>

        <v-row dense>
          <v-col cols="12" sm="6">
            <label class="field-label">{{ t("location") }}</label>
            <v-text-field
              v-model="form.location"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-map-marker-outline"
              class="mb-4"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <label class="field-label">{{ t("activity_date") }}</label>
            <DialogDate
              v-model="showActivityDatePicker"
              :date="form.activity_date"
              @update:date="form.activity_date = $event"
            />
            <v-text-field
              v-model="form.activity_date"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="mdi-calendar"
              readonly
              class="mb-4"
              @click="showActivityDatePicker = true"
            ></v-text-field>
          </v-col>
        </v-row>

        <label class="field-label">{{ t("image") }}</label>
        <ImagePicker v-model="form.image_url" class="mb-4" />

        <label class="field-label">{{ t("status") }}</label>
        <v-select
          v-model="form.activity_status"
          :items="statusOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>

        <v-alert
          v-if="formError"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-4"
          >{{ formError }}</v-alert
        >

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="dialog = false"
            >{{ t("cancel") }}</v-btn
          >
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            :loading="saving"
            @click="save"
            >{{ t("save") }}</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useActivityStore } from "~/stores/apiActivity";
import { useUiStore } from "~/stores/ui";
import { formatDate } from "@/utils/formatDate";

const { t } = useI18n();
const activityStore = useActivityStore();
const ui = useUiStore();

const search = ref("");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("activities"), disabled: true, to: "/activities" },
];

const statusOptions = [
  { label: t("active"), value: "active" },
  { label: t("hidden"), value: "inactive" },
];

const headers = [
  { title: t("title"), key: "title", align: "start" as const, sortable: true },
  { title: t("location"), key: "location", align: "start" as const, sortable: true },
  { title: t("activity_date"), key: "activity_date", align: "start" as const, sortable: true },
  { title: t("status"), key: "activity_status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const activityStats = computed(() => [
  {
    label: t("total-activities"),
    value: String(activityStore.activities.length),
    icon: "mdi-calendar-star",
    color: "purple",
  },
  {
    label: t("active"),
    value: String(
      activityStore.activities.filter((a) => a.activity_status === "active").length
    ),
    icon: "mdi-check-circle-outline",
    color: "green",
  },
  {
    label: t("hidden"),
    value: String(
      activityStore.activities.filter((a) => a.activity_status !== "active").length
    ),
    icon: "mdi-eye-off-outline",
    color: "orange",
  },
]);

// Presentation-only: hex colours for the StatCard tiles (keyed by stat.color).
const statPalette: Record<string, { color: string; tint: string }> = {
  purple: { color: "#7c3aed", tint: "#f3e8ff" },
  blue: { color: "#2563eb", tint: "#dbeafe" },
  green: { color: "#16a34a", tint: "#dcfce7" },
  orange: { color: "#ea580c", tint: "#ffedd5" },
};

// ---- Create / Edit ----
const dialog = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const formError = ref("");

// New activities default their date to today.
const todayStr = () => new Date().toISOString().substring(0, 10);

const showActivityDatePicker = ref(false);

const form = ref({
  id: "",
  title: "",
  description: "",
  location: "",
  activity_date: todayStr(),
  image_url: "",
  activity_status: "active",
});

const resetForm = () => {
  form.value = {
    id: "",
    title: "",
    description: "",
    location: "",
    activity_date: todayStr(),
    image_url: "",
    activity_status: "active",
  };
  formError.value = "";
};

const openCreate = () => {
  resetForm();
  isEdit.value = false;
  dialog.value = true;
};

const openEdit = (item: any) => {
  formError.value = "";
  isEdit.value = true;
  form.value = {
    id: item.id,
    title: item.title,
    description: item.description,
    location: item.location || "",
    activity_date: item.activity_date
      ? String(item.activity_date).substring(0, 10)
      : "",
    image_url: item.image_url || "",
    activity_status: item.activity_status || "active",
  };
  dialog.value = true;
};

const save = async () => {
  if (!form.value.title || !form.value.description) {
    formError.value = t("title-description-required");
    return;
  }
  saving.value = true;
  try {
    const payload = {
      title: form.value.title,
      description: form.value.description,
      location: form.value.location || null,
      activity_date: form.value.activity_date || null,
      image_url: form.value.image_url || null,
      activity_status: form.value.activity_status,
    };
    if (isEdit.value) {
      await activityStore.updateActivity(form.value.id, payload);
    } else {
      await activityStore.createActivity(payload);
    }
    dialog.value = false;
    await activityStore.fetchActivities();
  } catch (error: any) {
    formError.value = error.response?.data?.message || t("failed-to-save");
  } finally {
    saving.value = false;
  }
};

const removeItem = async (item: any) => {
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await activityStore.deleteActivity(item.id);
    await activityStore.fetchActivities();
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify(t("failed-to-delete"), "error");
  }
};

onMounted(() => {
  activityStore.fetchActivities();
});
</script>

<style scoped>
/* Truncated description under the title cell */
.cell-desc {
  max-width: 320px;
}
.cell-value {
  font-size: 13.5px;
  font-weight: 600;
  color: #334155;
}

/* Dialog header */
.dialog-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
</style>
