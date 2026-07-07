<template>
  <div>
    <div v-if="modelValue" class="d-flex align-center ga-3 mb-2">
      <v-img
        :src="mediaUrl(modelValue)"
        width="120"
        height="80"
        cover
        rounded="0"
        class="border"
      ></v-img>
      <v-btn
        size="small"
        variant="text"
        color="error"
        @click="emit('update:modelValue', '')"
      >
        <v-icon start size="16">mdi-close</v-icon>{{ t("remove") }}
      </v-btn>
    </div>
    <v-file-input
      :label="label || t('image')"
      accept="image/*"
      variant="outlined"
      density="compact"
      rounded="0"
      hide-details
      prepend-icon=""
      prepend-inner-icon="mdi-image-outline"
      :loading="loading"
      @update:model-value="onPick"
    ></v-file-input>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue?: string; label?: string }>();
const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();

const { t } = useI18n();
const { uploadImage } = useUpload();
const { mediaUrl } = useMedia();
const loading = ref(false);

const onPick = async (files: File | File[] | null) => {
  const file = Array.isArray(files) ? files[0] : files;
  if (!file) return;
  loading.value = true;
  try {
    const url = await uploadImage(file);
    emit("update:modelValue", url);
  } catch (e) {
    // swallow — the form's own error handling covers save failures
  } finally {
    loading.value = false;
  }
};
</script>
