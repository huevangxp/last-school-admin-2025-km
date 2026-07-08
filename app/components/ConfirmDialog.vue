<template>
  <v-dialog
    :model-value="modelValue"
    width="420"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="0" class="pa-4 overflow-hidden">
      <div class="text-center py-6">
        <v-avatar :color="`${color}-lighten-5`" size="72" class="mb-4">
          <v-icon :icon="icon" :color="color" size="36"></v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-black mb-2">
          {{ title || t("are_you_sure") }}
        </h3>
        <p class="text-body-2 text-grey-darken-1 px-6">{{ message }}</p>
      </div>
      <v-card-actions class="ga-3 px-4 pb-4">
        <v-btn
          block
          variant="flat"
          :color="color"
          class="rounded-0 font-weight-bold"
          height="44"
          :loading="loading"
          @click="$emit('confirm')"
        >
          {{ confirmText || t("confirm") }}
        </v-btn>
        <v-btn
          block
          variant="text"
          color="grey-darken-1"
          class="rounded-0 font-weight-bold"
          height="44"
          :disabled="loading"
          @click="$emit('update:modelValue', false)"
        >
          {{ cancelText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const { t } = useI18n();
withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    color?: string;
    icon?: string;
    loading?: boolean;
  }>(),
  {
    title: () => t("are_you_sure"),
    message: "",
    confirmText: () => t("confirm"),
    cancelText: () => t("cancel"),
    color: "error",
    icon: "mdi-alert-circle-outline",
    loading: false,
  }
);

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
}>();
</script>
