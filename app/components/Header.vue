<template>
  <div>
    <ClientOnly>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        rail-width="76"
        width="280"
        color="surface"
        class="modern-sidebar border-e-sm"
        elevation="0"
        floating
      >
        <!-- Sidebar Brand Wrapper -->
        <div
          class="sidebar-brand-wrapper d-flex align-center border-b"
          :class="rail ? 'px-0 py-6 justify-center' : 'px-6 py-8'"
        >
          <div
            class="brand-logo-container bg-primary-lighten-5 rounded-0 elevation-1"
            :class="{ 'mr-3': !rail }"
          >
            <v-img
              src="/logo.png"
              alt="Logo"
              width="32"
              height="32"
              contain
            ></v-img>
          </div>
          <div v-if="!rail" class="brand-text">
            <div
              class="text-subtitle-1 font-weight-black text-high-emphasis tracking-tight line-height-1"
            >
              {{ t("schoolmanagement") }}
            </div>
            <div class="text-caption text-medium-emphasis font-weight-bold">
              {{ t("management") }}
            </div>
          </div>
        </div>

        <div class="px-4 py-2 scroll-container">
          <!-- Navigation — accordion dropdowns: one section open at a time so
               the sidebar stays compact and fixed (no scrolling needed). -->
          <v-list
            nav
            class="pa-0"
            color="primary"
            open-strategy="single"
            v-model:opened="openedGroups"
          >
            <v-list-group
              v-for="section in groupedMenuItems"
              :key="section.label"
              :value="section.label"
              class="mb-2 nav-group"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  class="mb-1 modern-nav-section"
                  rounded="0"
                >
                  <template v-slot:prepend>
                    <v-icon size="20" color="primary">{{ section.icon }}</v-icon>
                  </template>
                  <v-list-item-title
                    class="text-subtitle-2 font-weight-black"
                  >
                    {{ t(section.label) }}
                  </v-list-item-title>
                </v-list-item>
              </template>

              <!-- Section items -->
              <v-list-item
                v-for="item in section.items"
                :key="item.title"
                :to="item.to"
                class="mb-1 modern-nav-item modern-nav-child"
                rounded="0"
                :exact="item.to === '/'"
              >
                <template v-slot:prepend>
                  <v-icon size="18">{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title class="text-subtitle-2 font-weight-bold">
                  {{ t(item.title) }}
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list>
        </div>

      </v-navigation-drawer>
    </ClientOnly>
    <v-app-bar elevation="0" height="72" color="primary" class="px-6 glass-header">
      <div class="d-flex align-center">
        <!-- Desktop: toggles the sidebar (rail). Hidden on mobile, where the
             bottom navigation bar is the primary nav. -->
        <v-btn
          :icon="rail ? 'mdi-menu' : 'mdi-menu-open'"
          variant="text"
          color="white"
          @click="toggleSidebar"
          :class="['mr-4', hasMoreNav ? '' : 'd-none d-md-inline-flex']"
        ></v-btn>

        <!-- Mobile-only compact brand so the top-left isn't empty. -->
        <div class="d-flex d-md-none align-center mr-2">
          <v-avatar
            size="30"
            color="white"
            rounded="0"
            class="mr-2 elevation-1"
          >
            <v-img src="/logo.png" alt="Logo" width="20" height="20" contain></v-img>
          </v-avatar>
          <span
            class="text-white font-weight-black text-body-2 text-truncate"
            style="max-width: 150px"
            >{{ t("schoolmanagement") }}</span
          >
        </div>

        <div class="d-none d-sm-flex align-center ga-2">
          <v-chip
            size="small"
            variant="flat"
            color="white"
            rounded="0"
            class="text-primary font-weight-bold px-3"
          >
            v2.4.0
          </v-chip>
          <v-chip
            v-if="classroomStore.latestAcademicYear"
            size="small"
            variant="flat"
            color="white"
            rounded="0"
            class="text-teal-darken-2 font-weight-bold px-3"
            prepend-icon="mdi-calendar-check"
          >
            {{ classroomStore.latestAcademicYear.title }}
          </v-chip>
        </div>
      </div>

      <v-spacer></v-spacer>

      <!-- Global Search -->
      <div class="header-search d-none d-md-flex mr-8">
        <v-text-field
          :placeholder="t('search')"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          density="compact"
          hide-details
          class="modern-search-input"
          flat
          rounded="0"
        ></v-text-field>
      </div>

      <!-- Action Icons -->
      <div class="d-flex align-center ga-4">
        <!-- Language Selector -->
        <v-menu location="bottom end" transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="rounded-0 px-2"
              height="44"
            >
              <v-avatar size="24" class="mr-2">
                <v-img :src="langFlag" cover></v-img>
              </v-avatar>
              <v-icon
                icon="mdi-chevron-down"
                size="16"
                color="white"
              ></v-icon>
            </v-btn>
          </template>
          <v-list class="modern-dropdown pa-2" width="180" rounded="0">
            <v-list-item
              v-for="(item, index) in locales"
              :key="index"
              @click="setLanguage(item)"
              rounded="0"
              class="mb-1"
              :active="item.name === langName"
              color="primary"
            >
              <template v-slot:prepend>
                <v-avatar size="20" class="mr-2">
                  <v-img :src="getFlag(item)" cover></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="text-subtitle-2 font-weight-bold">
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          icon="mdi-bell-outline"
          variant="text"
          color="white"
          size="small"
          class="rounded-0 action-btn"
        >
          <v-badge dot color="error" offset-x="2" offset-y="2">
            <v-icon size="22">mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-divider vertical inset class="mx-2 my-4 opacity-10"></v-divider>

        <!-- Profile Menu -->
        <v-menu location="bottom end" transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <div
              v-bind="props"
              class="d-flex align-center cursor-pointer profile-trigger pa-1 pr-3 rounded-0"
            >
              <v-avatar
                size="44"
                color="white"
                rounded="0"
                class="elevation-2 border-2 border-white mr-3"
              >
                <v-img v-if="userAvatar" :src="userAvatar" cover></v-img>
                <v-icon v-else color="primary">mdi-account</v-icon>
              </v-avatar>
              <div class="d-none d-lg-block">
                <div
                  class="text-subtitle-2 font-weight-black line-height-1 mb-1 text-capitalize text-white"
                >
                  {{ username }}
                </div>
                <div class="text-caption text-capitalize text-white opacity-75">
                  {{ role }}
                </div>
              </div>
              <v-icon
                icon="mdi-chevron-down"
                size="16"
                color="white"
                class="d-none d-lg-block ml-3 opacity-75"
              ></v-icon>
            </div>
          </template>
          <v-list class="modern-dropdown pa-2" width="240" rounded="0">
            <div class="px-3 py-2">
              <div class="text-subtitle-2 font-weight-black text-capitalize">
                {{ username }}
              </div>
              <div class="text-caption text-grey-darken-1 text-capitalize">
                {{ role }}
              </div>
            </div>
            <v-divider class="mb-2"></v-divider>
            <v-list-item
              rounded="0"
              class="mb-1"
              prepend-icon="mdi-account-outline"
              to="/admin"
            >
              <v-list-item-title class="text-subtitle-2">{{
                t("information")
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              rounded="0"
              class="mb-1"
              prepend-icon="mdi-cog-outline"
              to="/settings"
            >
              <v-list-item-title class="text-subtitle-2">{{
                t("settings")
              }}</v-list-item-title>
            </v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-item
              rounded="0"
              color="error"
              class="mb-1"
              @click="logoutDialog = true"
            >
              <template v-slot:prepend>
                <v-icon color="error">mdi-logout-variant</v-icon>
              </template>
              <v-list-item-title
                class="text-subtitle-2 font-weight-bold text-error"
              >
                {{ t("logout") }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <!-- Logout Confirmation -->
    <v-dialog v-model="logoutDialog" width="400">
      <v-card rounded="0" class="pa-4 overflow-hidden">
        <div class="text-center py-6">
          <v-avatar color="red-lighten-5" size="72" class="mb-4">
            <v-icon icon="mdi-logout-variant" color="red" size="36"></v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-black mb-2">{{ t("logout") }}</h3>
          <p class="text-body-2 text-grey-darken-1 px-6">
            {{ t("logout_message") }}
          </p>
        </div>
        <v-card-actions class="px-4 pb-4">
          <v-btn
            block
            variant="flat"
            color="red"
            class="rounded-0 font-weight-bold"
            height="44"
            @click="logoutButton"
            >{{ t("yes_logout") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Mobile bottom navigation — replaces the sidebar on small screens.
         Primary destinations sit as tabs; any overflow lives behind "More",
         which opens the full menu drawer as an overlay. -->
    <ClientOnly>
      <v-bottom-navigation
        v-if="mobile"
        v-model="bottomTab"
        class="mobile-bottom-nav"
        color="primary"
        bg-color="surface"
        grow
        height="58"
        elevation="0"
      >
        <v-btn
          v-for="item in bottomItems"
          :key="item.to"
          :to="item.to"
          :value="item.to"
          :exact="item.to === '/'"
          :title="t(item.title)"
          class="bottom-nav-btn"
        >
          <v-icon size="24">{{ item.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useApiAuthStore } from "~/stores/apiAuth";
import { useClassroomStore } from "~/stores/apiClassroom";

const apiAuthStore = useApiAuthStore();
const { logout } = apiAuthStore;

// Current academic year shown as a chip in the top bar.
const classroomStore = useClassroomStore();
onMounted(() => {
  if (!classroomStore.academicYears.length) {
    classroomStore.fetchAcademicYears();
  }
});

const langName = useCookie("lang_name", { default: () => "English" });
const langFlag = useCookie("lang_flag", { default: () => "/eng.png" });
const { locales, setLocale, t } = useI18n();

// Logged-in user (set on login in apiAuth store)
const username = useCookie<string>("username", { default: () => "Admin" });
const role = useCookie<string>("role", { default: () => "Administrator" });
const avatarCookie = useCookie<string>("avatar");

const isEmpty = (v?: string | null) =>
  !v || v === "null" || v === "undefined" || v === "";

const userAvatar = computed(() =>
  isEmpty(avatarCookie.value) ? "" : avatarCookie.value
);

const logoutDialog = ref(false);
const drawer = ref(true);
// Collapsed (rail) sidebar: shows icons only, hides titles. Toggled from the
// header menu button. On small screens the button opens/closes the drawer
// instead, since a rail is pointless when the drawer overlays content.
const rail = ref(false);
const { mobile } = useDisplay();
const toggleSidebar = () => {
  if (mobile.value) {
    drawer.value = !drawer.value;
  } else {
    rail.value = !rail.value;
  }
};

const getFlag = (item: any) => item.flag || "/eng.png";

const setLanguage = (data: any) => {
  setLocale(data.code);
  langName.value = data.name;
  langFlag.value = data.flag;
};

interface MenuItem {
  title: string;
  icon: string;
  to?: string;
  children?: MenuItem[];
  adminOnly?: boolean;
  // Students get a heavily reduced, read-only menu: only items marked here.
  studentVisible?: boolean;
  // Hidden from teachers (e.g. the class study timetable — teachers use their
  // own teaching timetable instead).
  teacherHidden?: boolean;
}

interface MenuSection {
  label: string;
  icon: string;
  adminOnly?: boolean;
  items: MenuItem[];
}

// Whether the current user is an admin. Teachers get a reduced menu limited to
// the things they can act on (score entry/report + their class organization).
// Falls back to admin for a missing/legacy role cookie so nothing is hidden by
// accident; a real teacher's cookie is set to "teacher" on login.
const isAdmin = computed(() =>
  ["admin", "administrator"].includes((role.value || "").toLowerCase())
);

// Students see a read-only subset (teacher org, score report, timetable,
// class organization) — everything else is hidden from their sidebar.
const isStudent = computed(() => (role.value || "").toLowerCase() === "student");

// Full menu with per-item / per-section admin gating.
const allMenuSections: MenuSection[] = [
  {
    label: "overview",
    icon: "mdi-view-dashboard-outline",
    items: [
      { title: "dashboard", icon: "mdi-view-dashboard-outline", to: "/" },
      { title: "announcement", icon: "mdi-bullhorn-outline", to: "/announcement", studentVisible: true },
      { title: "analytics", icon: "mdi-chart-box-outline", to: "/reports", adminOnly: true },
    ],
  },
  {
    label: "classes",
    icon: "mdi-google-classroom",
    items: [
      { title: "classes", icon: "mdi-google-classroom", to: "/class", adminOnly: true },
      { title: "students", icon: "mdi-account-school-outline", to: "/students", adminOnly: true },
      { title: "enroll", icon: "mdi-account-plus-outline", to: "/students/add", adminOnly: true },
      { title: "promotion", icon: "mdi-arrow-up-bold-box-outline", to: "/promotion", adminOnly: true },
      { title: "class_organization", icon: "mdi-account-supervisor-outline", to: "/class/organization", studentVisible: true },
    ],
  },
  {
    label: "academic_section",
    icon: "mdi-book-education-outline",
    items: [
      { title: "subject", icon: "mdi-book-open-variant", to: "/subjects", adminOnly: true },
      { title: "teaching_assignments", icon: "mdi-clipboard-account-outline", to: "/teaching", adminOnly: true },
      { title: "scores", icon: "mdi-star-outline", to: "/scores", studentVisible: true },
      { title: "study_schedule", icon: "mdi-timetable", to: "/timetable", studentVisible: true },
      { title: "student_fees", icon: "mdi-cash-multiple", to: "/fees", adminOnly: true },
      { title: "academic", icon: "mdi-calendar-check", to: "/academic", adminOnly: true },
    ],
  },
  {
    // Section itself is visible to teachers, but only the read-only org chart.
    // Managing the teacher list (create/edit/delete) stays admin-only.
    label: "faculty",
    icon: "mdi-account-tie-outline",
    items: [
      { title: "teachers", icon: "mdi-account-tie-outline", to: "/teachers", adminOnly: true },
      { title: "organization", icon: "mdi-sitemap-outline", to: "/teachers/organization", studentVisible: true },
    ],
  },
 
  {
    label: "manage_website",
    icon: "mdi-web",
    adminOnly: true,
    items: [
      { title: "news", icon: "mdi-newspaper-variant-outline", to: "/news" },
      { title: "activities", icon: "mdi-calendar-star", to: "/activities" },
      { title: "gallery", icon: "mdi-image-multiple-outline", to: "/gallery" },
      { title: "customer_contact", icon: "mdi-email-outline", to: "/contact" },
      { title: "new_academic_year", icon: "mdi-calendar-plus", to: "/academic/add" },
    ],
  },
  {
    label: "financial",
    icon: "mdi-shield-account-outline",
    items: [
    { title: "financial", icon: "mdi-wallet-outline", to: "/financial" },
      
    ],
  },
  {
    label: "configuration",
    icon: "mdi-tune-variant",
    adminOnly: true,
    items: [
      { title: "ethnic_group", icon: "mdi-account-group-outline", to: "/ethnic-group" },
      { title: "admin", icon: "mdi-shield-account-outline", to: "/admin", adminOnly: true },
      { title: "settings", icon: "mdi-cog-outline", to: "/settings" },
    ],
  },

];

// The menu the current user actually sees: drop admin-only sections/items for
// teachers, then drop any section left with no items.
const groupedMenuItems = computed<MenuSection[]>(() =>
  allMenuSections
    .filter((sec) => isAdmin.value || !sec.adminOnly)
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((it) =>
        isStudent.value ? it.studentVisible : isAdmin.value || !it.adminOnly
      ),
    }))
    .filter((sec) => sec.items.length > 0)
);

// Accordion: only one section is open at a time. It opens to the section that
// holds the current route so the sidebar stays short and never needs scrolling.
const route = useRoute();
const openedGroups = ref<string[]>([]);

const sectionForPath = (rawPath: string) => {
  // Strip the i18n locale prefix (e.g. /en/scores -> /scores) so it matches the
  // unprefixed menu `to` values.
  const path = rawPath.replace(/^\/(en|la)(?=\/|$)/, "") || "/";
  const inSection = (to?: string) =>
    !!to && (to === path || (to !== "/" && path.startsWith(to)));
  const sec = groupedMenuItems.value.find((s) =>
    s.items.some((it) => inSection(it.to))
  );
  return sec?.label ?? groupedMenuItems.value[0]?.label ?? null;
};

watch(
  () => route.path,
  (path) => {
    const label = sectionForPath(path);
    openedGroups.value = label ? [label] : [];
  },
  { immediate: true }
);

// ---- Mobile bottom navigation ----
// The sidebar is hidden on small screens; these primary destinations appear as
// a mobile-app-style bottom bar. Any overflow items live behind the "More"
// button, which opens the full drawer as an overlay. For a student (only four
// pages) all fit and no "More" button is shown.
const flatNavItems = computed(() =>
  groupedMenuItems.value.flatMap((s) => s.items).filter((i) => i.to)
);

// Preferred order for the bottom bar's primary tabs. Whichever of these the
// current role can see fill the (max 4) tabs first; anything left over stays in
// the drawer behind "More". Each role naturally gets a sensible set:
//   admin   → Dashboard · Students · Classes · Scores
//   teacher → Dashboard · Scores · Timetable · Class Org
//   student → Scores · Timetable · Class Org · Teacher Org (all four)
const BOTTOM_PRIORITY = [
  "/",
  "/announcement",
  "/teachers/organization",
  "/scores",
  "/timetable",
  "/class/organization",
  "/students",
  "/class",
];
const bottomItems = computed(() => {
  const byTo = new Map(flatNavItems.value.map((i) => [i.to, i]));
  const ordered: any[] = [];
  for (const to of BOTTOM_PRIORITY) {
    const hit = byTo.get(to);
    if (hit) {
      ordered.push(hit);
      byTo.delete(to);
    }
  }
  // Append any remaining visible items not covered by the priority list.
  for (const i of flatNavItems.value) if (byTo.has(i.to)) ordered.push(i);
  return ordered.slice(0, 5);
});
const hasMoreNav = computed(
  () => flatNavItems.value.length > bottomItems.value.length
);

// Highlight the tab matching the current route (locale prefix stripped).
const activeBottom = computed(() => {
  const path = route.path.replace(/^\/(en|la)(?=\/|$)/, "") || "/";
  const match = bottomItems.value.find(
    (it) =>
      !!it.to && (it.to === path || (it.to !== "/" && path.startsWith(it.to)))
  );
  return match?.to ?? null;
});
const bottomTab = ref<string | null>(null);
watch(activeBottom, (v) => (bottomTab.value = v), { immediate: true });

// Sidebar starts closed on mobile (the bottom bar drives navigation) and open
// on desktop; it re-syncs when the viewport crosses the breakpoint.
watch(mobile, (m) => (drawer.value = !m), { immediate: true });

const logoutButton = () => {
  logout();
  logoutDialog.value = false;
};
</script>

<style scoped>
/* App-bar must sit above the drawer; both handled by Vuetify color props. */
.glass-header {
  z-index: 100 !important;
}
.modern-sidebar {
  z-index: 101 !important;
}

/* Logo tile — sizing only; color comes from the bg-primary-lighten-5 class. */
.brand-logo-container {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}

/* Nested (child) items sit slightly indented under their parent group. */
.modern-nav-child {
  padding-left: 28px !important;
}

/* Rail (collapsed) mode: center every icon, drop title-oriented spacing. */
.modern-sidebar.v-navigation-drawer--rail .modern-nav-child {
  padding-left: 0 !important;
}
.modern-sidebar.v-navigation-drawer--rail :deep(.v-list-item__prepend .v-icon) {
  margin-right: 0 !important;
}

/* Search field widens on focus. */
.modern-search-input {
  width: 280px;
  transition: width 0.3s ease;
}
.modern-search-input :deep(.v-field--focused) {
  width: 320px;
}

/* Typography utils Vuetify has no direct equivalent for. */
.line-height-1 {
  line-height: 1;
}
.tracking-tight {
  letter-spacing: -0.025em;
}

/* Drawer is a flex column: the brand stays fixed and the nav list scrolls, so
   every menu item stays reachable no matter how many dropdowns are open. */
.modern-sidebar :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sidebar-brand-wrapper {
  flex: 0 0 auto;
}

.scroll-container {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
}

/* ---- Mobile bottom navigation ---- */
.mobile-bottom-nav {
  border-top: 1px solid #e2e8f0;
  z-index: 102 !important; /* above the app-bar/drawer on mobile */
}
.bottom-nav-btn {
  min-width: 0 !important;
  text-transform: none !important;
}
</style>
