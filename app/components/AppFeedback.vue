<template>
  <div>
    <!-- Confirm card -->
    <v-dialog v-model="showConfirm" width="420" persistent>
      <v-card rounded="0" class="overflow-hidden feedback-card">
        <div class="text-center pt-8 px-6">
          <v-avatar :color="`${c.color}-lighten-5`" size="76" class="mb-4">
            <v-icon :icon="c.icon" :color="c.color" size="38"></v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-black mb-2">
            {{ c.title || t("are_you_sure") }}
          </h3>
          <p class="text-body-2 text-grey-darken-1 px-2">
            {{ c.message || t("are_you_sure_delete") }}
          </p>
        </div>
        <v-card-actions class="ga-3 px-6 pb-6 pt-4">
          <v-btn
            block
            variant="text"
            color="grey-darken-1"
            class="rounded-0 font-weight-bold"
            height="46"
            @click="ui.resolveConfirm(false)"
          >
            {{ c.cancelText || t("cancel") }}
          </v-btn>
          <v-btn
            block
            variant="flat"
            :color="c.color"
            class="rounded-0 font-weight-bold"
            height="46"
            @click="ui.resolveConfirm(true)"
          >
            {{ c.confirmText || t("confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Toast -->
    <v-snackbar
      v-model="showSnack"
      :color="snackColor"
      location="top right"
      :timeout="3200"
      rounded="0"
      elevation="8"
      class="feedback-snack"
    >
      <div class="d-flex align-center">
        <v-icon :icon="snackIcon" class="mr-3" size="22"></v-icon>
        <span class="font-weight-bold">{{ ui.snackbar.message }}</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUiStore } from "~/stores/ui";

const { t } = useI18n();
const ui = useUiStore();

const c = computed(() => ui.confirmState);

// v-model bridges to the store state (writes go through the resolver on cancel).
const showConfirm = computed({
  get: () => ui.confirmState.show,
  set: (v: boolean) => {
    if (!v) ui.resolveConfirm(false);
  },
});
const showSnack = computed({
  get: () => ui.snackbar.show,
  set: (v: boolean) => (ui.snackbar.show = v),
});

const snackColor = computed(
  () =>
    ({
      success: "teal-darken-1",
      error: "red-darken-1",
      info: "blue-darken-1",
      warning: "amber-darken-2",
    })[ui.snackbar.type] || "teal-darken-1"
);
const snackIcon = computed(
  () =>
    ({
      success: "mdi-check-circle-outline",
      error: "mdi-alert-circle-outline",
      info: "mdi-information-outline",
      warning: "mdi-alert-outline",
    })[ui.snackbar.type] || "mdi-check-circle-outline"
);
</script>

<style scoped>
.feedback-card {
  border: 1px solid #f1f5f9;
  box-shadow:
    0 24px 48px -12px rgba(15, 23, 42, 0.25),
    0 0 0 1px rgba(15, 23, 42, 0.03) !important;
}
.feedback-snack :deep(.v-snackbar__wrapper) {
  min-width: auto;
}
</style>
