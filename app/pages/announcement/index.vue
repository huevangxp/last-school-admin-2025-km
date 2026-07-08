<template>
  <v-container fluid class="pa-4 pa-md-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div class="feed-column mx-auto d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center">
        <v-avatar color="deep-orange-lighten-5" size="44" class="mr-3 rounded-0">
          <v-icon color="deep-orange-darken-2" size="22">mdi-bullhorn-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ t("announcements") }}</div>
          <div class="text-detail">{{ t("announcement-feed-subtitle") }}</div>
        </div>
      </div>

      <!-- Students only read. -->
      <v-chip
        v-if="isStudent"
        size="small"
        rounded="0"
        color="deep-orange-lighten-5"
        class="text-deep-orange-darken-2 font-weight-bold"
        variant="flat"
      >
        <v-icon start size="14">mdi-eye-outline</v-icon>
        {{ t("view_only") }}
      </v-chip>
    </div>

    <div class="feed-column mx-auto">
      <!-- Composer (teachers / admins) -->
      <v-card v-if="!isStudent" elevation="0" class="fb-card mb-4">
        <div class="pa-4 d-flex align-center ga-3">
          <v-avatar color="deep-orange-lighten-5" size="40">
            <v-icon color="deep-orange-darken-2" size="20"
              >mdi-bullhorn-outline</v-icon
            >
          </v-avatar>
          <button
            type="button"
            class="composer-input flex-grow-1"
            @click="openCreate"
          >
            {{ t("write-announcement") }}
          </button>
        </div>
        <v-divider></v-divider>
        <div class="pa-1">
          <v-btn
            variant="text"
            block
            class="composer-cta"
            @click="openCreate"
          >
            <v-icon start size="18" color="deep-orange-darken-2"
              >mdi-image-outline</v-icon
            >
            {{ t("post-announcement") }}
          </v-btn>
        </div>
      </v-card>

      <!-- Loading -->
      <div v-if="announcementStore.loading" class="py-10 text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <!-- Empty -->
      <v-card
        v-else-if="!feed.length"
        elevation="0"
        class="fb-card pa-10 text-center text-detail"
      >
        {{ t("no-announcements-yet") }}
      </v-card>

      <!-- Feed (Facebook-style posts) -->
      <template v-else>
        <v-card
          v-for="a in feed"
          :key="a.id"
          elevation="0"
          class="fb-card mb-4 overflow-hidden"
        >
          <!-- Post header -->
          <div class="pa-4 pb-2 d-flex align-center">
            <v-avatar color="deep-orange-lighten-5" size="44" class="mr-3">
              <v-icon color="deep-orange-darken-2" size="22">mdi-bullhorn</v-icon>
            </v-avatar>
            <div>
              <div class="fb-author">{{ t("announcement_author") }}</div>
              <div class="text-detail-tiny d-flex align-center ga-1">
                {{ formatDate(a.created_at) }}
                <span>·</span>
                <v-icon size="12">mdi-earth</v-icon>
              </div>
            </div>
          </div>

          <!-- Post body -->
          <div class="px-4 pb-3">
            <div v-if="a.title" class="text-title-small mb-1">{{ a.title }}</div>
            <div class="fb-content text-detail">{{ a.content }}</div>
          </div>

          <!-- Post image (full width) -->
          <v-img
            v-if="a.image_url"
            :src="mediaUrl(a.image_url)"
            cover
            max-height="520"
          ></v-img>

          <!-- Action bar -->
          <v-divider></v-divider>
          <div class="d-flex fb-actions">
            <v-btn variant="text" class="flex-grow-1 fb-action-btn">
              <v-icon start size="18">mdi-thumb-up-outline</v-icon>
              {{ t("like") }}
            </v-btn>
            <v-btn variant="text" class="flex-grow-1 fb-action-btn">
              <v-icon start size="18">mdi-comment-outline</v-icon>
              {{ t("comment") }}
            </v-btn>
            <v-btn variant="text" class="flex-grow-1 fb-action-btn">
              <v-icon start size="18">mdi-share-outline</v-icon>
              {{ t("share") }}
            </v-btn>
          </div>
        </v-card>
      </template>
    </div>

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
