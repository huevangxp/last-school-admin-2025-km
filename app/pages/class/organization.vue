<template>
  <v-container fluid class="pa-4 pa-md-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="teal-lighten-5" size="44" class="mr-3 rounded-0">
          <v-icon color="teal-darken-1" size="22">mdi-account-supervisor-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ $t("class_organization") }}</div>
          <div class="text-detail">{{ t("class-leadership-desc") }}</div>
        </div>
      </div>
      <!-- Write actions (back to class list, assign roles) are hidden from the
           read-only student role; students only view the org chart below. -->
      <div v-if="!isStudent" class="d-flex gap-2 align-center mt-4 mt-md-0">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border flex-grow-1 flex-md-grow-0"
          height="36"
          to="/class"
        >
          <v-icon icon="mdi-arrow-left" start size="18"></v-icon>
          {{ t("classes") }}
        </v-btn>
        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4 flex-grow-1 flex-md-grow-0"
          height="36"
          :disabled="!selectedClassId"
          @click="openManage"
        >
          <v-icon icon="mdi-account-cog-outline" start size="18"></v-icon>
          {{ t("assign_roles") }}
        </v-btn>
      </div>
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
          rounded="0"
          style="max-width: 280px"
          class="filter-select"
          color="primary"
          :disabled="isStudent"
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
          rounded="0"
          style="max-width: 220px"
          class="filter-select"
          color="primary"
        ></v-select>
      </div>
    </v-card>

    <div v-if="!selectedClassId" class="text-detail text-center py-10">
      {{ t("select-class-hint") }}
    </div>

    <template v-else>
      <!-- Org Chart — layered by level -->
      <v-card elevation="0" class="intelligence-card pa-4 mb-6">
        <div class="text-title-small mb-2">{{ t("organization") }}</div>
        <div class="org-viewport">
          <div class="lchart">
            <!-- Layer 1 · Teacher -->
            <div class="lband">
              <div class="layer-tag">{{ t("layer1-homeroom") }}</div>
              <div class="lrow">
                <div class="lcard lcard-teacher">
                  <div class="lcard-name">{{ homeroomTeacherName || t("homeroom_teacher") }}</div>
                  <div class="lcard-role">{{ t("homeroom-role") }}</div>
                </div>
              </div>
            </div>

            <div class="vline"></div>

            <!-- Layer 2 · Monitor -->
            <div class="lband">
              <div class="layer-tag">{{ t("layer2-monitor") }}</div>
              <div class="lrow">
                <div class="lcard" :class="{ 'lcard-empty': !monitorRow }">
                  <div class="lcard-name">
                    {{ monitorRow ? nameFor(monitorRow.student_id) : t("not-assigned") }}
                  </div>
                  <div class="lcard-role">{{ t("monitor-role") }}</div>
                </div>
              </div>
            </div>

            <div class="vline"></div>

            <!-- Layer 3 · Committee -->
            <div class="lband">
              <div class="layer-tag">{{ t("layer3-committee") }}</div>
              <div class="lrow">
                <template v-if="committeeRows.length">
                  <div v-for="c in committeeRows" :key="c.id" class="lcard lcard-committee">
                    <div class="lcard-name">{{ nameFor(c.student_id) }}</div>
                    <div class="lcard-role">{{ t("committee-role") }}</div>
                  </div>
                </template>
                <div v-else class="lcard lcard-empty">
                  <div class="lcard-name">{{ t("not-assigned") }}</div>
                  <div class="lcard-role">{{ t("committee-role") }}</div>
                </div>
              </div>
            </div>

            <div class="vline"></div>

            <!-- Layer 4 · Unit heads  +  Layer 5 · Members (split equally) -->
            <div class="lband">
              <div class="layer-tag">{{ t("layer4-5-tag") }}</div>
              <div class="units-grid" v-if="unitColumns.length">
                <div v-for="(u, i) in unitColumns" :key="u.id" class="unit-col">
                  <div class="lcard lcard-unit">
                    <div class="lcard-name">{{ u.name }}</div>
                    <div class="lcard-role">{{ t("unit-head-role", { n: i + 1 }) }}</div>
                    <div class="unit-count">{{ t("n-members", { n: u.members.length }) }}</div>
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
                {{ t("no-unit-heads") }}
              </div>
            </div>
          </div>
        </div>
      </v-card>

      <!-- Assignment panel (dialog) -->
      <v-dialog v-model="manageDialog" width="560" scrollable>
        <v-card rounded="0" class="pa-6">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="text-title-small">{{ t("assign_roles") }}</div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="manageDialog = false"
          ></v-btn>
        </div>
        <div class="text-detail-tiny mb-4">
          {{ selectedClass?.classroom_name }} · {{ students.length }}
          {{ t("students") }} · {{ t("homeroom_teacher") }}:
          <strong>{{ homeroomTeacherName || "—" }}</strong>
        </div>

        <!-- Monitor -->
        <label class="text-detail-tiny mb-1 d-block">
          {{ t("monitor-label") }}
        </label>
        <v-select
          v-model="form.monitor"
          :items="optionsFor('monitor')"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="0"
          hide-details
          clearable
          class="mb-4"
          placeholder="—"
        ></v-select>

        <!-- Committee -->
        <label class="text-detail-tiny mb-1 d-block">
          {{ t("committee-label") }}
        </label>
        <v-select
          v-model="form.committee"
          :items="optionsFor('committee')"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="0"
          hide-details
          multiple
          chips
          closable-chips
          class="mb-4"
          :error="form.committee.length > CAPS.committee"
        ></v-select>

        <!-- Unit heads -->
        <label class="text-detail-tiny mb-1 d-block">
          {{ t("unit-heads-label") }}
        </label>
        <v-select
          v-model="form.unit_head"
          :items="optionsFor('unit_head')"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="0"
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
      </v-dialog>
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

// Students view the class org chart read-only — no role-assignment actions.
const roleCookie = useCookie<string>("role");
const isStudent = computed(
  () => (roleCookie.value || "").toLowerCase() === "student"
);
const isAdmin = computed(() =>
  ["admin", "administrator"].includes((roleCookie.value || "").toLowerCase())
);

const CAPS = { monitor: 1, committee: 2, unit_head: 5 };

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("classes"), disabled: false, to: "/class" },
  { title: t("class_organization"), disabled: true, to: "/class/organization" },
];

const selectedClassId = ref<string>("");
const selectedYearId = ref<string>("");

// Role-management popup (opened from the top button).
const manageDialog = ref(false);
const openManage = () => {
  hydrateForm();
  manageDialog.value = true;
};

onMounted(async () => {
  await Promise.all([
    classroomStore.fetchMyClassrooms(),
    classroomStore.fetchAcademicYears(),
    teacherStore.fetchTeachers(200, 1),
  ]);
  selectedYearId.value = classroomStore.latestAcademicYearId || "";
  // Student/teacher see only their own class(es) (backend-scoped via
  // /my-classrooms), so default to the first one and show its chart right away.
  // Admins keep the "pick a class" prompt since they can see every class.
  if (!isAdmin.value) {
    selectedClassId.value = classOptions.value[0]?.id || "";
  }
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
    saveError.value = t("too-many-members");
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
    manageDialog.value = false; // close popup to reveal the updated chart
  } catch (error: any) {
    saveError.value = error.response?.data?.message || t("failed-save-roles");
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
  arr.forEach((item, i) => {
    (groups[i % n] as T[]).push(item);
  });
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
    members: groups[i] ?? [],
  }));
});
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
.org-viewport {
  position: relative;
  overflow: auto;
  min-height: 320px;
  background: radial-gradient(circle, #e2e8f0 1px, transparent 1px) 0 0 / 22px 22px;
}

/* Layered chart */
.lchart {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100%;
  padding: 24px 16px;
}
.lband {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.layer-tag {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #0d9488;
  background: #ccfbf1;
  padding: 2px 12px;
  margin-bottom: 10px;
}
.lrow {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}
.vline {
  width: 2px;
  height: 28px;
  background: #cbd5e1;
}
.lcard {
  min-width: 150px;
  max-width: 200px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  text-align: center;
  box-shadow: 0 4px 14px -8px rgba(15, 23, 42, 0.18);
}
.lcard-name {
  font-weight: 800;
  font-size: 13px;
  color: #0f172a;
  line-height: 1.25;
}
.lcard-role {
  font-size: 9.5px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  margin-top: 2px;
}
.lcard-teacher {
  background: linear-gradient(135deg, #14b8a5 0%, #0d9488 100%);
  border: 0;
}
.lcard-teacher .lcard-name {
  color: #fff;
}
.lcard-teacher .lcard-role {
  color: rgba(255, 255, 255, 0.85);
}
.lcard-committee {
  border-color: #c7d2fe;
  background: #eef2ff;
}
.lcard-unit {
  border-color: #ddd6fe;
  background: #f5f3ff;
}
.lcard-empty {
  border-style: dashed;
  background: #f8fafc;
}
.lcard-empty .lcard-name {
  color: #94a3b8;
  font-weight: 700;
}
.unit-count {
  margin-top: 6px;
  font-size: 10px;
  font-weight: 800;
  color: #7c3aed;
  background: #ede9fe;
  padding: 1px 8px;
  display: inline-block;
}

/* Layer 4 units + Layer 5 members grid */
.units-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 18px;
}
.unit-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
}
.unit-vline {
  width: 2px;
  height: 16px;
  background: #cbd5e1;
}
.member-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}
.member-chip {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 5px 10px;
  text-align: center;
}
.member-empty {
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
}

/* ---- Mobile (< md): the layered chart reflows to a clean vertical stack ---- */
@media (max-width: 959px) {
  /* Filters take the full row width instead of the capped desktop widths. */
  .filter-select {
    max-width: 100% !important;
    width: 100%;
  }
  .org-viewport {
    min-height: 240px;
    background-size: 18px 18px;
  }
  .lchart {
    padding: 16px 8px;
  }
  .lcard {
    min-width: 120px;
    max-width: 100%;
    padding: 10px 12px;
  }
  .lrow {
    gap: 10px;
  }
  /* Stack the unit heads vertically — each unit and its members become one
     full-width block, far clearer than columns wrapping on a narrow screen. */
  .units-grid {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    width: 100%;
  }
  .unit-col {
    width: 100%;
    min-width: 0;
    align-items: stretch;
  }
  .unit-col .lcard-unit {
    max-width: 100%;
  }
  .member-list {
    max-width: 100%;
  }
}
</style>
