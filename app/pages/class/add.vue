<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="primary-lighten-5" size="40" class="mr-3 rounded-lg">
          <v-icon color="primary" size="20">mdi-google-classroom</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-title">Register Section</h2>
          <p class="text-detail">
            Configure new class group and room allocation
          </p>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="save">
        <v-row class="ga-y-2">
          <!-- Class Name -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">CLASS NAME *</label>
            <v-text-field
              v-model="form.className"
              placeholder="e.g. M1/A"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Class Code -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">CLASS CODE *</label>
            <v-text-field
              v-model="form.code"
              placeholder="e.g. M1A-2025"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Grade Level -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">GRADE LEVEL *</label>
            <v-select
              v-model="form.gradeLevelId"
              :items="classroomStore.gradeLevels"
              item-title="grade_level_name"
              item-value="id"
              placeholder="Select grade level"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <!-- Academic Year -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block">ACADEMIC YEAR *</label>
            <v-select
              v-model="form.academicYearId"
              :items="classroomStore.academicYears"
              item-title="title"
              item-value="id"
              placeholder="Select academic year"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <!-- Homeroom Teacher (required) -->
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >HOMEROOM TEACHER *</label
            >
            <v-select
              v-model="form.homeroomTeacherId"
              :items="teacherStore.teachers"
              item-title="full_name"
              item-value="id"
              placeholder="Select homeroom teacher"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <!-- Room -->
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">ROOM NO.</label>
            <v-text-field
              v-model="form.room"
              placeholder="e.g. 101"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <!-- Max students -->
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">MAX STUDENTS</label>
            <v-text-field
              v-model="form.maxStudent"
              type="number"
              placeholder="e.g. 40"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="premium-input"
              color="primary"
              hide-details="auto"
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
            @click="$router.push('/class')"
          >
            Cancel
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="modern-action-btn primary elevation-4"
            height="40"
            type="submit"
            :loading="loading"
          >
            Register Class
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useTeacherStore } from "~/stores/apiTeacher";

const { t } = useI18n();
const router = useRouter();
const classroomStore = useClassroomStore();
const teacherStore = useTeacherStore();
const loading = ref(false);
const errorMessage = ref("");
const formRef = ref();

const form = ref({
  className: "",
  code: "",
  gradeLevelId: null,
  academicYearId: null,
  homeroomTeacherId: null,
  room: "",
  maxStudent: "",
});

onMounted(() => {
  classroomStore.fetchGradeLevels();
  classroomStore.fetchAcademicYears();
  teacherStore.fetchTeachers(100, 1);
});

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("classes"), disabled: false, to: "/class" },
  { title: t("addClass"), disabled: true, to: "/class/add" },
];

const rules = {
  required: (v: any) => !!v || "Field is required",
};

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await classroomStore.createClassroom({
      classroom_name: form.value.className,
      classroom_code: form.value.code,
      grade_level_id: form.value.gradeLevelId,
      academic_year_id: form.value.academicYearId,
      homeroom_teacher_id: form.value.homeroomTeacherId,
      room_number: form.value.room,
      max_student: form.value.maxStudent ? Number(form.value.maxStudent) : null,
    });
    router.push("/class");
  } catch (error: any) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || "Failed to create classroom.";
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

.text-slate-700 {
  color: #334155 !important;
}
</style>
