<template>
  <v-dialog v-model="isOpen" width="auto">
    <v-card class="rounded overflow-hidden" elevation="0">
      <v-date-picker
        v-model="selectedDate"
        color="primary"
        :title="title || $t('select_date')"
        :header="title || $t('select_date')"
        show-adjacent-months
        elevation="0"
      >
        <template v-slot:actions>
          <div class="d-flex justify-end w-100 pa-2 gap-2">
            <v-btn variant="text" color="grey-darken-1" @click="close">{{
              $t("cancel")
            }}</v-btn>
            <v-btn color="primary" variant="flat" @click="save">{{
              $t("save")
            }}</v-btn>
          </div>
        </template>
      </v-date-picker>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  date: {
    type: [String, Date, Number],
    default: null,
  },
  title: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "update:date", "save", "close"]);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const selectedDate = ref<Date | null>(null);

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (props.date) {
        selectedDate.value = new Date(props.date);
      } else {
        selectedDate.value = new Date();
      }
    }
  },
  { immediate: true }
);

const close = () => {
  isOpen.value = false;
  emit("close");
};

const save = () => {
  if (selectedDate.value) {
    // Format date to YYYY-MM-DD for consistency
    const formattedDate = selectedDate.value.toISOString().substr(0, 10);
    emit("update:date", formattedDate);
    emit("save", formattedDate);
  }
  isOpen.value = false;
};
</script>

<style scoped>
:deep(.v-date-picker-header) {
  display: none; /* Hide default header if we want custom or if title prop handles it */
}
</style>
