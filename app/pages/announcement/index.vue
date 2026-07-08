<template>
  <v-container fluid class="pa-4 pa-md-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="deep-orange-lighten-5" size="44" class="mr-3 rounded-0">
          <v-icon color="deep-orange-darken-2" size="22">mdi-bullhorn-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ t("announcements") }}</div>
          <div class="text-detail">{{ t("announcement-feed-subtitle") }}</div>
        </div>
      </div>

      <!-- Teachers & admins can post; students only read. -->
      <v-btn
        v-if="!isStudent"
        color="primary"
        class="modern-action-btn primary elevation-4 mt-4 mt-md-0"
        height="36"
        @click="openCreate"
      >
        <v-icon icon="mdi-plus" start size="18"></v-icon>
        {{ t("post-announcement") }}
      </v-btn>
      <v-chip
        v-else
        size="small"
        rounded="0"
        color="deep-orange-lighten-5"
        class="text-deep-orange-darken-2 font-weight-bold mt-4 mt-md-0"
        variant="flat"
      >
        <v-icon start size="14">mdi-eye-outline</v-icon>
        {{ t("view_only") }}
      </v-chip>
    </div>

    <!-- Loading -->
    <div v-if="announcementStore.loading" class="py-10 text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <!-- Empty -->
    <v-card
      v-else-if="!feed.length"
      elevation="0"
      class="intelligence-card pa-10 text-center text-detail"
    >
      {{ t("no-announcements-yet") }}
    </v-card>

    <!-- Feed -->
    <v-row v-else>
      <v-col
        v-for="a in feed"
        :key="a.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card elevation="0" class="intelligence-card h-100 overflow-hidden d-flex flex-column">
          <v-img
            v-if="a.image_url"
            :src="mediaUrl(a.image_url)"
            height="160"
            cover
          ></v-img>
          <div class="pa-4 d-flex flex-column flex-grow-1">
            <div class="d-flex align-center mb-2">
              <v-icon size="16" color="deep-orange-darken-2" class="mr-2">
                mdi-bullhorn-outline
              </v-icon>
              <div class="text-detail-tiny">{{ formatDate(a.created_at) }}</div>
            </div>
            <div class="text-title-small mb-2">{{ a.title }}</div>
            <div class="text-detail announcement-body flex-grow-1">
              {{ a.content }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Post dialog (teachers / admins) -->
    <v-dialog v-model="dialog" width="560">
      <v-card rounded="0" class="pa-6">
        <div class="text-title mb-4">{{ t("post-announcement") }}</div>

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

        <v-alert
          v-if="formError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-2"
          >{{ formError }}</v-alert
        >

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="dialog = false">{{ t("cancel") }}</v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="saving"
            @click="save"
            >{{ t("post") }}</v-btn
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
const { mediaUrl } = useMedia();

const roleCookie = useCookie<string>("role");
const isStudent = computed(
  () => (roleCookie.value || "").toLowerCase() === "student"
);

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("announcements"), disabled: true, to: "/announcement" },
];

// Only published announcements appear in the feed.
const feed = computed(() =>
  announcementStore.announcements
    .filter((a: any) => a.announcement_status === "active")
    .slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
);

// ---- Post ----
const dialog = ref(false);
const saving = ref(false);
const formError = ref("");
const form = ref({ title: "", content: "", image_url: "" });

const openCreate = () => {
  form.value = { title: "", content: "", image_url: "" };
  formError.value = "";
  dialog.value = true;
};

const save = async () => {
  if (!form.value.title || !form.value.content) {
    formError.value = t("title-content-required");
    return;
  }
  saving.value = true;
  try {
    await announcementStore.createAnnouncement({
      title: form.value.title,
      content: form.value.content,
      image_url: form.value.image_url || null,
      announcement_status: "active",
    });
    dialog.value = false;
    await announcementStore.fetchAnnouncements();
    ui.notify(t("saved"), "success");
  } catch (error: any) {
    formError.value = error.response?.data?.message || t("failed-to-save");
  } finally {
    saving.value = false;
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
.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}
.modern-action-btn {
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  padding: 0 12px !important;
}
.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}
/* Clamp the body text so cards stay uniform height. */
.announcement-body {
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
