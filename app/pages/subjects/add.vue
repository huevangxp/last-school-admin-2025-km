<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="indigo-lighten-5" size="40" class="mr-3 rounded-lg">
          <v-icon color="indigo-darken-2" size="20"
            >mdi-book-open-variant-outline</v-icon
          >
        </v-avatar>
        <div>
          <h2 class="text-title">Register Subject</h2>
          <p class="text-detail">Define new curricular course details</p>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="save">
        <v-row class="ga-y-2">
          <!-- Subject Name -->
          <v-col cols="12" md="8">
            <label class="text-detail-tiny mb-2 d-block">SUBJECT NAME *</label>
            <v-text-field
              v-model="form.name"
              placeholder="e.g. ຄະນິດສາດ"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Subject Code -->
          <v-col cols="12" md="4">
            <label class="text-detail-tiny mb-2 d-block">SUBJECT CODE *</label>
            <v-text-field
              v-model="form.code"
              placeholder="MATH-101"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input uppercase-text"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Grade Levels (multi-select) -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-detail-tiny d-block">GRADE LEVELS *</label>
              <div class="d-flex ga-2">
                <button
                  type="button"
                  class="link-btn"
                  @click="selectAllGrades"
                >
                  ເລືອກທັງໝົດ
                </button>
                <span class="text-grey-lighten-1">·</span>
                <button type="button" class="link-btn" @click="clearGrades">
                  ລ້າງ
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
              placeholder="ເລືອກຊັ້ນຮຽນທີ່ຕ້ອງມີວິຊານີ້ (ມ.1 - ມ.7)"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.requiredMany]"
            ></v-select>
            <div class="text-detail-tiny text-grey mt-1">
              ວິຊານີ້ຈະຖືກສ້າງໃຫ້ແຕ່ລະຊັ້ນທີ່ເລືອກ. ຊັ້ນທີ່ບໍ່ຕ້ອງການ ບໍ່ຕ້ອງເລືອກ.
            </div>
          </v-col>

          <!-- Coefficient -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">COEFFICIENT *</label>
            <v-text-field
              v-model="form.coefficient"
              type="number"
              placeholder="e.g. 2"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
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

const { t } = useI18n();
const router = useRouter();
const subjectStore = useSubjectStore();
const classroomStore = useClassroomStore();
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
  gradeId: null,
  coefficient: "",
});

const rules = {
  required: (v: any) => !!v || t("required"),
};

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await subjectStore.createSubject({
      // subject_id is required by the backend but not auto-generated there.
      subject_id: `SUBJ-${form.value.code}`,
      subject_name: form.value.name,
      subject_code: form.value.code,
      coefficient: Number(form.value.coefficient),
      grade_id: form.value.gradeId,
      subject_status: "active",
    });
    router.push("/subjects");
  } catch (error: any) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || "Failed to create subject.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 900px;
  margin: 0 auto;
}

.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}

.modern-action-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  padding: 0 16px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}

.premium-input :deep(.v-field__outline__start),
.premium-input :deep(.v-field__outline__end),
.premium-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.premium-input :deep(.v-field--focused .v-field__outline__start),
.premium-input :deep(.v-field--focused .v-field__outline__end),
.premium-input :deep(.v-field--focused .v-field__outline__notch) {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 1.5px !important;
}

.uppercase-text :deep(input) {
  text-transform: uppercase;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
