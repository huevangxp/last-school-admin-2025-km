<template>
  <v-container fluid class="pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">
          <span> {{ $t("management") }} {{ $t("ethnic_group") }}</span>
        </h1>
      </div>

      <div class="d-flex gap-3 align-center flex-wrap">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="text-none"
          height="40"
          rounded="lg"
          prepend-icon="mdi-download"
          style="border-color: #e0e0e0"
        >
          {{ $t("export") }}
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6"
          height="40"
          rounded="lg"
          elevation="0"
          prepend-icon="mdi-plus"
          to="/ethnic-group/add"
        >
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-4" elevation="0" style="max-width: 800px">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span>{{ $t("total") }}</span>
              </p>
              <h4 class="text-h5 font-weight-bold text-grey-darken-4">
                <span>{{ total }}</span>
              </h4>
            </div>
            <v-avatar color="blue-lighten-5" size="56">
              <v-icon color="blue" size="28">mdi-account-group</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card flat class="rounded-xl pa-6" color="white" elevation="0">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-4"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          :placeholder="$t('search')"
          density="comfortable"
          hide-details
          class="search-field transparent-border"
          style="max-width: 400px"
          bg-color="white"
          color="primary"
          rounded="lg"
          border="none"
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
        <!-- Name Slot -->
        <template v-slot:item.id="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="primary-lighten-5"
              size="48"
              class="mr-3 rounded-lg"
            >
              <v-icon
                icon="mdi-account-group-outline"
                size="24"
                color="primary"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="text-grey-darken-4">
                <p class="font-weight-bold">{{ item.title }}</p>
                <span class="text-uppercase">{{
                  hiddenId(String(item.id))
                }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Action Slot -->
        <template v-slot:item.action="{ item }">
          <v-btn
            icon
            size="small"
            variant="text"
            color="primary"
            :to="`/ethnic-group/${item.id}`"
          >
            <v-icon icon="mdi-pencil"></v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            variant="text"
            color="error"
            @click="deleteItem(item.id)"
          >
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-6">
            <div class="text-body-2 text-grey-darken-1">
              <span>{{ $t("showing") }}</span>
              <strong class="px-2">{{ offset + 1 }}</strong>
              <span> {{ $t("to") }} </span>
              <strong class="px-2">{{ offset + ethnicGroups.length }}</strong>
              <span> {{ $t("of") }} </span>
              <strong class="px-2">{{ total }}</strong>
              <span> {{ $t("results") }} </span>
            </div>
            <div class="d-flex gap-2 align-center">
              <v-btn
                icon
                variant="text"
                color="grey-darken-1"
                size="small"
                @click="prevPage"
                :disabled="offset === 0"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                color="primary"
                size="small"
                elevation="0"
                class="font-weight-bold"
                style="min-width: 32px; height: 32px"
              >
                {{ Math.floor(offset / limit) + 1 }}
              </v-btn>

              <v-btn
                icon
                variant="text"
                color="grey-darken-1"
                size="small"
                @click="nextPage"
                :disabled="offset + limit >= total"
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
  class: "text-caption font-weight-bold text-grey-darken-1 pb-4",
}));
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}
.gap-3 {
  gap: 12px;
}
.gap-2 {
  gap: 8px;
}

/* Customizing Table Styles */
:deep(.v-data-table) {
  background: transparent !important;
}

:deep(.v-data-table__tr:hover .v-data-table__td) {
  background-color: #f5f7fa !important;
}

:deep(.v-data-table__th) {
  background-color: transparent !important;
  border-bottom: 1px solid #eeeeee !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #f5f5f5 !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  height: 60px !important;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
</style>
