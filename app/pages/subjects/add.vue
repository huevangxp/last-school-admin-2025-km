<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="indigo-lighten-5" size="40" class="mr-3 rounded-0">
          <v-icon color="indigo-darken-2" size="20"
            >mdi-book-open-variant-outline</v-icon
          >
        </v-avatar>
        <div>
          <h2 class="text-title">{{ $t("register-subject") }}</h2>
          <p class="text-detail">{{ $t("register-subject-subtitle") }}</p>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="save">
        <v-row class="ga-y-2">
          <!-- Subject Name -->
          <v-col cols="12" md="8">
            <label class="text-detail-tiny mb-2 d-block">{{ $t("subject-name") }} *</label>
            <v-text-field
              v-model="form.name"
              :placeholder="$t('subject-name-placeholder')"
              variant="outlined"
              density="compact"
              rounded="0"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Subject Code -->
          <v-col cols="12" md="4">
            <label class="text-detail-tiny mb-2 d-block">{{ $t("subject-code") }} *</label>
            <v-text-field
              v-model="form.code"
              placeholder="MATH-101"
              variant="outlined"
              density="compact"
              rounded="0"
              class="uppercase-text"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Grade Levels (multi-select) -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-detail-tiny d-block">{{ $t("grade-levels") }} *</label>
              <div class="d-flex ga-2">
                <button
                  type="button"
                  class="link-btn"
                  @click="selectAllGrades"
                >
                  {{ $t("select-all") }}
                </button>
                <span class="text-grey-lighten-1">·</span>
                <button type="button" class="link-btn" @click="clearGrades">
                  {{ $t("clear") }}
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
              :placeholder="$t('grade-levels-placeholder')"
              variant="outlined"
              density="compact"
              rounded="0"
              color="primary"
              hide-details="auto"
              :rules="[rules.requiredMany]"
            ></v-select>
            <div class="text-detail-tiny text-grey mt-1">
              {{ $t("grade-levels-hint") }}
            </div>
          </v-col>

          <!-- Coefficient -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">{{ $t("coefficient") }} *</label>
            <v-text-field
              v-model="form.coefficient"
              type="number"
              placeholder="e.g. 2"
              variant="outlined"
              density="compact"
              rounded="0"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" v-if="errorMessage">
            <v-alert type="error" variant="tonal" density="compact">{{
              errorMessage
            }}</v-alert>
          </v-col>
        </v-row>

        <div class="d-flex justify-end ga-3 pt-8">
          <v-btn
            variant="flat"
            color="grey-lighten-4"
            class="modern-action-btn secondary border text-slate-700"
            height="40"
            @click="$router.push('/subjects')"
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="modern-action-btn primary elevation-4"
            height="40"
            type="submit"
            :loading="loading"
          >
            {{ t("save") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
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
  font-size: 13px !important;
  padding: 0 16px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}

.uppercase-text :deep(input) {
  text-transform: uppercase;
}

.text-slate-700 {
  color: #334155 !important;
}

.link-btn {
  font-size: 11px;
  font-weight: 800;
  color: #0d9488;
  background: transparent;
  cursor: pointer;
}
.link-btn:hover {
  text-decoration: underline;
}
</style>
