<template>
  <div class="page page--narrow">
    <div class="feed-column">
      <PageHeader
        :title="t('announcements')"
        :subtitle="t('announcement-feed-subtitle')"
        icon="mdi-bullhorn-outline"
        :breadcrumbs="breadcrumbs"
      >
        <!-- Students only read. -->
        <template v-if="isStudent" #actions>
          <span class="status-pill status-pill--navy">
            <v-icon size="14">mdi-eye-outline</v-icon>
            {{ t("view_only") }}
          </span>
        </template>
      </PageHeader>

      <!-- Composer (teachers / admins) -->
      <v-card
        v-if="!isStudent"
        elevation="0"
        class="panel panel--flush composer fade-in mb-4"
      >
        <div class="composer-row">
          <div class="avatar-chip">
            <v-icon size="20">mdi-bullhorn-outline</v-icon>
          </div>
          <button type="button" class="composer-input" @click="openCreate">
            {{ t("write-announcement") }}
          </button>
        </div>
        <div class="composer-foot">
          <v-btn variant="text" class="composer-cta" @click="openCreate">
            <v-icon start size="18">mdi-image-outline</v-icon>
            {{ t("image") }}
          </v-btn>
          <v-btn
            variant="flat"
            size="small"
            class="modern-action-btn primary composer-post"
            @click="openCreate"
          >
            <v-icon start size="16">mdi-send-outline</v-icon>
            {{ t("post-announcement") }}
          </v-btn>
        </div>
      </v-card>

      <!-- Loading -->
      <div v-if="announcementStore.loading" class="py-10 text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <!-- Empty -->
      <v-card v-else-if="!feed.length" elevation="0" class="panel fade-in">
        <EmptyState
          icon="mdi-bullhorn-outline"
          :title="t('no-announcements-yet')"
          :description="t('announcement-feed-subtitle')"
        />
      </v-card>

      <!-- Feed (social-style posts) -->
      <template v-else>
        <v-card
          v-for="a in feed"
          :key="a.id"
          elevation="0"
          class="panel panel--flush post fade-in mb-4"
        >
          <!-- Post header -->
          <div class="post-head">
            <div class="avatar-chip post-avatar">
              <v-icon size="20">mdi-bullhorn</v-icon>
            </div>
            <div class="min-w-0 flex-grow-1">
              <div class="post-author">{{ t("announcement_author") }}</div>
              <div class="post-meta">
                <v-icon size="12">mdi-clock-outline</v-icon>
                <span>{{ formatDate(a.created_at) }}</span>
                <span class="post-dot"></span>
                <v-icon size="12">mdi-earth</v-icon>
              </div>
            </div>
            <span class="status-pill status-pill--green d-none d-sm-inline-flex">
              <span class="status-dot"></span>
              {{ t("published") }}
            </span>
          </div>

          <!-- Post body -->
          <div class="post-body">
            <h2 v-if="a.title" class="post-title">{{ a.title }}</h2>
            <p class="post-content">{{ a.content }}</p>
          </div>

          <!-- Post image (full width) -->
          <v-img
            v-if="a.image_url"
            :src="mediaUrl(a.image_url)"
            :alt="a.title || t('announcements')"
            cover
            max-height="520"
            class="post-image"
          ></v-img>
        </v-card>
      </template>
    </div>

    <!-- Post dialog (teachers / admins) -->
    <v-dialog v-model="dialog" width="560">
      <v-card class="pa-5 pa-md-6">
        <div class="dialog-head">
          <div class="page-icon">
            <v-icon size="20">mdi-bullhorn-outline</v-icon>
          </div>
          <div class="min-w-0 flex-grow-1">
            <div class="panel-title">{{ t("post-announcement") }}</div>
            <div class="panel-sub">{{ t("announcement-feed-subtitle") }}</div>
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
        <ImagePicker v-model="form.image_url" class="mb-2" />

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
          >
            <v-icon start size="16">mdi-send-outline</v-icon>
            {{ t("post") }}
          </v-btn>
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
/* A single narrow, centred column of posts. */
.feed-column {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
}

/* ---- Composer ---- */
.composer-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}
.composer-input {
  flex: 1 1 auto;
  min-width: 0;
  text-align: left;
  background: #f1f5f9;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 10px 16px;
  color: var(--ds-muted);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.composer-input:hover,
.composer-input:focus-visible {
  background: #e8edf3;
  border-color: #dfe5ec;
  outline: none;
}
.composer-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid var(--ds-border-soft);
}
.composer-cta {
  text-transform: none !important;
  font-weight: 700 !important;
  color: var(--ds-muted) !important;
}
.composer-post {
  height: 34px !important;
}

/* ---- Post card ---- */
.post-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 10px;
}
.post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}
.post-author {
  font-size: 14px;
  font-weight: 800;
  color: var(--ds-text);
  line-height: 1.3;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ds-faint);
}
.post-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #cbd5e1;
  margin: 0 2px;
}
.post-body {
  padding: 0 16px 16px;
}
.post-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ds-text);
  line-height: 1.35;
  margin: 0 0 6px;
}
/* Full post text, preserving line breaks (feed style). */
.post-content {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
  white-space: pre-line;
  word-break: break-word;
}
.post-image {
  background: #f1f5f9;
}
@media (min-width: 600px) {
  .post-head {
    padding: 20px 20px 12px;
  }
  .post-body {
    padding: 0 20px 20px;
  }
  .composer-row {
    padding: 18px 20px;
  }
}

/* Dialog header */
.dialog-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
</style>
