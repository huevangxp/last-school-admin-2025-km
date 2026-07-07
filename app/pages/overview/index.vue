<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header + Academic Year selector -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <div class="text-title mb-1">{{ t("overview") }}</div>
        <div class="text-detail">
          Select an academic year to see its students, teachers and classes.
        </div>
      </div>

      <div style="min-width: 260px" class="mt-4 mt-md-0">
        <v-select
          v-model="yearId"
          :items="years"
          item-title="title"
          item-value="id"
          :placeholder="t('academic_title')"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          prepend-inner-icon="mdi-calendar-check"
          class="cream-input"
        ></v-select>
      </div>
    </div>

    <!-- Summary stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in stats" :key="i">
        <v-card class="metric-card pa-4 h-100" elevation="0">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-detail-tiny mb-1">{{ stat.label }}</p>
              <h2 class="text-title" style="font-size: 20px !important">
                {{ stat.value }}
              </h2>
            </div>
            <v-avatar
              :color="`${stat.color}-lighten-5`"
              rounded="lg"
              size="42"
              class="metric-icon-box"
            >
              <v-icon :color="`${stat.color}-darken-2`" size="20">{{
                stat.icon
              }}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Classrooms breakdown -->
    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="text-title mb-4">
        {{ t("classes") }} — {{ selectedYearTitle || "—" }}
      </div>

      <div v-if="!yearId" class="text-detail py-10 text-center">
        Please select an academic year above.
      </div>
      <div v-else-if="loading" class="text-detail py-10 text-center">
        Loading…
      </div>
      <div v-else-if="!rows.length" class="text-detail py-10 text-center">
        No classrooms found for this academic year.
      </div>

      <v-table v-else class="overview-table">
        <thead>
          <tr>
            <th class="text-detail-tiny">{{ t("classes") }}</th>
            <th class="text-detail-tiny">{{ t("grade") }}</th>
            <th class="text-detail-tiny">{{ t("homeroom_teacher") }}</th>
            <th class="text-detail-tiny text-right">{{ t("students") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>
              <div class="d-flex align-center py-2">
                <v-avatar
                  color="blue-lighten-5"
                  size="32"
                  class="mr-3"
                  rounded="lg"
                >
                  <v-icon
                    icon="mdi-google-classroom"
                    size="16"
                    color="blue-darken-2"
                  ></v-icon>
                </v-avatar>
                <div>
                  <div class="text-title-small">{{ row.name }}</div>
                  <div class="text-detail-tiny">{{ row.code }}</div>
                </div>
              </div>
            </td>
            <td class="text-detail">{{ row.grade }}</td>
            <td>
              <div class="d-flex align-center">
                <v-icon
                  size="16"
                  color="teal-darken-1"
                  class="mr-2"
                  icon="mdi-account-tie-outline"
                ></v-icon>
                <span class="text-detail font-weight-bold">{{
                  row.teacher
                }}</span>
              </div>
            </td>
            <td class="text-right">
              <v-chip
                size="small"
                color="primary-lighten-5"
                class="text-primary font-weight-black"
                variant="flat"
              >
                {{ row.students }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

const { t } = useI18n();

const years = ref<any[]>([]);
const yearId = ref<string | null>(null);
const classrooms = ref<any[]>([]);
const enrollments = ref<any[]>([]);
const totalTeachers = ref(0);
const loading = ref(false);

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("overview"), disabled: true, to: "/overview" },
];

const { $axios } = useNuxtApp();

onMounted(async () => {
  try {
    const [yRes, tRes] = await Promise.all([
      $axios.get("/get-all-academic-year"),
      $axios.get("/get-all-teachers?limit=1"),
    ]);
    years.value = yRes.data?.data ?? [];
    totalTeachers.value = tRes.data?.data?.pagination?.total ?? 0;
    // Default to the latest academic year (active first, else newest start).
    if (years.value.length) {
      const latest = [...years.value].sort((a: any, b: any) => {
        const act = (b.status === "active" ? 1 : 0) - (a.status === "active" ? 1 : 0);
        if (act !== 0) return act;
        return (
          new Date(b.start_date || 0).getTime() -
          new Date(a.start_date || 0).getTime()
        );
      })[0];
      yearId.value = latest.id;
    }
  } catch (error) {
    console.error(error);
  }
});

const loadYear = async () => {
  if (!yearId.value) return;
  loading.value = true;
  try {
    const [cRes, eRes] = await Promise.all([
      $axios.get(
        `/get-all-classrooms?academic_year_id=${yearId.value}&limit=100`
      ),
      $axios.get(
        `/enrollments?academic_year_id=${yearId.value}&status=active`
      ),
    ]);
    classrooms.value = cRes.data?.data?.classrooms ?? [];
    enrollments.value = eRes.data?.data ?? [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

watch(yearId, loadYear);

const selectedYearTitle = computed(
  () => years.value.find((y) => y.id === yearId.value)?.title || ""
);

// Count of active enrolled students per classroom.
const countByClass = computed(() => {
  const map: Record<string, number> = {};
  for (const e of enrollments.value) {
    map[e.class_id] = (map[e.class_id] || 0) + 1;
  }
  return map;
});

const rows = computed(() =>
  classrooms.value.map((c) => ({
    id: c.id,
    name: c.classroom_name,
    code: c.classroom_code,
    grade: c.gradeLevel?.grade_level_name || "—",
    teacher: c.homeroomTeacher?.full_name || "Unassigned",
    students: countByClass.value[c.id] || 0,
  }))
);

const homeroomTeacherCount = computed(
  () =>
    new Set(
      classrooms.value.map((c) => c.homeroom_teacher_id).filter(Boolean)
    ).size
);

const stats = computed(() => [
  {
    label: t("students"),
    value: String(enrollments.value.length),
    icon: "mdi-account-school-outline",
    color: "blue",
  },
  {
    label: t("classes"),
    value: String(classrooms.value.length),
    icon: "mdi-google-classroom",
    color: "green",
  },
  {
    label: t("homeroom_teacher"),
    value: String(homeroomTeacherCount.value),
    icon: "mdi-account-tie-outline",
    color: "purple",
  },
  {
    label: t("teachers"),
    value: String(totalTeachers.value),
    icon: "mdi-account-group",
    color: "orange",
  },
]);
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}
.metric-card {
  border-radius: 10px !important;
  background: white;
  border: 1px solid #f1f5f9;
}
.metric-icon-box {
  border-radius: 10px;
}
.intelligence-card {
  border-radius: 10px !important;
  background: white;
  border: 1px solid #f1f5f9;
}
.overview-table :deep(th) {
  background-color: #f8fafc !important;
  border-bottom: 1px solid #f1f5f9 !important;
}
.overview-table :deep(td) {
  border-bottom: 1px solid #f1f5f9 !important;
}
.text-right {
  text-align: right;
}
.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}
</style>
