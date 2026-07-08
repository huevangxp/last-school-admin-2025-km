<template>
  <v-container fluid class="pa-4 pa-md-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div class="d-flex align-center mb-6">
      <v-avatar color="cyan-lighten-5" size="44" class="mr-3 rounded-0">
        <v-icon color="cyan-darken-2" size="22">mdi-email-outline</v-icon>
      </v-avatar>
      <div>
        <div class="text-title">{{ t("contact_messages") }}</div>
        <div class="text-detail">{{ t("contact-inbox-subtitle") }}</div>
      </div>
    </div>

    <!-- Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="metric-card pa-4 h-100" elevation="0">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-detail-tiny mb-1">{{ t("total-messages") }}</p>
              <h2 class="text-title">{{ contactStore.contacts.length }}</h2>
            </div>
            <v-avatar color="cyan-lighten-5" rounded="0" size="40">
              <v-icon color="cyan-darken-2" size="18">mdi-email-multiple-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="metric-card pa-4 h-100" elevation="0">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-detail-tiny mb-1">{{ t("unread") }}</p>
              <h2 class="text-title">{{ unreadCount }}</h2>
            </div>
            <v-avatar color="deep-orange-lighten-5" rounded="0" size="40">
              <v-icon color="deep-orange-darken-2" size="18">mdi-email-alert-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <div class="mb-4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('search')"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 320px"
          bg-color="white"
          color="primary"
          rounded="0"
        ></v-text-field>
      </div>

      <v-data-table
        :headers="headers"
        :items="contactStore.contacts"
        :search="search"
        :loading="contactStore.loading"
        class="premium-table"
        hover
        @click:row="onRowClick"
      >
        <template v-slot:no-data>
          <div class="text-detail py-8 text-center">
            {{ t("no-contact-messages") }}
          </div>
        </template>

        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-badge
              :model-value="item.status === 'unread'"
              color="deep-orange"
              dot
              offset-x="2"
              offset-y="2"
            >
              <v-avatar color="cyan-lighten-5" size="32" rounded="0">
                <v-icon icon="mdi-account-outline" size="16" color="cyan-darken-2"></v-icon>
              </v-avatar>
            </v-badge>
            <div class="ml-3">
              <div
                class="text-title-small"
                :class="{ 'font-weight-black': item.status === 'unread' }"
              >
                {{ item.name }}
              </div>
              <div class="text-detail-tiny">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.subject="{ item }">
          <div class="text-detail text-truncate" style="max-width: 320px">
            {{ item.subject || "—" }}
          </div>
        </template>

        <template v-slot:item.created_at="{ item }">
          <div class="text-detail-tiny">{{ formatDate(item.created_at) }}</div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'unread' ? 'deep-orange' : 'grey'"
            size="x-small"
            rounded="0"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status === "unread" ? t("unread") : t("read") }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn
              icon="mdi-eye-outline"
              variant="text"
              size="x-small"
              color="primary"
              @click.stop="openDetail(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              size="x-small"
              color="error"
              @click.stop="removeItem(item)"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Detail dialog -->
    <v-dialog v-model="dialog" width="560">
      <v-card v-if="selected" rounded="0" class="pa-6">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="text-title">{{ selected.subject || t("message") }}</div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="dialog = false"></v-btn>
        </div>

        <div class="d-flex align-center mb-4">
          <v-avatar color="cyan-lighten-5" size="40" rounded="0" class="mr-3">
            <v-icon icon="mdi-account-outline" color="cyan-darken-2"></v-icon>
          </v-avatar>
          <div>
            <div class="text-title-small">{{ selected.name }}</div>
            <div class="text-detail-tiny">
              {{ selected.email }}
              <span v-if="selected.phone"> · {{ selected.phone }}</span>
            </div>
          </div>
          <v-spacer></v-spacer>
          <div class="text-detail-tiny">{{ formatDate(selected.created_at) }}</div>
        </div>

        <v-divider class="mb-4"></v-divider>

        <div class="text-detail message-body mb-2">{{ selected.message }}</div>

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn
            variant="text"
            color="error"
            @click="removeItem(selected)"
          >
            {{ t("delete") }}
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="modern-action-btn primary"
            @click="toggleRead(selected)"
          >
            {{ selected.status === "read" ? t("mark_as_unread") : t("mark_as_read") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useContactStore } from "~/stores/apiContact";
import { useUiStore } from "~/stores/ui";
import { formatDate } from "@/utils/formatDate";

const { t } = useI18n();
const contactStore = useContactStore();
const ui = useUiStore();

const search = ref("");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("contact_messages"), disabled: true, to: "/contact" },
];

const headers = [
  { title: t("sender"), key: "name", align: "start" as const, sortable: true },
  { title: t("contact_subject"), key: "subject", align: "start" as const, sortable: false },
  { title: t("start_date"), key: "created_at", align: "start" as const, sortable: true },
  { title: t("status"), key: "status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const unreadCount = computed(
  () => contactStore.contacts.filter((c: any) => c.status === "unread").length
);

// ---- Detail ----
const dialog = ref(false);
const selected = ref<any>(null);

const openDetail = async (item: any) => {
  selected.value = item;
  dialog.value = true;
  // Opening an unread message marks it read.
  if (item.status === "unread") {
    try {
      await contactStore.markRead(item.id, "read");
      item.status = "read";
    } catch {
      /* non-fatal — the list just stays unread */
    }
  }
};

const onRowClick = (_event: any, row: any) => openDetail(row.item);

const toggleRead = async (item: any) => {
  const next = item.status === "read" ? "unread" : "read";
  try {
    await contactStore.markRead(item.id, next);
    item.status = next;
  } catch {
    ui.notify(t("failed-to-save"), "error");
  }
};

const removeItem = async (item: any) => {
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await contactStore.deleteContact(item.id);
    dialog.value = false;
    await contactStore.fetchContacts();
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify(t("failed-to-delete"), "error");
  }
};

onMounted(() => {
  contactStore.fetchContacts();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}
.metric-card {
  background: white;
  border: 1px solid #f1f5f9;
}
.intelligence-card {
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
  cursor: pointer;
}
.modern-action-btn {
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  padding: 0 12px !important;
}
.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}
.message-body {
  white-space: pre-line;
  line-height: 1.6;
}
</style>
