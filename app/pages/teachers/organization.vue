<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="teal-lighten-5" size="44" class="mr-3 rounded-0">
          <v-icon color="teal-darken-1" size="22">mdi-sitemap-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ t("organization-chart") }}</div>
          <div class="text-detail">{{ t("faculty-hierarchy-desc") }}</div>
        </div>
      </div>

      <!-- Managing teachers (list / add) is admin-only; teachers get a
           read-only org chart with no create/edit actions. -->
      <div v-if="isAdmin" class="d-flex gap-2 align-center mt-4 mt-md-0">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
          to="/teachers"
        >
          <v-icon icon="mdi-arrow-left" start size="18"></v-icon>
          {{ t("teachers") }}
        </v-btn>
        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          to="/teachers/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("add") }}
        </v-btn>
      </div>
    </div>

    <v-alert
      v-if="teacherStore.error"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-4"
      >{{ teacherStore.error }}</v-alert
    >

    <v-card elevation="0" class="intelligence-card pa-4">
      <div v-if="teacherStore.loading" class="py-10 text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>

      <template v-else>
        <!-- Zoom controls -->
        <div v-if="teachers.length" class="d-flex justify-end mb-2">
          <div class="zoom-bar d-flex align-center">
            <v-btn
              icon="mdi-minus"
              variant="text"
              size="small"
              :disabled="zoom <= MIN_ZOOM"
              @click="zoomOut"
            ></v-btn>
            <span
              class="zoom-label text-detail-tiny font-weight-black"
              @click="resetZoom"
              :title="t('reset')"
              >{{ Math.round(zoom * 100) }}%</span
            >
            <v-btn
              icon="mdi-plus"
              variant="text"
              size="small"
              :disabled="zoom >= MAX_ZOOM"
              @click="zoomIn"
            ></v-btn>
            <v-divider vertical class="mx-1"></v-divider>
            <v-btn
              icon="mdi-fit-to-screen-outline"
              variant="text"
              size="small"
              :title="t('fit-to-screen')"
              @click="fitToScreen"
            ></v-btn>
          </div>
        </div>

        <div
          ref="viewport"
          class="org-viewport"
          :class="{ grabbing: isPanning }"
          @wheel="onWheel"
          @mousedown="startPan"
          @mousemove="onPan"
          @mouseup="endPan"
          @mouseleave="endPan"
        >
          <div v-if="orgRoots.length" class="tree" :style="treeStyle">
            <ul class="org-tree-root">
              <OrgNode
                v-for="root in orgRoots"
                :key="root.uuid"
                :node="root"
              />
            </ul>
          </div>

          <div v-else class="text-detail py-10 text-center">
            {{ t("no-faculty-display") }}
          </div>
        </div>
        <div class="text-detail-tiny text-grey mt-2 text-center">
          ລາກເພື່ອເລື່ອນ · ໝູນເມົາສ໌ເພື່ອຊູມ · Drag to pan · scroll to zoom
        </div>
      </template>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from "vue";
import { useTeacherStore } from "~/stores/apiTeacher";

const { t } = useI18n();
const teacherStore = useTeacherStore();

// Teachers may view this org chart but not create/edit. Admins get the action
// buttons; a missing/legacy role cookie falls back to admin so nothing hides
// by accident.
const role = useCookie<string>("role", { default: () => "Administrator" });
const isAdmin = computed(() =>
  ["admin", "administrator"].includes((role.value || "").toLowerCase())
);

const viewport = ref<HTMLElement | null>(null);

onMounted(() => {
  teacherStore.fetchTeachers(100, 1);
});

// ---- Zoom ----
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.6;
const ZOOM_STEP = 0.1;
const zoom = ref(1);

const clampZoom = (v: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(v * 100) / 100));

// `zoom` (CSS) scales layout so the scroll container tracks the new size.
const treeStyle = computed(() => ({ zoom: zoom.value }));

// Change zoom while keeping the point at (cx, cy) inside the viewport fixed.
const zoomAt = (nextZoom: number, cx: number, cy: number) => {
  const vp = viewport.value;
  const z0 = zoom.value;
  const z1 = clampZoom(nextZoom);
  if (z1 === z0) return;
  if (!vp) {
    zoom.value = z1;
    return;
  }
  const ratio = z1 / z0;
  const left = vp.scrollLeft;
  const top = vp.scrollTop;
  zoom.value = z1;
  nextTick(() => {
    vp.scrollLeft = (left + cx) * ratio - cx;
    vp.scrollTop = (top + cy) * ratio - cy;
  });
};

// Buttons zoom toward the middle of the viewport.
const zoomByCenter = (delta: number) => {
  const vp = viewport.value;
  zoomAt(
    zoom.value + delta,
    vp ? vp.clientWidth / 2 : 0,
    vp ? vp.clientHeight / 2 : 0
  );
};
const zoomIn = () => zoomByCenter(ZOOM_STEP);
const zoomOut = () => zoomByCenter(-ZOOM_STEP);
const resetZoom = () => {
  zoom.value = 1;
  nextTick(centerView);
};

// Plain mouse wheel zooms toward the cursor.
const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  const vp = viewport.value;
  if (!vp) return;
  const rect = vp.getBoundingClientRect();
  zoomAt(
    zoom.value + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP),
    e.clientX - rect.left,
    e.clientY - rect.top
  );
};

// ---- Pan (click + drag) ----
const isPanning = ref(false);
let panStart = { x: 0, y: 0, left: 0, top: 0 };

const startPan = (e: MouseEvent) => {
  const vp = viewport.value;
  if (!vp || e.button !== 0) return;
  isPanning.value = true;
  panStart = { x: e.clientX, y: e.clientY, left: vp.scrollLeft, top: vp.scrollTop };
};
const onPan = (e: MouseEvent) => {
  if (!isPanning.value || !viewport.value) return;
  viewport.value.scrollLeft = panStart.left - (e.clientX - panStart.x);
  viewport.value.scrollTop = panStart.top - (e.clientY - panStart.y);
};
const endPan = () => {
  isPanning.value = false;
};

// ---- Center the tree in the viewport ----
const centerView = () => {
  const vp = viewport.value;
  if (!vp) return;
  vp.scrollLeft = Math.max(0, (vp.scrollWidth - vp.clientWidth) / 2);
  vp.scrollTop = Math.max(0, (vp.scrollHeight - vp.clientHeight) / 2);
};

// ---- Fit the whole tree into the viewport ----
const fitToScreen = () => {
  const vp = viewport.value;
  const tree = vp?.querySelector(".tree") as HTMLElement | null;
  if (!vp || !tree) return;
  const z0 = zoom.value || 1;
  const rect = tree.getBoundingClientRect();
  const naturalW = rect.width / z0;
  const naturalH = rect.height / z0;
  if (naturalW <= 0 || naturalH <= 0) return;
  const pad = 32;
  const fit = Math.min(
    (vp.clientWidth - pad) / naturalW,
    (vp.clientHeight - pad) / naturalH
  );
  // Never blow a small tree past 100%; allow shrinking down to MIN_ZOOM.
  zoom.value = Math.min(1, Math.max(MIN_ZOOM, Math.round(fit * 100) / 100));
  nextTick(centerView);
};

// Center once the faculty data has rendered.
watch(
  () => teacherStore.teachers.length,
  (len) => {
    if (len > 0) nextTick(centerView);
  }
);

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("teachers"), disabled: false, to: "/teachers" },
  { title: "Organization", disabled: true, to: "/teachers/organization" },
];

// Normalized faculty list.
const teachers = computed(() =>
  teacherStore.teachers.map((tc) => ({
    uuid: tc.id,
    username: tc.full_name || tc.username,
    image: tc.avatar,
    role: tc.role,
    status: capitalize(tc.status),
    position: tc.position || "",
    department: tc.department || "",
    layer: tc.layer ?? null,
    managerId: tc.manager_id || null,
  }))
);

const DIRECTOR_POS = "ຜູ້ອຳນວຍການ";
const DEPUTY_POS = "ຮອງຜູ້ອຳນວຍການ";
const HEAD_POS = "ຫົວໜ້າໝວດວິຊາ"; // subject head — hidden from the chart

const posOf = (tc: any) => (tc.position || "").trim();

// A flat 3-tier org chart:
//   Director (top) → the two Deputy Directors → all teachers.
// The synthetic school node and the subject-head layer are removed; teachers
// (who in the data all report through the subject heads to one deputy) are
// spread evenly across BOTH deputies, keeping each department on one side so
// the tree stays balanced and the line from the director sits centered.
const orgRoots = computed(() => {
  const list = teachers.value;
  if (!list.length) return [];

  const mk = (tc: any) => ({
    uuid: tc.uuid,
    name: tc.username,
    image: tc.image,
    title:
      tc.position ||
      (tc.role?.toLowerCase() === "admin" ? "Admin" : "Teacher"),
    department: tc.department,
    status: tc.status,
    layer: tc.layer,
    children: [] as any[],
  });

  const director = list.find((tc) => !tc.managerId) || null;
  const deputyNodes = list
    .filter((tc) => posOf(tc) === DEPUTY_POS)
    .map(mk);

  // Everyone who is not the director, a deputy, or a (hidden) subject head is a
  // teacher shown on the bottom tier.
  const teacherList = list.filter(
    (tc) =>
      tc !== director &&
      posOf(tc) !== DEPUTY_POS &&
      posOf(tc) !== DIRECTOR_POS &&
      posOf(tc) !== HEAD_POS
  );

  // Group teachers by department, then hand each whole department to whichever
  // deputy currently has the fewest teachers (greedy balance).
  if (deputyNodes.length) {
    const byDept: Record<string, any[]> = {};
    teacherList.forEach((tc) => {
      (byDept[tc.department || "—"] ||= []).push(tc);
    });
    const counts = deputyNodes.map(() => 0);
    Object.values(byDept)
      .sort((a, b) => b.length - a.length)
      .forEach((group) => {
        let idx = 0;
        let min = counts[0] ?? 0;
        for (let i = 1; i < counts.length; i++) {
          const c = counts[i] ?? 0;
          if (c < min) {
            min = c;
            idx = i;
          }
        }
        const deputy = deputyNodes[idx];
        if (deputy) group.forEach((tc) => deputy.children.push(mk(tc)));
        counts[idx] = min + group.length;
      });
  }

  if (director) {
    const root = mk(director);
    // No deputies? fall back to teachers directly under the director.
    root.children = deputyNodes.length ? deputyNodes : teacherList.map(mk);
    return [root];
  }
  // No clear director: show the deputies (or everyone) as top-level nodes.
  return deputyNodes.length ? deputyNodes : teacherList.map(mk);
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

.gap-2 {
  gap: 8px;
}

/* Pannable / zoomable viewport (node styles live in OrgNode.vue) */
.org-viewport {
  position: relative;
  overflow: auto;
  height: 68vh;
  min-height: 420px;
  cursor: grab;
  background:
    radial-gradient(circle, #e2e8f0 1px, transparent 1px) 0 0 / 22px 22px;
}
.org-viewport.grabbing {
  cursor: grabbing;
}
/* Don't select text while dragging to pan. */
.org-viewport.grabbing,
.org-viewport.grabbing * {
  user-select: none;
}

.org-viewport::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.org-viewport::-webkit-scrollbar-thumb {
  background: #e2e8f0;
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

/* Zoom control bar */
.zoom-bar {
  border: 1px solid #e2e8f0;
  padding: 2px 4px;
  background: #f8fafc;
}

.zoom-label {
  min-width: 44px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  color: #0d9488;
}
</style>
