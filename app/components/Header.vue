<template>
  <div>
    <!-- Top Modern Navigation Bar -->
    <v-app-bar elevation="0" height="72" class="px-6 glass-header">
      <div class="d-flex align-center">
        <v-btn
          icon="mdi-menu-variant"
          variant="text"
          color="slate-700"
          @click="drawer = !drawer"
          class="mr-4"
        ></v-btn>

        <div class="d-none d-sm-flex align-center">
          <v-chip
            size="small"
            variant="flat"
            color="primary-lighten-5"
            class="text-primary font-weight-bold px-3"
          >
            v2.4.0
          </v-chip>
        </div>
      </div>

      <v-spacer></v-spacer>

      <!-- Global Search -->
      <div class="header-search d-none d-md-flex mr-8">
        <v-text-field
          placeholder="Search records..."
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          density="compact"
          hide-details
          class="modern-search-input"
          flat
          rounded="lg"
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
              class="rounded-lg px-2"
              height="44"
            >
              <v-avatar size="24" class="mr-2">
                <v-img :src="langFlag" cover></v-img>
              </v-avatar>
              <v-icon
                icon="mdi-chevron-down"
                size="16"
                color="grey-darken-1"
              ></v-icon>
            </v-btn>
          </template>
          <v-list class="modern-dropdown pa-2" width="180" rounded="xl">
            <v-list-item
              v-for="(item, index) in locales"
              :key="index"
              @click="setLanguage(item)"
              rounded="lg"
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
          color="slate-600"
          size="small"
          class="rounded-lg action-btn"
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
              class="d-flex align-center cursor-pointer profile-trigger pa-1 pr-3 rounded-pill"
            >
              <v-avatar
                size="44"
                class="elevation-2 border-2 border-white mr-3"
              >
                <v-img src="https://i.pravatar.cc/150?img=11"></v-img>
              </v-avatar>
              <div class="d-none d-lg-block">
                <div
                  class="text-subtitle-2 font-weight-black line-height-1 mb-1"
                >
                  Alex Admin
                </div>
                <div class="text-caption text-grey-darken-1">Principal</div>
              </div>
              <v-icon
                icon="mdi-chevron-down"
                size="16"
                class="d-none d-lg-block ml-3 opacity-50"
              ></v-icon>
            </div>
          </template>
          <v-list class="modern-dropdown pa-2" width="220" rounded="xl">
            <v-list-item
              rounded="lg"
              class="mb-1"
              prepend-icon="mdi-account-outline"
            >
              <v-list-item-title class="text-subtitle-2"
                >My Profile</v-list-item-title
              >
            </v-list-item>
            <v-list-item
              rounded="lg"
              class="mb-1"
              prepend-icon="mdi-cog-outline"
            >
              <v-list-item-title class="text-subtitle-2"
                >Settings</v-list-item-title
              >
            </v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-item
              rounded="lg"
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
                Sign Out
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Modern Sidebar Navigation -->
    <ClientOnly>
      <v-navigation-drawer
        v-model="drawer"
        width="280"
        class="modern-sidebar border-0"
        elevation="0"
        floating
        color="white"
      >
        <!-- Sidebar Brand Wrapper -->
        <div class="sidebar-brand-wrapper px-8 py-8 d-flex align-center">
          <div class="brand-logo-container mr-3">
            <v-icon icon="mdi-school" color="white" size="24"></v-icon>
          </div>
          <div class="brand-text">
            <div
              class="text-h6 font-weight-black text-slate-900 tracking-tight line-height-1"
            >
              EduAdmin
            </div>
            <div class="text-caption text-primary font-weight-bold">
              PRO DASHBOARD
            </div>
          </div>
        </div>

        <div class="px-4 py-2 scroll-container">
          <!-- Navigation Sections -->
          <div
            v-for="(section, sIndex) in groupedMenuItems"
            :key="sIndex"
            class="mb-6"
          >
            <div
              class="px-4 mb-2 text-uppercase text-caption font-weight-black text-grey-lighten-1 tracking-widest"
            >
              {{ section.label }}
            </div>

            <v-list nav class="pa-0">
              <v-list-item
                v-for="item in section.items"
                :key="item.title"
                :to="item.to"
                class="mb-1 modern-nav-item"
                rounded="xl"
                active-class="active-item"
                :exact="item.to === '/'"
              >
                <template v-slot:prepend>
                  <v-icon size="20" class="mr-4">{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title class="text-subtitle-2 font-weight-bold">
                  {{ t(item.title) }}
                </v-list-item-title>

                <!-- Optional Badge for specific items -->
                <template v-slot:append v-if="item.badge">
                  <v-chip
                    size="x-small"
                    :color="item.badgeColor"
                    class="font-weight-black"
                  >
                    {{ item.badge }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </div>

        <!-- Upgrade / Help Card -->
        <template v-slot:append>
          <div class="pa-6">
            <v-card
              color="teal-lighten-5"
              flat
              rounded="xl"
              class="pa-4 border-dashed"
            >
              <div class="d-flex align-center mb-3">
                <v-avatar color="teal-darken-1" size="32" class="mr-2">
                  <v-icon
                    icon="mdi-lightning-bolt"
                    size="18"
                    color="white"
                  ></v-icon>
                </v-avatar>
                <span class="text-body-2 font-weight-black text-teal-darken-4"
                  >Pro Support</span
                >
              </div>
              <div class="text-caption text-teal-darken-2 mb-3">
                Get 24/7 priority assistance for your school.
              </div>
              <v-btn
                block
                size="small"
                color="teal-darken-1"
                class="text-none rounded-lg font-weight-bold"
                >Contact Support</v-btn
              >
            </v-card>
          </div>
        </template>
      </v-navigation-drawer>
    </ClientOnly>

    <!-- Logout Confirmation -->
    <v-dialog v-model="logoutDialog" width="400">
      <v-card rounded="xl" class="pa-4 overflow-hidden">
        <div class="text-center py-6">
          <v-avatar color="red-lighten-5" size="72" class="mb-4">
            <v-icon icon="mdi-logout-variant" color="red" size="36"></v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-black mb-2">Sign Out?</h3>
          <p class="text-body-2 text-grey-darken-1 px-6">
            Are you sure you want to log out of your admin session?
          </p>
        </div>
        <v-card-actions class="ga-3 px-4 pb-4">
          <v-btn
            block
            variant="flat"
            color="red"
            class="rounded-lg font-weight-bold"
            height="44"
            @click="logoutButton"
            >Yes, Sign Out</v-btn
          >
          <v-btn
            block
            variant="text"
            color="grey-darken-1"
            class="rounded-lg font-weight-bold"
            height="44"
            @click="logoutDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useApiAuthStore } from "~/stores/apiAuth";

const apiAuthStore = useApiAuthStore();
const { logout } = apiAuthStore;

const langName = useCookie("lang_name", { default: () => "English" });
const langFlag = useCookie("lang_flag", { default: () => "/eng.png" });
const { locales, setLocale, t } = useI18n();

const logoutDialog = ref(false);
const drawer = ref(true);

const getFlag = (item: any) => item.flag || "/eng.png";

const setLanguage = (data: any) => {
  setLocale(data.code);
  langName.value = data.name;
  langFlag.value = data.flag;
};

// Grouped Menu for better UX
const groupedMenuItems = ref([
  {
    label: "Overview",
    items: [
      { title: "dashboard", icon: "mdi-grid-large", to: "/" },
      { title: "reports", icon: "mdi-chart-box-outline", to: "/reports" },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "academic", icon: "mdi-calendar-check", to: "/academic" },
      {
        title: "students",
        icon: "mdi-account-school-outline",
        to: "/students",
        badge: "New",
        badgeColor: "primary",
      },
      { title: "teachers", icon: "mdi-account-tie-outline", to: "/teachers" },
      { title: "classes", icon: "mdi-google-classroom", to: "/class" },
      { title: "subject", icon: "mdi-book-open-variant", to: "/subjects" },
    ],
  },
  {
    label: "Organization",
    items: [
      {
        title: "ethnic_group",
        icon: "mdi-account-group-outline",
        to: "/ethnic-group",
      },
      { title: "financial", icon: "mdi-wallet-outline", to: "/financial" },
      { title: "settings", icon: "mdi-cog-outline", to: "/settings" },
    ],
  },
]);

const logoutButton = () => {
  logout();
  logoutDialog.value = false;
};
</script>

<style scoped>
/* Glassmorphism Header */
.glass-header {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 100 !important;
}

/* Sidebar Styling */
.modern-sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.05) !important;
  z-index: 101 !important;
}

.sidebar-brand-wrapper .brand-logo-container {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  box-shadow: 0 8px 16px -4px rgba(20, 184, 166, 0.4);
}

/* Nav Item Styling */
.modern-nav-item {
  color: #64748b !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 16px !important;
  min-height: 44px !important;
}

.modern-nav-item:hover {
  background-color: #f1f5f9 !important;
  color: #0f172a !important;
}

.active-item {
  background: linear-gradient(
    135deg,
    rgba(20, 184, 166, 0.1) 0%,
    rgba(13, 148, 136, 0.05) 100%
  ) !important;
  color: #0d9488 !important;
  position: relative;
}

.active-item::after {
  content: "";
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 4px;
  background: #14b8a6;
  border-radius: 0 4px 4px 0;
}

/* Search Input */
.modern-search-input {
  width: 280px;
  transition: width 0.3s ease;
}

.modern-search-input :deep(.v-field) {
  background-color: #f1f5f9 !important;
  border-radius: 12px !important;
}

.modern-search-input :deep(.v-field--focused) {
  width: 320px;
  background-color: white !important;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2) !important;
}

/* Profile Trigger */
.profile-trigger {
  transition: background 0.2s ease;
}

.profile-trigger:hover {
  background-color: #f8fafc;
}

/* Typography & Layout Utils */
.line-height-1 {
  line-height: 1;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.modern-dropdown {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.border-dashed {
  border: 1.5px dashed rgba(20, 184, 166, 0.2) !important;
}

.scroll-container {
  height: calc(100vh - 180px);
  overflow-y: auto;
}

.scroll-container::-webkit-scrollbar {
  width: 4px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
