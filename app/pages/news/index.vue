<template>
  <div class="page">
    <PageHeader
      :title="$t('news')"
      :subtitle="$t('manage-news-subtitle')"
      icon="mdi-newspaper-variant-outline"
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
      <v-col v-for="(stat, i) in newsStats" :key="i" cols="6" md="4">
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
            {{ announcementStore.announcements.length }} {{ $t("total") }}
          </span>
        </div>
      </div>

      <div class="table-wrap">
        <v-data-table
          :headers="headers"
          :items="announcementStore.announcements"
          :search="search"
          :loading="announcementStore.loading"
          class="premium-table"
          hover
        >
          <template v-slot:no-data>
            <div class="pa-4">
              <EmptyState
                icon="mdi-newspaper-variant-outline"
                :title="$t('no-news-yet')"
              />
            </div>
          </template>

          <template v-slot:item.title="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <div class="avatar-chip" style="color: #1d4ed8; background: #dbeafe">
                <v-icon icon="mdi-newspaper-variant-outline" size="18"></v-icon>
              </div>
              <div class="min-w-0">
                <div class="cell-title">{{ item.title }}</div>
                <div class="cell-sub text-truncate cell-desc">
                  {{ item.content }}
                </div>
              </div>
            </div>
          </template>

          <template v-slot:item.created_at="{ item }">
            <div class="d-flex align-center ga-1 text-no-wrap">
              <v-icon size="14" color="grey">mdi-calendar-outline</v-icon>
              <span class="cell-value">{{ formatDate(item.created_at) }}</span>
            </div>
          </template>

          <template v-slot:item.announcement_status="{ item }">
            <span
              class="status-pill"
              :class="
                item.announcement_status === 'active'
                  ? 'status-pill--green'
                  : 'status-pill--grey'
              "
            >
              <span class="status-dot"></span>
              {{ item.announcement_status === "active" ? $t("open") : $t("closed") }}
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
            <v-icon size="20">mdi-newspaper-variant-outline</v-icon>
          </div>
          <div class="min-w-0 flex-grow-1">
            <div class="panel-title">
              {{ isEdit ? t("edit") : t("add") }} {{ $t("news") }}
            </div>
            <div class="panel-sub">{{ $t("manage-news-subtitle") }}</div>
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

        <label class="field-label">{{ t("content") }}</label>
        <v-textarea
          v-model="form.content"
          variant="outlined"
          density="comfortable"
          rows="5"
          hide-details
          class="mb-4"
        ></v-textarea>

        <label class="field-label">{{ t("image") }}</label>
        <ImagePicker v-model="form.image_url" class="mb-4" />

        <label class="field-label">{{ t("status") }}</label>
        <v-select
          v-model="form.announcement_status"
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
import { useAnnouncementStore } from "~/stores/apiAnnouncement";
import { useUiStore } from "~/stores/ui";
import { formatDate } from "@/utils/formatDate";

const { t } = useI18n();
const announcementStore = useAnnouncementStore();
const ui = useUiStore();

const search = ref("");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("news"), disabled: true, to: "/news" },
];

const statusOptions = [
  { label: t("published"), value: "active" },
  { label: t("hidden"), value: "inactive" },
];

const headers = [
  { title: t("title"), key: "title", align: "start" as const, sortable: true },
  { title: t("start_date"), key: "created_at", align: "start" as const, sortable: true },
  { title: t("status"), key: "announcement_status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const newsStats = computed(() => [
  {
    label: t("total-news"),
    value: String(announcementStore.announcements.length),
    icon: "mdi-newspaper-variant-outline",
    color: "blue",
  },
  {
    label: t("published"),
    value: String(
      announcementStore.announcements.filter(
        (a) => a.announcement_status === "active"
      ).length
    ),
    icon: "mdi-check-circle-outline",
    color: "green",
  },
  {
    label: t("hidden"),
    value: String(
      announcementStore.announcements.filter(
        (a) => a.announcement_status !== "active"
      ).length
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
const form = ref({
  id: "",
  title: "",
  content: "",
  image_url: "",
  announcement_status: "active",
});

const resetForm = () => {
  form.value = {
    id: "",
    title: "",
    content: "",
    image_url: "",
    announcement_status: "active",
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
    content: item.content,
    image_url: item.image_url || "",
    announcement_status: item.announcement_status || "active",
  };
  dialog.value = true;
};

const save = async () => {
  if (!form.value.title || !form.value.content) {
    formError.value = t("title-content-required");
    return;
  }
  saving.value = true;
  try {
    const payload = {
      title: form.value.title,
      content: form.value.content,
      image_url: form.value.image_url || null,
      announcement_status: form.value.announcement_status,
    };
    if (isEdit.value) {
      await announcementStore.updateAnnouncement(form.value.id, payload);
    } else {
      await announcementStore.createAnnouncement(payload);
    }
    dialog.value = false;
    await announcementStore.fetchAnnouncements();
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
    await announcementStore.deleteAnnouncement(item.id);
    await announcementStore.fetchAnnouncements();
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify(t("failed-to-delete"), "error");
  }
};

onMounted(() => {
  announcementStore.fetchAnnouncements();
});
</script>

<style scoped>
/* Truncated content preview under the title cell */
.cell-desc {
  max-width: 360px;
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
