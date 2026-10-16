<template>
  <div class="page">
    <PageHeader
      :title="$t('class_organization')"
      :subtitle="t('class-leadership-desc')"
      icon="mdi-account-supervisor-outline"
      :breadcrumbs="breadcrumbs"
    >
      <!-- Write actions are hidden from the read-only student role. The "Classes"
           link goes to the admin-only class list, so it shows for admins only;
           teachers still get "Assign Roles" to set their class's org. -->
      <template v-if="!isStudent" #actions>
        <v-btn
          v-if="isAdmin"
          variant="flat"
          class="modern-action-btn secondary"
          prepend-icon="mdi-arrow-left"
          to="/class"
        >
          {{ t("classes") }}
        </v-btn>
        <v-btn
          variant="flat"
          class="modern-action-btn primary"
          prepend-icon="mdi-account-cog-outline"
          :disabled="!selectedClassId"
          @click="openManage"
        >
          {{ t("assign_roles") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- Filters — admins only. Teachers/students are locked to their own class
         and the latest academic year (auto-selected), so no filter is shown. -->
    <v-card v-if="isAdmin" elevation="0" class="panel mb-6 fade-in">
      <div class="filter-bar mb-0">
        <v-select
          v-model="selectedClassId"
          :items="classOptions"
          item-title="label"
          item-value="id"
          :label="t('class')"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-google-classroom"
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
          prepend-inner-icon="mdi-calendar-check"
          color="primary"
        ></v-select>
      </div>
    </v-card>

    <v-card v-if="!selectedClassId" elevation="0" class="panel fade-in">
      <EmptyState
        icon="mdi-google-classroom"
        :title="t('class_organization')"
        :description="t('select-class-hint')"
      />
    </v-card>

    <template v-else>
      <!-- Org Chart — layered by level -->
      <v-card elevation="0" class="panel panel--flush fade-in">
        <div class="panel-head">
          <div class="min-w-0">
            <div class="panel-title">{{ t("organization") }}</div>
            <div class="panel-sub text-truncate">
              {{ selectedClass?.classroom_name }}
              <template v-if="homeroomTeacherName">
                · {{ t("homeroom_teacher") }}: {{ homeroomTeacherName }}
              </template>
            </div>
          </div>
          <span class="panel-chip panel-chip--teal">
            {{ students.length }} {{ t("students") }}
          </span>
        </div>

        <div class="table-wrap">
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
                  <div class="lcard lcard-monitor" :class="{ 'lcard-empty': !monitorRow }">
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
                  <div
                    v-for="(u, i) in unitColumns"
                    :key="u.id"
                    class="unit-col"
                    :class="{ 'unit-drop-active': !isStudent && dragOverUnit === i }"
                    @dragover.prevent="!isStudent && (dragOverUnit = i)"
                    @dragleave="dragOverUnit === i && (dragOverUnit = null)"
                    @drop="onDropUnit(i)"
                  >
                    <div class="lcard lcard-unit">
                      <div class="lcard-name">{{ u.name }}</div>
                      <div class="lcard-role">{{ t("unit-head-role", { n: i + 1 }) }}</div>
                      <div class="unit-count">{{ t("n-members", { n: u.members.length }) }}</div>
                    </div>
                    <div class="unit-vline" v-if="u.members.length"></div>
                    <div class="member-list">
                      <div
                        v-for="m in u.members"
                        :key="m.id"
                        class="member-chip"
                        :class="{ 'member-draggable': !isStudent }"
                        :draggable="!isStudent"
                        @dragstart="onDragStart(m.id)"
                        @dragend="onDragEnd"
                      >
                        <v-icon
                          v-if="!isStudent"
                          size="12"
                          class="mr-1 drag-handle"
                          >mdi-drag-vertical</v-icon
                        >{{ m.label }}
                      </div>
                      <div v-if="!u.members.length" class="member-empty">—</div>
                    </div>
                  </div>
                </div>
                <div v-else class="lrow">
                  <div class="lcard lcard-empty">
                    <div class="lcard-name">{{ t("no-unit-heads") }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>

      <!-- Assignment panel (dialog) -->
      <v-dialog v-model="manageDialog" width="560" scrollable>
        <v-card class="dialog-card">
          <div class="dialog-head">
            <div class="page-icon">
              <v-icon size="20">mdi-account-cog-outline</v-icon>
            </div>
            <div class="min-w-0 flex-grow-1">
              <div class="panel-title">{{ t("assign_roles") }}</div>
              <div class="panel-sub">
                {{ selectedClass?.classroom_name }} · {{ students.length }}
                {{ t("students") }} · {{ t("homeroom_teacher") }}:
                <strong>{{ homeroomTeacherName || "—" }}</strong>
              </div>
            </div>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              class="flex-shrink-0"
              @click="manageDialog = false"
            ></v-btn>
          </div>

          <!-- Monitor -->
          <label class="field-label">{{ t("monitor-label") }}</label>
          <v-select
            v-model="form.monitor"
            :items="optionsFor('monitor')"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            class="mb-4"
            placeholder="—"
          ></v-select>

          <!-- Committee -->
          <label class="field-label">{{ t("committee-label") }}</label>
          <v-select
            v-model="form.committee"
            :items="optionsFor('committee')"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="comfortable"
            hide-details
            multiple
            chips
            closable-chips
            class="mb-4"
            :error="form.committee.length > CAPS.committee"
          ></v-select>

          <!-- Unit heads -->
          <label class="field-label">{{ t("unit-heads-label") }}</label>
          <v-select
            v-model="form.unit_head"
            :items="optionsFor('unit_head')"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="comfortable"
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
            rounded="lg"
            class="mt-4"
            >{{ saveError }}</v-alert
          >
          <v-alert
            v-if="saveOk"
            type="success"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="mt-4"
            >{{ t("saved") }}</v-alert
          >

          <div class="form-actions">
            <v-btn
              variant="flat"
              class="modern-action-btn secondary"
              :disabled="saving"
              @click="resetForm"
            >
              {{ t("cancel") }}
            </v-btn>
            <v-btn
              variant="flat"
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
  </div>
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
  // Drag overrides belong to a specific class/year — drop them on a change.
  memberUnit.value = {};
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

// Manual member → unit-index overrides from drag & drop. Not persisted to the
// backend (there is no member-unit field); it lets you rearrange the split for
// this session. Cleared whenever the class/year (and thus members) change.
const memberUnit = ref<Record<string, number>>({});

// Layer 4 (unit heads) each with their Layer 5 members attached. Members follow
// any manual drag override, otherwise fall back to an even round-robin split.
const unitColumns = computed(() => {
  const units = unitRows.value;
  if (!units.length) return [] as any[];

  // Default (even) unit index for each member.
  const defaultIndex: Record<string, number> = {};
  splitEven(memberStudents.value, units.length).forEach((group, i) =>
    group.forEach((m: any) => (defaultIndex[m.id] = i))
  );

  const groups: any[][] = Array.from({ length: units.length }, () => []);
  memberStudents.value.forEach((m) => {
    let idx = memberUnit.value[m.id];
    if (idx === undefined || idx < 0 || idx >= units.length) {
      idx = defaultIndex[m.id] ?? 0;
    }
    (groups[idx] as any[]).push(m);
  });

  return units.map((u: any, i: number) => ({
    id: u.id,
    name: nameFor(u.student_id),
    members: groups[i] ?? [],
  }));
});

// ---- Drag & drop: move a member between units ----
const draggedMemberId = ref<string | null>(null);
const dragOverUnit = ref<number | null>(null);

const onDragStart = (memberId: string) => {
  if (isStudent.value) return;
  draggedMemberId.value = memberId;
};
const onDragEnd = () => {
  draggedMemberId.value = null;
  dragOverUnit.value = null;
};
const onDropUnit = (unitIndex: number) => {
  if (isStudent.value || !draggedMemberId.value) return;
  memberUnit.value = { ...memberUnit.value, [draggedMemberId.value]: unitIndex };
  draggedMemberId.value = null;
  dragOverUnit.value = null;
};
</script>

<style scoped>
/* ---- Dialog ---- */
.dialog-card {
  padding: 20px;
}
.dialog-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
@media (min-width: 600px) {
  .dialog-card {
    padding: 24px;
  }
}

/* ---- Org chart board ---- */
.org-viewport {
  position: relative;
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
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ds-teal-700);
  background: #ccfbf1;
  padding: 3px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
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
  border-radius: 2px;
  background: #cbd5e1;
}
.lcard {
  min-width: 150px;
  max-width: 220px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid var(--ds-border);
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 14px -8px rgba(15, 23, 42, 0.18);
}
.lcard-name {
  font-weight: 800;
  font-size: 13px;
  color: var(--ds-text);
  line-height: 1.25;
}
.lcard-role {
  font-size: 9.5px;
  color: var(--ds-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  margin-top: 2px;
}
.lcard-teacher {
  background: linear-gradient(135deg, var(--ds-navy) 0%, var(--ds-navy-2) 100%);
  border: 0;
  box-shadow: 0 10px 22px -12px rgba(10, 49, 84, 0.7);
}
.lcard-teacher .lcard-name {
  color: #fff;
}
.lcard-teacher .lcard-role {
  color: var(--ds-teal);
}
.lcard-monitor {
  border-color: #99f6e4;
  background: #f0fdfa;
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
  border-color: #e2e8f0;
  background: #f8fafc;
  box-shadow: none;
}
.lcard-empty .lcard-name {
  color: var(--ds-faint);
  font-weight: 700;
}
.unit-count {
  margin-top: 6px;
  font-size: 10px;
  font-weight: 800;
  color: #7c3aed;
  background: #ede9fe;
  padding: 2px 8px;
  border-radius: 999px;
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
  padding: 6px;
  border-radius: 14px;
  transition: background 0.15s ease, outline-color 0.15s ease;
}
.unit-vline {
  width: 2px;
  height: 16px;
  border-radius: 2px;
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
  border: 1px solid var(--ds-border);
  border-radius: 8px;
  padding: 6px 10px;
  text-align: center;
}
.member-empty {
  font-size: 11px;
  color: var(--ds-faint);
  text-align: center;
}

/* Drag & drop: members can be dragged between units. */
.member-draggable {
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
}
.member-draggable:active {
  cursor: grabbing;
}
.drag-handle {
  color: var(--ds-faint);
}
.unit-drop-active {
  background: #f0fdfa;
  outline: 2px dashed var(--ds-teal-700);
  outline-offset: 2px;
}

/* ---- Mobile (< md): the layered chart reflows to a clean vertical stack ---- */
@media (max-width: 959px) {
  .org-viewport {
    min-height: 240px;
    background-size: 18px 18px;
  }
  .lchart {
    padding: 16px 12px;
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
