<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <div class="text-title mb-1">{{ $t("news") }}</div>
        <div class="text-detail">{{ $t("manage-news-subtitle") }}</div>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          @click="openCreate"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in newsStats" :key="i">
        <v-card
          class="metric-card pa-4 d-flex flex-column justify-space-between h-100"
          elevation="0"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p class="text-detail-tiny mb-1">{{ stat.label }}</p>
              <h2 class="text-title">{{ stat.value }}</h2>
            </div>
            <v-avatar
              :color="`${stat.color}-lighten-5`"
              rounded="0"
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

    <!-- Main -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="$t('search')"
          variant="outlined"
          density="compact"
          hide-details
          class="cream-input"
          style="max-width: 320px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="0"
        ></v-text-field>
      </div>

      <v-data-table
        :headers="headers"
        :items="announcementStore.announcements"
        :search="search"
        :loading="announcementStore.loading"
        class="premium-table"
        hover
      >
        <template v-slot:no-data>
          <div class="text-detail py-8 text-center">No news yet.</div>
        </template>

        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="blue-lighten-5"
              size="32"
              class="mr-3 elevation-1 border-white"
              rounded="0"
            >
              <v-icon icon="mdi-newspaper-variant-outline" size="16" color="blue-darken-2"></v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.title }}</div>
              <div class="text-detail-tiny text-truncate" style="max-width: 360px">
                {{ item.content }}
              </div>
            </div>
          </div>
        </template>

        <template v-slot:item.created_at="{ item }">
          <div class="text-title-small">{{ formatDate(item.created_at) }}</div>
        </template>

        <template v-slot:item.announcement_status="{ item }">
          <v-chip
            :color="item.announcement_status === 'active' ? 'success' : 'grey'"
            size="x-small"
            rounded="0"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.announcement_status === "active" ? "ເປິດ" : "ປິດສະແດງ" }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn
              icon="mdi-pencil-outline"
              variant="text"
              size="x-small"
              color="primary"
              @click="openEdit(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              size="x-small"
              color="error"
              @click="removeItem(item)"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create / Edit Dialog -->
    <v-dialog v-model="dialog" width="560">
      <v-card rounded="0" class="pa-6">
        <div class="text-title mb-4">
          {{ isEdit ? t("edit") : t("add") }} {{ $t("news") }}
        </div>

        <label class="text-detail-tiny mb-1 d-block">{{ t("title") }}</label>
        <v-text-field
          v-model="form.title"
          variant="outlined"
          density="compact"
          rounded="0"
          hide-details
          class="mb-3"
        ></v-text-field>

        <label class="text-detail-tiny mb-1 d-block">{{ t("content") }}</label>
        <v-textarea
          v-model="form.content"
          variant="outlined"
          density="compact"
          rounded="0"
          rows="5"
          hide-details
          class="mb-3"
        ></v-textarea>

        <label class="text-detail-tiny mb-1 d-block">{{ t("image") }}</label>
        <ImagePicker v-model="form.image_url" class="mb-3" />

        <label class="text-detail-tiny mb-1 d-block">{{ t("status") }}</label>
        <v-select
          v-model="form.announcement_status"
          :items="statusOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          rounded="0"
          hide-details
        ></v-select>

        <v-alert
          v-if="formError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ formError }}</v-alert
        >

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="dialog = false">{{ t("cancel") }}</v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="saving"
            @click="save"
            >{{ t("save") }}</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </v-container>
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
  { label: "Published", value: "active" },
  { label: "Hidden", value: "inactive" },
];

const headers = [
  { title: t("title"), key: "title", align: "start" as const, sortable: true },
  { title: t("start_date"), key: "created_at", align: "start" as const, sortable: true },
  { title: t("status"), key: "announcement_status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const newsStats = computed(() => [
  {
    label: "Total News",
    value: String(announcementStore.announcements.length),
    icon: "mdi-newspaper-variant-outline",
    color: "blue",
  },
  {
    label: "Published",
    value: String(
      announcementStore.announcements.filter(
        (a) => a.announcement_status === "active"
      ).length
    ),
    icon: "mdi-check-circle-outline",
    color: "green",
  },
  {
    label: "Hidden",
    value: String(
      announcementStore.announcements.filter(
        (a) => a.announcement_status !== "active"
      ).length
    ),
    icon: "mdi-eye-off-outline",
    color: "orange",
  },
]);

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
    formError.value = "Title and content are required.";
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
    formError.value = error.response?.data?.message || "Failed to save.";
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
    ui.notify("Failed to delete.", "error");
  }
};

onMounted(() => {
  announcementStore.fetchAnnouncements();
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
</style>
