<template>
  <div>
    <!-- Top App Bar -->
    <v-app-bar color="surface" elevation="0" height="80" class="px-6 border-b">
      <div class="d-flex align-center">
        <v-btn
          icon="mdi-menu"
          variant="text"
          color="secondary"
          @click="drawer = !drawer"
        ></v-btn>
        <div class="d-flex align-center ml-4">
          <v-avatar
            color="primary-lighten-5"
            size="40"
            rounded="lg"
            class="mr-3 icon-box"
          >
            <v-icon color="primary" size="24">mdi-school-outline</v-icon>
          </v-avatar>
          <v-toolbar-title class="font-weight-bold text-secondary text-h6"
            >Admin<span class="text-primary">Portal</span></v-toolbar-title
          >
        </div>
      </div>

      <v-spacer></v-spacer>

      <!-- Language Selector -->
      <v-menu location="bottom end" transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="outlined"
            height="42"
            class="mr-3 text-none px-3"
            color="grey-lighten-1"
            rounded="lg"
            border
          >
            <div class="d-flex align-center">
              <v-avatar size="24" class="mr-2">
                <v-img :src="langFlag" cover></v-img>
              </v-avatar>
              <span class="text-secondary font-weight-bold mr-1">{{
                langName
              }}</span>
              <v-icon
                icon="mdi-chevron-down"
                size="18"
                color="grey-lighten-1"
              ></v-icon>
            </div>
          </v-btn>
        </template>
        <v-list class="pa-2" width="160" elevation="2" rounded="lg">
          <v-list-item
            v-for="(item, index) in locales"
            :key="index"
            @click="setLanguage(item)"
            rounded="lg"
            class="mb-1"
            :active="item.name === langName"
            color="primary-lighten-5"
          >
            <template v-slot:prepend>
              <v-avatar size="24" class="mr-2">
                <v-img :src="getFlag(item)" cover></v-img>
              </v-avatar>
            </template>
            <v-list-item-title
              class="font-weight-bold text-secondary text-body-2"
            >
              {{ item.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Settings Button -->
      <v-btn icon variant="text" color="secondary" class="mr-2">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>

      <!-- User Profile -->
      <v-menu location="bottom end" transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-avatar
            v-bind="props"
            color="primary-lighten-5"
            size="40"
            class="cursor-pointer border icon-box"
          >
            <v-img src="https://i.pravatar.cc/150?img=11"></v-img>
          </v-avatar>
        </template>
        <v-list class="pa-2" width="200" elevation="2" rounded="lg">
          <v-list-item rounded="lg" class="mb-1" @click="logoutDialog = true">
            <template v-slot:prepend>
              <v-icon color="error" size="20" class="mr-2"
                >mdi-logout-variant</v-icon
              >
            </template>
            <v-list-item-title class="font-weight-bold text-error text-body-2">
              {{ t("logout") }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Sidebar Navigation -->
    <ClientOnly>
      <v-navigation-drawer
        v-model="drawer"
        width="280"
        class="sidebar border-r"
        color="bg"
        elevation="0"
        floating
      >
        <div class="px-6 py-6 d-flex flex-column h-100">
          <div class="mb-6 px-2">
            <div
              class="text-caption font-weight-bold text-grey-darken-1 text-uppercase tracking-wider mb-2"
            >
              Menu
            </div>
          </div>

          <v-list class="flex-grow-1 bg-transparent pa-0" nav>
            <v-list-item
              v-for="item in menuItems"
              :key="item.title"
              :to="item.to"
              class="mb-2 nav-item"
              rounded="lg"
              active-class="active-nav-item"
              :exact="item.to === '/'"
              min-height="48"
            >
              <template v-slot:prepend>
                <div
                  class="nav-icon-container mr-3 d-flex align-center justify-center rounded-lg"
                  :class="
                    $route.path === item.to ? 'bg-primary' : 'bg-transparent'
                  "
                >
                  <v-icon
                    :color="$route.path === item.to ? 'white' : 'grey-darken-1'"
                    size="20"
                    >{{ item.icon }}</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-body-2"
                :class="
                  $route.path === item.to
                    ? 'text-secondary'
                    : 'text-grey-darken-1'
                "
              >
                {{ t(item.title) }}
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- Bottom Section -->
          <div class="mt-auto px-2 pb-2">
            <div
              class="course-card pa-4 rounded-xl bg-secondary mb-4 position-relative overflow-hidden"
            >
              <div class="position-relative" style="z-index: 2">
                <div class="text-white text-subtitle-2 font-weight-bold mb-1">
                  Need Help?
                </div>
                <div
                  class="text-grey-lighten-2 text-caption mb-3"
                  style="line-height: 1.3"
                >
                  Check our docs or contact support
                </div>
                <v-btn
                  block
                  size="small"
                  variant="flat"
                  color="white"
                  class="text-secondary font-weight-bold text-none rounded-lg"
                  >Documentation</v-btn
                >
              </div>
              <!-- Decorativecircles -->
              <div
                class="position-absolute rounded-circle bg-white"
                style="
                  width: 80px;
                  height: 80px;
                  top: -20px;
                  right: -20px;
                  opacity: 0.1;
                  z-index: 1;
                "
              ></div>
              <div
                class="position-absolute rounded-circle bg-white"
                style="
                  width: 40px;
                  height: 40px;
                  bottom: 10px;
                  right: 10px;
                  opacity: 0.05;
                  z-index: 1;
                "
              ></div>
            </div>
          </div>
        </div>
      </v-navigation-drawer>
    </ClientOnly>

    <!-- Logout Dialog -->
    <v-dialog v-model="logoutDialog" width="460">
      <v-card class="rounded-xl pa-2" elevation="0">
        <v-card-title
          class="d-flex align-center justify-space-between pl-6 pt-5 pr-6"
        >
          <span class="text-h6 font-weight-bold text-secondary">{{
            t("logout")
          }}</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            color="grey"
            @click="logoutDialog = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pt-2 pb-6 px-6">
          <div class="d-flex flex-column align-center text-center">
            <v-avatar color="red-lighten-5" size="80" class="mb-4">
              <v-icon color="red-lighten-1" size="40"
                >mdi-logout-variant</v-icon
              >
            </v-avatar>
            <h3 class="text-h6 font-weight-bold text-secondary mb-2">
              Are you sure?
            </h3>
            <p class="text-body-2 text-grey-darken-1">
              {{ t("logout_message") }}
            </p>
          </div>
        </v-card-text>

        <v-card-actions class="px-6 pb-6 pt-0 gap-3">
          <v-btn
            color="grey-lighten-1"
            variant="outlined"
            @click="logoutDialog = false"
            class="flex-grow-1 text-none font-weight-bold"
            height="44"
            rounded="xl"
            border
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            color="red"
            variant="flat"
            @click="logoutButton"
            class="flex-grow-1 text-none font-weight-bold"
            height="44"
            rounded="xl"
            elevation="2"
          >
            {{ t("logout") }}
          </v-btn>
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

const getFlag = (item: any) => {
  return item.flag || "/eng.png";
};

const setLanguage = (data: any) => {
  setLocale(data.code);
  langName.value = data.name;
  langFlag.value = data.flag;
};

const menuItems = ref([
  {
    title: "dashboard",
    icon: "mdi-view-dashboard-outline",
    to: "/",
  },
  {
    title: "ethnic_group",
    icon: "mdi-account-group-outline",
    to: "/ethnic-group",
  },
  {
    title: "academic",
    icon: "mdi-school-outline",
    to: "/academic",
  },
  {
    title: "students",
    icon: "mdi-account-school-outline",
    to: "/students",
  },
  {
    title: "teachers",
    icon: "mdi-teach",
    to: "/teachers",
  },
  {
    title: "classes",
    icon: "mdi-google-classroom",
    to: "/class",
  },
  {
    title: "subject",
    icon: "mdi-book-open-page-variant-outline",
    to: "/subjects",
  },
  {
    title: "scores",
    icon: "mdi-chart-box-outline",
    to: "/scores",
  },
  {
    title: "financial",
    icon: "mdi-cash-multiple",
    to: "/financial",
  },
  {
    title: "reports",
    icon: "mdi-file-chart-outline",
    to: "/reports",
  },
  {
    title: "settings",
    icon: "mdi-cog-outline",
    to: "/settings",
  },
]);

const logoutButton = () => {
  logout();
  logoutDialog.value = false;
};
</script>

<style scoped>
/* Modern Styles */
.nav-icon-container {
  width: 32px;
  height: 32px;
  transition: all 0.2s ease;
}

.nav-item {
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}

.active-nav-item {
  background-color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.active-nav-item .nav-icon-container {
  background-color: rgb(var(--v-theme-primary)) !important;
}

.tracking-wider {
  letter-spacing: 0.08em;
}

.icon-box {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.border {
  border: 1px solid #e2e8f0 !important;
}

.border-b {
  border-bottom: 1px solid #e2e8f0 !important;
}

.border-r {
  border-right: 1px solid #e2e8f0 !important;
}

.gap-3 {
  gap: 12px;
}
</style>
