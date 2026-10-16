<template>
  <div class="page page--narrow">
    <PageHeader
      :title="t('register-subject')"
      :subtitle="t('register-subject-subtitle')"
      icon="mdi-book-open-variant-outline"
      :breadcrumbs="breadcrumbs"
      back="/subjects"
    />

    <v-card elevation="0" class="panel fade-in">
      <v-form ref="formRef" @submit.prevent="save">
        <!-- Subject identity -->
        <div class="form-section">
          <v-icon size="16">mdi-book-open-variant-outline</v-icon>
          {{ t("subject") }}
        </div>
        <v-row>
          <v-col cols="12" md="8">
            <label class="field-label">{{ t("subject-name") }} *</label>
            <v-text-field
              v-model="form.name"
              :placeholder="t('subject-name-placeholder')"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <label class="field-label">{{ t("subject-code") }} *</label>
            <v-text-field
              v-model="form.code"
              placeholder="MATH-101"
              variant="outlined"
              density="comfortable"
              class="uppercase-text"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Grade levels & weighting -->
        <div class="form-section mt-6">
          <v-icon size="16">mdi-stairs</v-icon>
          {{ t("grade-levels") }}
        </div>
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex align-center justify-space-between flex-wrap ga-2">
              <label class="field-label mb-0">{{ t("grade-levels") }} *</label>
              <div class="d-flex align-center ga-2 mb-1">
                <button type="button" class="link-btn" @click="selectAllGrades">
                  {{ t("select-all") }}
                </button>
                <span class="text-medium-emphasis">·</span>
                <button type="button" class="link-btn" @click="clearGrades">
                  {{ t("clear") }}
                </button>
              </div>
            </div>
            <v-select
              v-model="form.gradeIds"
              :items="classroomStore.gradeLevels"
              item-title="grade_level_name"
              item-value="id"
              multiple
              chips
              closable-chips
              :placeholder="t('grade-levels-placeholder')"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :rules="[rules.requiredMany]"
            ></v-select>
            <div class="field-hint">{{ t("grade-levels-hint") }}</div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="field-label">{{ t("coefficient") }} *</label>
            <v-text-field
              v-model="form.coefficient"
              type="number"
              placeholder="2"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-4"
        >
          {{ errorMessage }}
        </v-alert>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="$router.push('/subjects')"
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            type="submit"
            :loading="loading"
          >
            <v-icon icon="mdi-check" start size="18"></v-icon>
            {{ t("save") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSubjectStore } from "~/stores/apiSubject";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useUiStore } from "~/stores/ui";

const { t } = useI18n();
const router = useRouter();
const subjectStore = useSubjectStore();
const classroomStore = useClassroomStore();
const ui = useUiStore();
const formRef = ref();
const loading = ref(false);
const errorMessage = ref("");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("subjects"), disabled: false, to: "/subjects" },
  { title: t("add"), disabled: true, to: "" },
];

onMounted(() => {
  classroomStore.fetchGradeLevels();
});

const form = ref({
  name: "",
  code: "",
  gradeIds: [] as string[],
  coefficient: "",
});

const rules = {
  required: (v: any) => !!v || t("required"),
  requiredMany: (v: any) => (Array.isArray(v) && v.length > 0) || t("required"),
};

const selectAllGrades = () => {
  form.value.gradeIds = classroomStore.gradeLevels.map((g: any) => g.id);
};
const clearGrades = () => {
  form.value.gradeIds = [];
};

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const res = await subjectStore.createSubject({
      // Base id/code — the backend suffixes them per grade to stay unique.
      subject_id: `SUBJ-${form.value.code}`,
      subject_name: form.value.name,
      subject_code: form.value.code,
      coefficient: Number(form.value.coefficient),
      grade_ids: form.value.gradeIds,
      subject_status: "active",
    });
    // Warn if some grades were skipped because the title already existed.
    const skipped = res?.data?.skipped?.length ?? 0;
    if (skipped > 0) {
      ui.notify(
        t("subjects-created-skipped", {
          created: res.data.created.length,
          skipped,
        }),
        "warning"
      );
    } else {
      ui.notify(t("saved-successfully"), "success");
    }
    router.push("/subjects");
  } catch (error: any) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || t("failed-to-create-subject");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Subject codes are always shown upper-case while typing */
.uppercase-text :deep(input) {
  text-transform: uppercase;
}
</style>
