<template>
  <div class="page">
    <PageHeader
      :title="t('gallery')"
      :subtitle="t('gallery-subtitle')"
      icon="mdi-image-multiple-outline"
      :breadcrumbs="breadcrumbs"
    >
      <template v-if="isAdmin" #actions>
        <v-btn variant="flat" class="modern-action-btn primary" @click="openCreate">
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("add") }} {{ t("gallery") }}
        </v-btn>
      </template>
    </PageHeader>

    <v-card elevation="0" class="panel panel--flush fade-in">
      <div class="panel-head">
        <div>
          <div class="panel-title">{{ t("photos") }}</div>
          <div class="panel-sub">{{ t("gallery-subtitle") }}</div>
        </div>
        <span class="panel-chip">
          {{ galleryStore.galleries.length }} {{ t("total") }}
        </span>
      </div>

      <div class="pa-4 pa-md-6">
        <!-- Loading -->
        <div v-if="galleryStore.loading" class="py-10 text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <!-- Empty -->
        <EmptyState
          v-else-if="!galleryStore.galleries.length"
          icon="mdi-image-off-outline"
          :title="t('no-galleries-yet')"
          :description="t('gallery-subtitle')"
        />

        <!-- Gallery grid: 2 cols on phones, 3 on tablets, 4+ on desktop -->
        <div v-else class="gallery-grid">
          <div v-for="g in galleryStore.galleries" :key="g.id" class="gallery-card">
            <div
              class="gallery-cover"
              role="button"
              tabindex="0"
              @click="openView(g)"
              @keydown.enter="openView(g)"
            >
              <v-img
                v-if="g.images?.length"
                :src="mediaUrl(g.images[0].image_url)"
                :alt="g.title || t('gallery')"
                :aspect-ratio="4 / 3"
                cover
                class="gallery-img"
              ></v-img>
              <div v-else class="gallery-noimg">
                <v-icon size="36">mdi-image-off-outline</v-icon>
              </div>

              <span
                class="status-pill gallery-status"
                :class="
                  g.gallery_status === 'active'
                    ? 'status-pill--green'
                    : 'status-pill--grey'
                "
              >
                <span class="status-dot"></span>
                {{ g.gallery_status === "active" ? t("open") : t("closed") }}
              </span>

              <span class="gallery-count">
                <v-icon size="12">mdi-image-multiple</v-icon>
                {{ g.images?.length || 0 }}
              </span>

              <div class="gallery-overlay">
                <span class="gallery-view">
                  <v-icon size="16">mdi-eye-outline</v-icon>
                  {{ t("view") }}
                </span>
              </div>
            </div>

            <div class="gallery-body">
              <div class="min-w-0 flex-grow-1">
                <div class="cell-title text-truncate">{{ g.title }}</div>
                <div class="cell-sub text-truncate">
                  {{ g.description || (g.images?.length || 0) + " " + t("photos") }}
                </div>
              </div>
              <div v-if="isAdmin" class="row-actions">
                <v-btn
                  icon="mdi-pencil-outline"
                  variant="text"
                  size="small"
                  color="primary"
                  @click="openEdit(g)"
                ></v-btn>
                <v-btn
                  icon="mdi-trash-can-outline"
                  variant="text"
                  size="small"
                  color="error"
                  @click="removeGallery(g)"
                ></v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <!-- View lightbox -->
    <v-dialog v-model="viewDialog" width="960">
      <v-card class="pa-5 pa-md-6">
        <div class="dialog-head">
          <div class="page-icon">
            <v-icon size="20">mdi-image-multiple-outline</v-icon>
          </div>
          <div class="min-w-0 flex-grow-1">
            <div class="panel-title text-truncate">{{ viewing?.title }}</div>
            <div v-if="viewing?.description" class="panel-sub">
              {{ viewing?.description }}
            </div>
            <div v-else class="panel-sub">
              {{ viewing?.images?.length || 0 }} {{ t("photos") }}
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="viewDialog = false"
          ></v-btn>
        </div>

        <div v-if="viewing?.images?.length" class="lightbox-grid">
          <v-img
            v-for="(img, i) in viewing?.images || []"
            :key="i"
            :src="mediaUrl(img.image_url)"
            aspect-ratio="1"
            cover
            class="lightbox-img"
            alt=""
          ></v-img>
        </div>
        <EmptyState v-else icon="mdi-image-off-outline" :title="t('no-photos')" />
      </v-card>
    </v-dialog>

    <!-- Create / Edit dialog -->
    <v-dialog v-model="dialog" width="640" persistent>
      <v-card class="pa-5 pa-md-6">
        <div class="dialog-head">
          <div class="page-icon">
            <v-icon size="20">mdi-image-plus-outline</v-icon>
          </div>
          <div class="min-w-0 flex-grow-1">
            <div class="panel-title">
              {{ isEdit ? t("edit") : t("add") }} {{ t("gallery") }}
            </div>
            <div class="panel-sub">{{ t("gallery-subtitle") }}</div>
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
          rows="2"
          hide-details
          class="mb-4"
        ></v-textarea>

        <label class="field-label">{{ t("photos") }}</label>
        <v-file-input
          accept="image/*"
          multiple
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-icon=""
          prepend-inner-icon="mdi-image-plus-outline"
          :label="t('add') + ' ' + t('photos')"
          :loading="uploading"
          @update:model-value="onPickImages"
        ></v-file-input>

        <div v-if="form.images.length" class="thumb-grid mt-3">
          <div v-for="(img, i) in form.images" :key="i" class="thumb">
            <v-img
              :src="mediaUrl(img)"
              :aspect-ratio="4 / 3"
              cover
              class="thumb-img"
              alt=""
            ></v-img>
            <v-btn
              icon
              size="x-small"
              color="error"
              class="thumb-x"
              @click="form.images.splice(i, 1)"
            >
              <v-icon size="14">mdi-close</v-icon>
            </v-btn>
          </div>
        </div>

        <label class="field-label mt-4">{{ t("status") }}</label>
        <v-select
          v-model="form.gallery_status"
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
import { useGalleryStore } from "~/stores/apiGallery";
import { useUiStore } from "~/stores/ui";

const { t } = useI18n();
const galleryStore = useGalleryStore();
const ui = useUiStore();
const { uploadImages } = useUpload();
const { mediaUrl } = useMedia();

const roleCookie = useCookie<string>("role");
const isAdmin = computed(
  () => (roleCookie.value || "").toLowerCase() === "admin"
);

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("gallery"), disabled: true, to: "/gallery" },
];

const statusOptions = [
  { label: t("open"), value: "active" },
  { label: t("closed"), value: "inactive" },
];

onMounted(() => galleryStore.fetchGalleries());

// ---- View ----
const viewDialog = ref(false);
const viewing = ref<any>(null);
const openView = (g: any) => {
  viewing.value = g;
  viewDialog.value = true;
};

// ---- Create / Edit ----
const dialog = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const uploading = ref(false);
const formError = ref("");
const form = ref({
  id: "",
  title: "",
  description: "",
  gallery_status: "active",
  images: [] as string[],
});

const resetForm = () => {
  form.value = {
    id: "",
    title: "",
    description: "",
    gallery_status: "active",
    images: [],
  };
  formError.value = "";
};

const openCreate = () => {
  resetForm();
  isEdit.value = false;
  dialog.value = true;
};

const openEdit = (g: any) => {
  formError.value = "";
  isEdit.value = true;
  form.value = {
    id: g.id,
    title: g.title,
    description: g.description || "",
    gallery_status: g.gallery_status || "active",
    images: (g.images || []).map((im: any) => im.image_url),
  };
  dialog.value = true;
};

const onPickImages = async (files: File | File[] | null) => {
  const list = Array.isArray(files) ? files : files ? [files] : [];
  if (!list.length) return;
  uploading.value = true;
  try {
    const urls = await uploadImages(list);
    form.value.images.push(...urls);
  } catch (e) {
    ui.notify(t("failed-to-upload-images"), "error");
  } finally {
    uploading.value = false;
  }
};

const save = async () => {
  if (!form.value.title) {
    formError.value = t("title") + " *";
    return;
  }
  saving.value = true;
  try {
    const payload = {
      title: form.value.title,
      description: form.value.description || null,
      gallery_status: form.value.gallery_status,
      images: form.value.images,
    };
    if (isEdit.value) {
      await galleryStore.updateGallery(form.value.id, payload);
    } else {
      await galleryStore.createGallery(payload);
    }
    dialog.value = false;
    await galleryStore.fetchGalleries();
  } catch (error: any) {
    formError.value = error.response?.data?.message || t("failed-to-save");
  } finally {
    saving.value = false;
  }
};

const removeGallery = async (g: any) => {
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await galleryStore.deleteGallery(g.id);
    await galleryStore.fetchGalleries();
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify(t("failed-to-delete"), "error");
  }
};
</script>

<style scoped>
/* ---- Responsive gallery grid ---- */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
@media (min-width: 600px) {
  .gallery-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}
@media (min-width: 1280px) {
  .gallery-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (min-width: 1700px) {
  .gallery-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

/* ---- Gallery card ---- */
.gallery-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fff;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.gallery-card:hover {
  transform: translateY(-3px);
  border-color: transparent;
  box-shadow: var(--ds-shadow-hover);
}
.gallery-cover {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background: #f1f5f9;
  outline: none;
}
.gallery-img :deep(.v-img__img) {
  transition: transform 0.35s ease;
}
.gallery-card:hover .gallery-img :deep(.v-img__img),
.gallery-cover:focus-visible .gallery-img :deep(.v-img__img) {
  transform: scale(1.05);
}
.gallery-noimg {
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

/* Hover overlay with a "view" pill */
.gallery-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    to top,
    rgba(10, 49, 84, 0.72),
    rgba(10, 49, 84, 0.18)
  );
  opacity: 0;
  transition: opacity 0.2s ease;
}
.gallery-card:hover .gallery-overlay,
.gallery-cover:focus-visible .gallery-overlay {
  opacity: 1;
}
.gallery-view {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--ds-navy);
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 8px 20px -10px rgba(15, 23, 42, 0.5);
}

/* Image count badge */
.gallery-count {
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  backdrop-filter: blur(4px);
}
/* Status pill over the image */
.gallery-status {
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.94) !important;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.gallery-body {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
}
@media (max-width: 599px) {
  .gallery-body {
    padding: 10px 12px;
  }
  .gallery-body .cell-title {
    font-size: 13px;
  }
}

/* ---- Lightbox grid ---- */
.lightbox-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
@media (min-width: 600px) {
  .lightbox-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 960px) {
  .lightbox-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
}
.lightbox-img {
  border-radius: 12px;
  overflow: hidden;
  background: #f1f5f9;
}

/* ---- Thumbnails in the create / edit form ---- */
.thumb-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.thumb {
  position: relative;
  width: 96px;
}
.thumb-img {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--ds-border);
  background: #f1f5f9;
}
.thumb-x {
  position: absolute;
  top: -8px;
  right: -8px;
}

/* Dialog header */
.dialog-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
</style>
