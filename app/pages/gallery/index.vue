<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="pink-lighten-5" size="44" class="mr-3 rounded-0">
          <v-icon color="pink-darken-2" size="22">mdi-image-multiple-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ t("gallery") }}</div>
          <div class="text-detail">
            {{ t("gallery-subtitle") }}
          </div>
        </div>
      </div>
      <v-btn
        v-if="isAdmin"
        color="primary"
        class="modern-action-btn primary elevation-4"
        height="36"
        @click="openCreate"
      >
        <v-icon icon="mdi-plus" start size="18"></v-icon>
        {{ t("add") }} {{ t("gallery") }}
      </v-btn>
    </div>

    <div v-if="galleryStore.loading" class="py-10 text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <v-card
      v-else-if="!galleryStore.galleries.length"
      elevation="0"
      class="intelligence-card pa-10 text-center text-detail"
    >
      {{ t("no-galleries-yet") }}
    </v-card>

    <!-- Gallery cards -->
    <v-row v-else class="ga-y-2">
      <v-col
        v-for="g in galleryStore.galleries"
        :key="g.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card elevation="0" class="intelligence-card overflow-hidden h-100">
          <div class="cover" @click="openView(g)">
            <v-img
              v-if="g.images?.length"
              :src="mediaUrl(g.images[0].image_url)"
              height="180"
              cover
            ></v-img>
            <div v-else class="no-cover d-flex align-center justify-center">
              <v-icon size="40" color="grey-lighten-1">mdi-image-off-outline</v-icon>
            </div>
            <v-chip
              size="x-small"
              variant="flat"
              class="count-chip font-weight-bold"
            >
              <v-icon start size="12">mdi-image-multiple</v-icon>
              {{ g.images?.length || 0 }}
            </v-chip>
          </div>
          <div class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div class="text-title-small text-truncate">{{ g.title }}</div>
              <v-chip
                size="x-small"
                variant="flat"
                :color="
                  g.gallery_status === 'active' ? 'success' : 'grey-lighten-2'
                "
                class="font-weight-black text-uppercase"
              >
                {{ g.gallery_status === "active" ? t("open") : t("closed") }}
              </v-chip>
            </div>
            <div v-if="g.description" class="text-detail-tiny mt-1 text-truncate">
              {{ g.description }}
            </div>
            <div v-if="isAdmin" class="d-flex justify-end ga-1 mt-2">
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="x-small"
                color="primary"
                @click="openEdit(g)"
              ></v-btn>
              <v-btn
                icon="mdi-trash-can-outline"
                variant="text"
                size="x-small"
                color="error"
                @click="removeGallery(g)"
              ></v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- View lightbox -->
    <v-dialog v-model="viewDialog" width="900">
      <v-card class="pa-6">
        <div class="d-flex align-center justify-space-between mb-4">
          <div>
            <div class="text-title">{{ viewing?.title }}</div>
            <div v-if="viewing?.description" class="text-detail">
              {{ viewing?.description }}
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="viewDialog = false"
          ></v-btn>
        </div>
        <v-row class="ga-y-2">
          <v-col
            v-for="(img, i) in viewing?.images || []"
            :key="i"
            cols="6"
            sm="4"
            md="3"
          >
            <v-img
              :src="mediaUrl(img.image_url)"
              aspect-ratio="1"
              cover
              class="border"
            ></v-img>
          </v-col>
        </v-row>
        <div
          v-if="!viewing?.images?.length"
          class="text-detail text-center py-8"
        >
          {{ t("no-photos") }}
        </div>
      </v-card>
    </v-dialog>

    <!-- Create / Edit dialog -->
    <v-dialog v-model="dialog" width="640" persistent>
      <v-card class="pa-6">
        <div class="text-title mb-4">
          {{ isEdit ? t("edit") : t("add") }} {{ t("gallery") }}
        </div>

        <label class="text-detail-tiny mb-1 d-block">{{ t("title") }}</label>
        <v-text-field
          v-model="form.title"
          variant="outlined"
          density="compact"
          hide-details
          class="mb-3"
        ></v-text-field>

        <label class="text-detail-tiny mb-1 d-block">{{ t("description") }}</label>
        <v-textarea
          v-model="form.description"
          variant="outlined"
          density="compact"
          rows="2"
          hide-details
          class="mb-3"
        ></v-textarea>

        <label class="text-detail-tiny mb-1 d-block">{{ t("photos") }}</label>
        <v-file-input
          accept="image/*"
          multiple
          variant="outlined"
          density="compact"
          hide-details
          prepend-icon=""
          prepend-inner-icon="mdi-image-plus-outline"
          :label="t('add') + ' ' + t('photos')"
          :loading="uploading"
          @update:model-value="onPickImages"
        ></v-file-input>

        <div v-if="form.images.length" class="d-flex flex-wrap ga-2 mt-3">
          <div v-for="(img, i) in form.images" :key="i" class="thumb">
            <v-img :src="mediaUrl(img)" width="88" height="66" cover></v-img>
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

        <label class="text-detail-tiny mb-1 mt-4 d-block">{{ t("status") }}</label>
        <v-select
          v-model="form.gallery_status"
          :items="statusOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
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
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}
.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}
.cover {
  position: relative;
  cursor: pointer;
}
.no-cover {
  height: 180px;
  background: #f8fafc;
}
.count-chip {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: rgba(15, 23, 42, 0.7) !important;
  color: #fff !important;
}
.thumb {
  position: relative;
}
.thumb-x {
  position: absolute;
  top: -8px;
  right: -8px;
}
.modern-action-btn {
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 12px !important;
}
.modern-action-btn.primary {
  background: linear-gradient(135deg, #0A3154 0%, #082741 100%) !important;
  color: white !important;
}
</style>
