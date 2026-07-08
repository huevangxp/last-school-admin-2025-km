<template>
  <v-text-field
    :model-value="display"
    @update:model-value="onInput"
    @focus="focused = true"
    @blur="focused = false"
    prefix="₭"
    inputmode="decimal"
    v-bind="$attrs"
  ></v-text-field>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { formatMoney } from "@/utils/money";

// A money text field: shows the amount grouped with thousands separators when
// not being edited (e.g. "1,500,000"), plain digits while typing (so the caret
// never jumps), and always emits a plain Number via v-model.
const props = defineProps<{ modelValue: number | string | null | undefined }>();
const emit = defineEmits<{
  (e: "update:modelValue", v: number | string): void;
}>();

const focused = ref(false);
const raw = ref("");

watch(
  () => props.modelValue,
  (v) => {
    if (!focused.value) raw.value = v == null || v === "" ? "" : String(v);
  },
  { immediate: true }
);

const display = computed(() => {
  if (focused.value) return raw.value;
  return raw.value === "" ? "" : formatMoney(raw.value);
});

const onInput = (val: string) => {
  const clean = String(val ?? "").replace(/[^0-9.]/g, "");
  raw.value = clean;
  emit("update:modelValue", clean === "" ? "" : Number(clean));
};
</script>
