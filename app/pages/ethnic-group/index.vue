<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8"
    >
      <div>
        <h1
          class="text-h4 font-weight-bold text-brown-darken-4 mb-1"
          style="letter-spacing: -0.5px"
        >
          {{ t("management") }} {{ t("ethnic_group") }}
        </h1>
        <p class="text-body-2 text-brown-lighten-1 font-weight-medium">
          Manage ethnic group classifications and records.
        </p>
      </div>

      <div class="d-flex gap-3 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="brown-lighten-2"
          class="text-none font-weight-bold"
          height="44"
          rounded="xl"
          prepend-icon="mdi-tray-arrow-down"
          border
        >
          {{ t("export") }}
        </v-btn>

        <v-btn
          color="brown-darken-3"
          class="text-none px-6 font-weight-bold"
          height="44"
          rounded="xl"
          elevation="4"
          prepend-icon="mdi-plus"
          to="/ethnic-group/add"
        >
          {{ t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-brown-lighten-2 text-uppercase mb-1 tracking-wide"
              >
                {{ t("total") }}
              </p>
              <h2 class="text-h4 font-weight-bold text-brown-darken-4">
                {{ total }}
              </h2>
            </div>
            <v-avatar
              color="blue-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="blue-darken-2" size="26"
                >mdi-account-group-outline</v-icon
              >
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2">
            <span class="text-caption font-weight-medium text-brown-lighten-2"
              >Registered groups</span
            >
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" rounded="xl" class="bean-card pa-6">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8 gap-4"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('search')"
          variant="outlined"
          density="comfortable"
          hide-details
          class="cream-input"
          style="max-width: 380px"
          bg-color="white"
          color="brown-darken-2"
          base-color="brown-lighten-3"
          rounded="lg"
        ></v-text-field>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="ethnicGroups"
        :search="search"
        class="ethnic-table"
        hover
      >
        <!-- ID Slot -->
        <template v-slot:item.id="{ index }">
          <span
            class="font-weight-bold text-brown-darken-3 bg-brown-lighten-5 px-3 py-1 rounded"
            >{{ index + 1 }}</span
          >
        </template>

        <!-- Title Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="brown-lighten-5"
              size="46"
              class="mr-4 rounded-lg border-cream shadow-sm"
            >
              <v-icon
                icon="mdi-text-box-outline"
                size="24"
                color="brown-darken-2"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="text-brown-darken-4 text-subtitle-2 font-weight-bold">
                {{ item.title }}
              </div>
              <div
                class="text-caption text-brown-lighten-2 font-weight-medium text-uppercase tracking-wide"
              >
                ID: {{ hiddenId(String(item.id)) }}
              </div>
            </div>
          </div>
        </template>

        <!-- Action Slot -->
        <template v-slot:item.action="{ item }">
          <div class="d-flex align-center">
            <v-btn
              icon
              size="small"
              variant="text"
              color="brown-darken-1"
              class="mr-1"
              :to="`/ethnic-group/${item.id}`"
            >
              <v-icon icon="mdi-pencil-outline"></v-icon>
              <v-tooltip activator="parent" location="top">Edit</v-tooltip>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              color="error"
              @click="deleteItem(item.id)"
            >
              <v-icon icon="mdi-delete-outline"></v-icon>
              <v-tooltip activator="parent" location="top">Delete</v-tooltip>
            </v-btn>
          </div>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div
            class="d-flex flex-column flex-md-row align-center justify-space-between pt-8 border-t-cream"
          >
            <div
              class="text-caption text-brown-lighten-1 font-weight-bold mb-4 mb-md-0"
            >
              {{ t("showing") }}
              <span class="text-brown-darken-3"
                >{{ offset + 1 }}-{{ Math.min(offset + limit, total) }}</span
              >
              {{ t("of") }}
              <span class="text-brown-darken-3">{{ total }}</span>
              {{ t("results") }}
            </div>

            <div class="d-flex gap-2 align-center">
              <v-btn
                icon
                variant="outlined"
                color="brown-lighten-3"
                size="small"
                rounded="lg"
                @click="prevPage"
                :disabled="offset === 0"
                class="mr-2"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                color="brown-darken-3"
                size="small"
                elevation="2"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 36px; height: 36px"
              >
                {{ Math.floor(offset / limit) + 1 }}
              </v-btn>

              <v-btn
                icon
                variant="outlined"
                color="brown-lighten-3"
                size="small"
                rounded="lg"
                @click="nextPage"
                :disabled="offset + limit >= total"
                class="ml-2"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEthnicGroupStore } from "@/stores/apiEthnicGroup";
import { hiddenId } from "@/utils/formatDate";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const search = ref("");

const limit = ref(10);
const offset = ref(0);

// const ethnicGroups = ref([]);

const ethnicGroupStore = useEthnicGroupStore();
const { fetchEthnicGroups } = ethnicGroupStore;
const { ethnicGroups, total } = storeToRefs(ethnicGroupStore);

const deleteItem = async (id: number) => {
  if (confirm(t("are_you_sure_delete"))) {
    await ethnicGroupStore.deleteEthnicGroup(id);
    fetchEthnicGroups(limit.value, offset.value);
  }
};

const nextPage = () => {
  if (offset.value + limit.value < total.value) {
    offset.value += limit.value;
    fetchEthnicGroups(limit.value, offset.value);
  }
};

const prevPage = () => {
  if (offset.value > 0) {
    offset.value -= limit.value;
    fetchEthnicGroups(limit.value, offset.value);
  }
};

onMounted(() => {
  fetchEthnicGroups(limit.value, offset.value);
});
const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("ethnic_group"), disabled: true, to: "/ethnic-group" },
];

const headers = [
  {
    title: t("id"),
    key: "id",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("name"), // Assuming 'name' key exists or using fallback
    key: "title",
    align: "start" as const,
    sortable: true,
  },

  {
    title: t("action"),
    key: "action",
    align: "start" as const,
    sortable: false,
  },
].map((h) => ({
  ...h,
  class:
    "text-caption font-weight-bold text-brown-lighten-1 pb-4 text-uppercase tracking-wider",
}));
</script>

<style scoped>
/* Cream UI Variables */
.dashboard-container {
  --cream-bg: #fafaf5;
  --cream-card: #ffffff;
  --cream-border: #efebe0;
  --text-primary: #4a4036;
}

.gap-4 {
  gap: 16px;
}
.gap-3 {
  gap: 12px;
}
.gap-2 {
  gap: 8px;
}

/* Bean Card Styling */
.bean-card {
  background-color: var(--cream-card);
  border: 1px solid var(--cream-border) !important;
  box-shadow: 0 4px 12px -2px rgba(166, 155, 140, 0.05) !important;
  transition: all 0.3s ease;
}

.bean-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(166, 155, 140, 0.1) !important;
  border-color: #e6dccd !important;
}

/* Table Styling */
:deep(.v-data-table) {
  background: transparent !important;
}

:deep(.v-data-table__tr:hover .v-data-table__td) {
  background-color: #fafaf8 !important; /* Soft Cream Hover */
}

:deep(.v-data-table__th) {
  background-color: transparent !important;
  border-bottom: 1px solid var(--cream-border) !important;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #f5f2eb !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  height: 72px !important;
}

/* Input Customization */
.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e6e0d4 !important;
}

.cream-input :deep(.v-field--focused .v-field__outline__start),
.cream-input :deep(.v-field--focused .v-field__outline__end),
.cream-input :deep(.v-field--focused .v-field__outline__notch) {
  border-color: #8d6e63 !important; /* Brown darken 1 */
  border-width: 1px !important;
}

/* Typography Tools */
.tracking-wide {
  letter-spacing: 0.05em;
}
.tracking-wider {
  letter-spacing: 0.08em;
}

.border-cream {
  border: 2px solid #ffffff;
}
.border-t-cream {
  border-top: 1px solid var(--cream-border);
}
.shadow-sm {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.bg-brown-lighten-5 {
  background-color: #efebe9 !important;
}
</style>
