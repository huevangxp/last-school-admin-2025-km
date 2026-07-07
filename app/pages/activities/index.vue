<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <div class="text-title mb-1">{{ $t("activities") }}</div>
        <div class="text-detail">Manage school activities & events.</div>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          @click="openCreate"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in activityStats" :key="i">
        <v-card
          class="metric-card pa-4 d-flex flex-column justify-space-between h-100"
          elevation="0"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p class="text-detail-tiny mb-1">{{ stat.label }}</p>
              <h2 class="text-title">{{ stat.value }}</h2>
            </div>
            <v-avatar
              :color="`${stat.color}-lighten-5`"
              rounded="lg"
              size="40"
              class="metric-icon-box"
            >
              <v-icon :color="`${stat.color}-darken-2`" size="18">{{
                stat.icon
              }}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="$t('search')"
          variant="outlined"
          density="compact"
          hide-details
          class="cream-input"
          style="max-width: 320px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="lg"
        ></v-text-field>
      </div>

      <v-data-table
        :headers="headers"
        :items="activityStore.activities"
        :search="search"
        :loading="activityStore.loading"
        class="premium-table"
        hover
      >
        <template v-slot:no-data>
          <div class="text-detail py-8 text-center">No activities yet.</div>
        </template>

        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="purple-lighten-5"
              size="32"
              class="mr-3 elevation-1 border-white"
              rounded="lg"
            >
              <v-icon icon="mdi-calendar-star" size="16" color="purple-darken-2"></v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.title }}</div>
              <div class="text-detail-tiny text-truncate" style="max-width: 320px">
                {{ item.description }}
              </div>
            </div>
          </div>
        </template>

        <template v-slot:item.location="{ item }">
          <div class="text-title-small">{{ item.location || "—" }}</div>
        </template>

        <template v-slot:item.activity_date="{ item }">
          <div class="text-title-small">
            {{ item.activity_date ? formatDate(item.activity_date) : "—" }}
          </div>
        </template>

        <template v-slot:item.activity_status="{ item }">
          <v-chip
            :color="item.activity_status === 'active' ? 'success' : 'grey'"
            size="x-small"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.activity_status === "active" ? "Active" : "Hidden" }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn
              icon="mdi-pencil-outline"
              variant="text"
              size="x-small"
              color="primary"
              @click="openEdit(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              size="x-small"
              color="error"
              @click="removeItem(item)"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create / Edit Dialog -->
    <v-dialog v-model="dialog" width="560">
      <v-card rounded="xl" class="pa-6">
        <div class="text-title mb-4">
          {{ isEdit ? t("edit") : t("add") }} {{ $t("activities") }}
        </div>

        <label class="text-detail-tiny mb-1 d-block">{{ t("title") }}</label>
        <v-text-field
          v-model="form.title"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-3"
        ></v-text-field>

        <label class="text-detail-tiny mb-1 d-block">{{ t("description") }}</label>
        <v-textarea
          v-model="form.description"
          variant="outlined"
          density="compact"
          rounded="lg"
          rows="4"
          hide-details
          class="mb-3"
        ></v-textarea>

        <v-row>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{ t("location") }}</label>
            <v-text-field
              v-model="form.location"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{ t("activity_date") }}</label>
            <v-text-field
              v-model="form.activity_date"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <label class="text-detail-tiny mb-1 mt-3 d-block">{{ t("status") }}</label>
        <v-select
          v-model="form.activity_status"
          :items="statusOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
        ></v-select>

        <v-alert
          v-if="formError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ formError }}</v-alert
        >

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="dialog = false">{{ t("cancel") }}</v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="saving"
            @click="save"
            >{{ t("save") }}</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useActivityStore } from "~/stores/apiActivity";
import { formatDate } from "@/utils/formatDate";

const { t } = useI18n();
const activityStore = useActivityStore();

const search = ref("");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("activities"), disabled: true, to: "/activities" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Hidden", value: "inactive" },
];

const headers = [
  { title: t("title"), key: "title", align: "start" as const, sortable: true },
  { title: t("location"), key: "location", align: "start" as const, sortable: true },
  { title: t("activity_date"), key: "activity_date", align: "start" as const, sortable: true },
  { title: t("status"), key: "activity_status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const activityStats = computed(() => [
  {
    label: "Total Activities",
    value: String(activityStore.activities.length),
    icon: "mdi-calendar-star",
    color: "purple",
  },
  {
    label: "Active",
    value: String(
      activityStore.activities.filter((a) => a.activity_status === "active").length
    ),
    icon: "mdi-check-circle-outline",
    color: "green",
  },
  {
    label: "Hidden",
    value: String(
      activityStore.activities.filter((a) => a.activity_status !== "active").length
    ),
    icon: "mdi-eye-off-outline",
    color: "orange",
  },
]);

// ---- Create / Edit ----
const dialog = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const formError = ref("");
const form = ref({
  id: "",
  title: "",
  description: "",
  location: "",
  activity_date: "",
  activity_status: "active",
});

const resetForm = () => {
  form.value = {
    id: "",
    title: "",
    description: "",
    location: "",
    activity_date: "",
    activity_status: "active",
  };
  formError.value = "";
};

const openCreate = () => {
  resetForm();
  isEdit.value = false;
  dialog.value = true;
};

const openEdit = (item: any) => {
  formError.value = "";
  isEdit.value = true;
  form.value = {
    id: item.id,
    title: item.title,
    description: item.description,
    location: item.location || "",
    activity_date: item.activity_date
      ? String(item.activity_date).substring(0, 10)
      : "",
    activity_status: item.activity_status || "active",
  };
  dialog.value = true;
};

const save = async () => {
  if (!form.value.title || !form.value.description) {
    formError.value = "Title and description are required.";
    return;
  }
  saving.value = true;
  try {
    const payload = {
      title: form.value.title,
      description: form.value.description,
      location: form.value.location || null,
      activity_date: form.value.activity_date || null,
      activity_status: form.value.activity_status,
    };
    if (isEdit.value) {
      await activityStore.updateActivity(form.value.id, payload);
    } else {
      await activityStore.createActivity(payload);
    }
    dialog.value = false;
    await activityStore.fetchActivities();
  } catch (error: any) {
    formError.value = error.response?.data?.message || "Failed to save.";
  } finally {
    saving.value = false;
  }
};

const removeItem = async (item: any) => {
  if (!confirm(t("are_you_sure_delete"))) return;
  try {
    await activityStore.deleteActivity(item.id);
    await activityStore.fetchActivities();
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  activityStore.fetchActivities();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.metric-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}

.metric-icon-box {
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}

.premium-table {
  background: transparent !important;
}

:deep(.v-data-table__th) {
  background-color: #f8fafc !important;
  border-bottom: 1px solid #f1f5f9 !important;
  height: 48px !important;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #f1f5f9 !important;
  height: 60px !important;
}

.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.border-white {
  border: 1.5px solid #ffffff;
}
</style>
