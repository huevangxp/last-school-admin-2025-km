<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="teal-lighten-5" size="44" class="mr-3 rounded-lg">
          <v-icon color="teal-darken-1" size="22">mdi-account-supervisor-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ $t("class_organization") }}</div>
          <div class="text-detail">ໂຄງສ້າງຄະນະຮັບຜິດຊອບຫ້ອງຮຽນ · Classroom leadership</div>
        </div>
      </div>
      <v-btn
        variant="flat"
        color="white"
        class="modern-action-btn secondary border"
        height="36"
        to="/class"
      >
        <v-icon icon="mdi-arrow-left" start size="18"></v-icon>
        {{ t("classes") }}
      </v-btn>
    </div>

    <!-- Filters -->
    <v-card elevation="0" class="intelligence-card pa-4 mb-6">
      <div class="d-flex flex-column flex-md-row gap-3">
        <v-select
          v-model="selectedClassId"
          :items="classOptions"
          item-title="label"
          item-value="id"
          :label="t('class')"
          variant="outlined"
          density="compact"
          hide-details
          rounded="lg"
          style="max-width: 280px"
          color="primary"
        ></v-select>
        <v-select
          v-model="selectedYearId"
          :items="yearOptions"
          item-title="title"
          item-value="id"
          :label="t('academic')"
          variant="outlined"
          density="compact"
          hide-details
          rounded="lg"
          style="max-width: 220px"
          color="primary"
        ></v-select>
      </div>
    </v-card>

    <div v-if="!selectedClassId" class="text-detail text-center py-10">
      ກະລຸນາເລືອກຫ້ອງຮຽນ · Select a class to view its organization.
    </div>

    <template v-else>
      <!-- Org Chart — layered by level -->
      <v-card elevation="0" class="intelligence-card pa-4 mb-6">
        <div class="text-title-small mb-2">{{ t("organization") }}</div>
        <div class="org-viewport">
          <div class="lchart">
            <!-- Layer 1 · Teacher -->
            <div class="lband">
              <div class="layer-tag">ຊັ້ນ 1 · ອາຈານປະຈຳຫ້ອງ</div>
              <div class="lrow">
                <div class="lcard lcard-teacher">
                  <div class="lcard-name">{{ homeroomTeacherName || t("homeroom_teacher") }}</div>
                  <div class="lcard-role">ອາຈານປະຈຳຫ້ອງ · HOMEROOM</div>
                </div>
              </div>
            </div>

            <div class="vline"></div>

            <!-- Layer 2 · Monitor -->
            <div class="lband">
              <div class="layer-tag">ຊັ້ນ 2 · ຫົວໜ້າຫ້ອງ</div>
              <div class="lrow">
                <div class="lcard" :class="{ 'lcard-empty': !monitorRow }">
                  <div class="lcard-name">
                    {{ monitorRow ? nameFor(monitorRow.student_id) : "— ຍັງບໍ່ໄດ້ກຳນົດ —" }}
                  </div>
                  <div class="lcard-role">ຫົວໜ້າຫ້ອງ · MONITOR</div>
                </div>
              </div>
            </div>

            <div class="vline"></div>

            <!-- Layer 3 · Committee -->
            <div class="lband">
              <div class="layer-tag">ຊັ້ນ 3 · ຄະນะ</div>
              <div class="lrow">
                <template v-if="committeeRows.length">
                  <div v-for="c in committeeRows" :key="c.id" class="lcard lcard-committee">
                    <div class="lcard-name">{{ nameFor(c.student_id) }}</div>
                    <div class="lcard-role">ຄະນะ · COMMITTEE</div>
                  </div>
                </template>
                <div v-else class="lcard lcard-empty">
                  <div class="lcard-name">— ຍັງບໍ່ໄດ້ກຳນົດ —</div>
                  <div class="lcard-role">ຄະນะ · COMMITTEE</div>
                </div>
              </div>
            </div>

            <div class="vline"></div>

            <!-- Layer 4 · Unit heads  +  Layer 5 · Members (split equally) -->
            <div class="lband">
              <div class="layer-tag">ຊັ້ນ 4 · ຫົວໜ້າໜ່ວຍ &nbsp;·&nbsp; ຊັ້ນ 5 · ສະມາຊິກ</div>
              <div class="units-grid" v-if="unitColumns.length">
                <div v-for="(u, i) in unitColumns" :key="u.id" class="unit-col">
                  <div class="lcard lcard-unit">
                    <div class="lcard-name">{{ u.name }}</div>
                    <div class="lcard-role">ໜ່ວຍ {{ i + 1 }} · UNIT HEAD</div>
                    <div class="unit-count">{{ u.members.length }} ສະມາຊິກ</div>
                  </div>
                  <div class="unit-vline" v-if="u.members.length"></div>
                  <div class="member-list">
                    <div v-for="m in u.members" :key="m.id" class="member-chip">
                      {{ m.label }}
                    </div>
                    <div v-if="!u.members.length" class="member-empty">—</div>
                  </div>
                </div>
              </div>
              <div v-else class="text-detail-tiny text-center py-4">
                ຍັງບໍ່ໄດ້ກຳນົດຫົວໜ້າໜ່ວຍ · No unit heads assigned yet.
              </div>
            </div>
          </div>
        </div>
      </v-card>

      <!-- Assignment panel -->
      <v-card elevation="0" class="intelligence-card pa-6">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="text-title-small">{{ t("assign_roles") }}</div>
          <div class="text-detail-tiny">
            {{ students.length }} {{ t("students") }} · {{ t("homeroom_teacher") }}:
            <strong>{{ homeroomTeacherName || "—" }}</strong>
          </div>
        </div>

        <!-- Monitor -->
        <label class="text-detail-tiny mb-1 d-block">
          ຫົວໜ້າຫ້ອງ · Class Monitor (1)
        </label>
        <v-select
          v-model="form.monitor"
          :items="optionsFor('monitor')"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          clearable
          class="mb-4"
          placeholder="—"
        ></v-select>

        <!-- Committee -->
        <label class="text-detail-tiny mb-1 d-block">
          ຄະນະ · Committee (max 2)
        </label>
        <v-select
          v-model="form.committee"
          :items="optionsFor('committee')"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          multiple
          chips
          closable-chips
          class="mb-4"
          :error="form.committee.length > CAPS.committee"
        ></v-select>

        <!-- Unit heads -->
        <label class="text-detail-tiny mb-1 d-block">
          ຫົວໜ້າໜ່ວຍ · Unit Heads (max 5)
        </label>
        <v-select
          v-model="form.unit_head"
          :items="optionsFor('unit_head')"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          multiple
          chips
          closable-chips
          :error="form.unit_head.length > CAPS.unit_head"
        ></v-select>

        <v-alert
          v-if="saveError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ saveError }}</v-alert
        >
        <v-alert
          v-if="saveOk"
          type="success"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ t("saved") }}</v-alert
        >

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="resetForm" :disabled="saving">
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="saving"
            :disabled="overCap"
            @click="save"
          >
            {{ t("save") }}
          </v-btn>
        </div>
      </v-card>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useEnrollmentStore } from "~/stores/apiEnrollment";
import { useClassRoleStore } from "~/stores/apiClassRole";
import { useTeacherStore } from "~/stores/apiTeacher";

const { t } = useI18n();
const classroomStore = useClassroomStore();
const enrollmentStore = useEnrollmentStore();
const classRoleStore = useClassRoleStore();
const teacherStore = useTeacherStore();

const CAPS = { monitor: 1, committee: 2, unit_head: 5 };

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("classes"), disabled: false, to: "/class" },
  { title: t("class_organization"), disabled: true, to: "/class/organization" },
];

const selectedClassId = ref<string>("");
const selectedYearId = ref<string>("");

onMounted(async () => {
  await Promise.all([
    classroomStore.fetchMyClassrooms(),
    classroomStore.fetchAcademicYears(),
    teacherStore.fetchTeachers(200, 1),
  ]);
  selectedYearId.value = classroomStore.latestAcademicYearId || "";
});

const classOptions = computed(() =>
  classroomStore.myClassrooms.map((c: any) => ({
    id: c.id,
    label: c.classroom_name,
  }))
);
const yearOptions = computed(() => classroomStore.academicYears);

const selectedClass = computed(() =>
  classroomStore.myClassrooms.find((c: any) => c.id === selectedClassId.value)
);

const homeroomTeacherName = computed(() => {
  const tid = selectedClass.value?.homeroom_teacher_id;
  if (!tid) return "";
  const tc = teacherStore.teachers.find((x: any) => x.id === tid);
  return tc?.full_name || tc?.username || "";
});

// Students enrolled in the selected class/year.
const students = computed(() =>
  enrollmentStore.enrollments
    .map((e: any) => e.tb_student)
    .filter(Boolean)
    .map((s: any) => ({
      id: s.id,
      label: `${s.first_name} ${s.last_name}`,
    }))
);

// Load enrollments + existing roles whenever the class/year changes.
const reload = async () => {
  if (!selectedClassId.value || !selectedYearId.value) return;
  await Promise.all([
    enrollmentStore.fetchEnrollments({
      class_id: selectedClassId.value,
      academic_year_id: selectedYearId.value,
      status: "active",
    }),
    classRoleStore.fetchClassRoles({
      classroom_id: selectedClassId.value,
      academic_year_id: selectedYearId.value,
    }),
  ]);
  hydrateForm();
};

watch([selectedClassId, selectedYearId], reload);

// ---- Assignment form ----
const form = ref<{ monitor: string | null; committee: string[]; unit_head: string[] }>(
  { monitor: null, committee: [], unit_head: [] }
);
const saving = ref(false);
const saveError = ref("");
const saveOk = ref(false);

const hydrateForm = () => {
  saveError.value = "";
  saveOk.value = false;
  const monitor = classRoleStore.roles.find((r: any) => r.role === "monitor");
  form.value = {
    monitor: monitor?.student_id || null,
    committee: classRoleStore.roles
      .filter((r: any) => r.role === "committee")
      .map((r: any) => r.student_id),
    unit_head: classRoleStore.roles
      .filter((r: any) => r.role === "unit_head")
      .map((r: any) => r.student_id),
  };
};

const resetForm = () => hydrateForm();

// A student picked in one role shouldn't appear as an option in another.
const pickedElsewhere = (role: string) => {
  const ids = new Set<string>();
  if (role !== "monitor" && form.value.monitor) ids.add(form.value.monitor);
  if (role !== "committee") form.value.committee.forEach((i) => ids.add(i));
  if (role !== "unit_head") form.value.unit_head.forEach((i) => ids.add(i));
  return ids;
};

const optionsFor = (role: string) => {
  const taken = pickedElsewhere(role);
  return students.value.filter((s) => !taken.has(s.id));
};

const overCap = computed(
  () =>
    form.value.committee.length > CAPS.committee ||
    form.value.unit_head.length > CAPS.unit_head
);

const save = async () => {
  saveError.value = "";
  saveOk.value = false;
  if (overCap.value) {
    saveError.value = "Too many members selected for a role.";
    return;
  }
  saving.value = true;
  try {
    // Desired assignments (student -> role).
    const desired: Record<string, "monitor" | "committee" | "unit_head"> = {};
    if (form.value.monitor) desired[form.value.monitor] = "monitor";
    form.value.committee.forEach((id) => (desired[id] = "committee"));
    form.value.unit_head.forEach((id) => (desired[id] = "unit_head"));

    const current: Record<string, { id: string; role: string }> = {};
    classRoleStore.roles.forEach(
      (r: any) => (current[r.student_id] = { id: r.id, role: r.role })
    );

    // Delete rows that changed role or were removed (frees caps before assigning).
    for (const [sid, cur] of Object.entries(current)) {
      if (desired[sid] !== cur.role) {
        await classRoleStore.deleteClassRole(cur.id);
      }
    }
    // Assign the ones that are new or changed.
    for (const [sid, role] of Object.entries(desired)) {
      if (current[sid]?.role !== role) {
        await classRoleStore.assignClassRole({
          classroom_id: selectedClassId.value,
          student_id: sid,
          academic_year_id: selectedYearId.value,
          role,
        });
      }
    }

    await classRoleStore.fetchClassRoles({
      classroom_id: selectedClassId.value,
      academic_year_id: selectedYearId.value,
    });
    hydrateForm();
    saveOk.value = true;
  } catch (error: any) {
    saveError.value = error.response?.data?.message || "Failed to save roles.";
  } finally {
    saving.value = false;
  }
};

// ---- Layered org chart ----
const nameFor = (studentId: string) =>
  students.value.find((s) => s.id === studentId)?.label || "—";

// Rows by role (from the saved assignments).
const monitorRow = computed(() =>
  classRoleStore.roles.find((r: any) => r.role === "monitor")
);
const committeeRows = computed(() =>
  classRoleStore.roles.filter((r: any) => r.role === "committee")
);
const unitRows = computed(() =>
  classRoleStore.roles.filter((r: any) => r.role === "unit_head")
);

// Everyone holding a leadership role — excluded from the "members" pool.
const leaderIds = computed(() => {
  const ids = new Set<string>();
  if (monitorRow.value) ids.add(monitorRow.value.student_id);
  committeeRows.value.forEach((r: any) => ids.add(r.student_id));
  unitRows.value.forEach((r: any) => ids.add(r.student_id));
  return ids;
});

// The plain members: enrolled students who hold no leadership role.
const memberStudents = computed(() =>
  students.value.filter((s) => !leaderIds.value.has(s.id))
);

// Split the members as evenly as possible across the units (round-robin),
// so each ໜ່ວຍ gets an equal share.
const splitEven = <T,>(arr: T[], n: number): T[][] => {
  const groups: T[][] = Array.from({ length: n }, () => []);
  arr.forEach((item, i) => groups[i % n].push(item));
  return groups;
};

// Layer 4 (unit heads) each with their Layer 5 members attached.
const unitColumns = computed(() => {
  const units = unitRows.value;
  if (!units.length) return [] as any[];
  const groups = splitEven(memberStudents.value, units.length);
  return units.map((u: any, i: number) => ({
    id: u.id,
    name: nameFor(u.student_id),
    members: groups[i],
  }));
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
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
.org-viewport {
  position: relative;
  overflow: auto;
  min-height: 320px;
  background: radial-gradient(circle, #e2e8f0 1px, transparent 1px) 0 0 / 22px 22px;
  border-radius: 12px;
}
.tree {
  display: inline-block;
  min-width: 100%;
  padding: 24px 16px;
}
.org-tree-root {
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
