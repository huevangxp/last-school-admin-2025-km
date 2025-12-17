<template>
  <v-container fluid class="pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">
          <span>Manage Financial</span>
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
          Export
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6"
          height="40"
          rounded="lg"
          elevation="0"
          prepend-icon="mdi-plus"
          to="/financial/add"
        >
          Add
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span>ລາຍຮັບທັງໝົດ</span>
              </p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">
                <span>₭45.2M</span>
              </h2>
            </div>
            <v-avatar color="green-lighten-5" size="56">
              <v-icon color="green" size="28">mdi-cash-plus</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span>ລາຍຈ່າຍທັງໝົດ</span>
              </p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">
                <span>₭28.7M</span>
              </h2>
            </div>
            <v-avatar color="red-lighten-5" size="56">
              <v-icon color="red" size="28">mdi-cash-minus</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span>ຍອດຄົງເຫຼືອ</span>
              </p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">
                <span>₭16.5M</span>
              </h2>
            </div>
            <v-avatar color="purple-lighten-5" size="56">
              <v-icon color="purple" size="28">mdi-wallet</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span>ຄ້າງຊຳລະ</span>
              </p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">
                <span>15</span>
              </h2>
            </div>
            <v-avatar color="orange-lighten-5" size="56">
              <v-icon color="orange" size="28">mdi-clock-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card flat class="rounded-xl border pa-6" color="white">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-4"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search"
          variant="outlined"
          density="compact"
          hide-details
          class="search-field"
          style="max-width: 400px"
          bg-color="white"
          color="primary"
          rounded="lg"
        ></v-text-field>

        <div class="d-flex gap-3 align-center flex-wrap">
          <v-select
            :items="['ທັງໝົດ', 'ລາຍຮັບ', 'ລາຍຈ່າຍ']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 150px"
            prepend-inner-icon="mdi-filter-variant"
          ></v-select>

          <v-select
            :items="['ທັງໝົດ', 'ຊຳລະແລ້ວ', 'ຄ້າງຊຳລະ', 'ຍົກເລີກ']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 150px"
          ></v-select>

          <v-btn
            variant="outlined"
            color="grey-darken-1"
            class="text-none"
            height="40"
            rounded="lg"
            icon="mdi-dots-horizontal"
            style="border-color: #e0e0e0"
          ></v-btn>
        </div>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="transactions"
        :search="search"
        class="financial-table"
        hover
      >
        <!-- Transaction ID Slot -->
        <template v-slot:item.id="{ item }">
          <span class="font-weight-medium text-grey-darken-3">{{
            item.id
          }}</span>
        </template>

        <!-- Description Slot -->
        <template v-slot:item.description="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              :color="
                item.type === 'income' ? 'green-lighten-5' : 'red-lighten-5'
              "
              size="40"
              class="mr-3"
            >
              <v-icon
                :color="item.type === 'income' ? 'green' : 'red'"
                size="20"
              >
                {{ item.type === "income" ? "mdi-arrow-down" : "mdi-arrow-up" }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-grey-darken-4">
                {{ item.description }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ item.category }}
              </div>
            </div>
          </div>
        </template>

        <!-- Amount Slot -->
        <template v-slot:item.amount="{ item }">
          <span
            :class="item.type === 'income' ? 'text-success' : 'text-error'"
            class="font-weight-bold"
          >
            {{ item.type === "income" ? "+" : "-" }}₭{{ item.amount }}
          </span>
        </template>

        <!-- Date Slot -->
        <template v-slot:item.date="{ item }">
          <div>
            <div class="font-weight-medium text-grey-darken-3">
              {{ item.date }}
            </div>
            <div class="text-caption text-grey-darken-1">{{ item.time }}</div>
          </div>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="
              item.status === 'ຊຳລະແລ້ວ'
                ? 'success'
                : item.status === 'ຄ້າງຊຳລະ'
                ? 'warning'
                : 'grey'
            "
            size="small"
            class="font-weight-medium"
            label
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-2 justify-end">
            <v-btn
              icon="mdi-eye-outline"
              variant="text"
              color="grey-darken-1"
              size="small"
            ></v-btn>
            <v-btn
              icon="mdi-pencil-outline"
              variant="text"
              color="grey-darken-1"
              size="small"
            ></v-btn>
          </div>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-6">
            <div class="text-body-2 text-grey-darken-1">
              Showing <strong>1</strong> to
              <strong>{{ transactions.length }}</strong> of
              <strong>{{ transactions.length }}</strong> results
            </div>
            <div class="d-flex gap-2 align-center">
              <v-btn icon variant="text" color="grey-darken-1" size="small">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                size="small"
                elevation="0"
                class="font-weight-bold"
                style="min-width: 32px; height: 32px"
                >1</v-btn
              >
              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-medium"
                style="min-width: 32px; height: 32px"
                >2</v-btn
              >
              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-medium"
                style="min-width: 32px; height: 32px"
                >3</v-btn
              >
              <v-btn icon variant="text" color="grey-darken-1" size="small">
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
const { t } = useI18n();
const search = ref("");

const breadcrumbs = [
  { title: "Dashboard", disabled: false, to: "/" },
  { title: "Financial", disabled: true, to: "/financial" },
];

const headers = [
  { title: "ລະຫັດ", key: "id", align: "start" as const, sortable: true },
  {
    title: "ລາຍລະອຽດ",
    key: "description",
    align: "start" as const,
    sortable: true,
  },
  {
    title: "ຈຳນວນເງິນ",
    key: "amount",
    align: "start" as const,
    sortable: true,
  },
  { title: "ວັນທີ", key: "date", align: "start" as const, sortable: true },
  { title: "ສະຖານະ", key: "status", align: "start" as const, sortable: true },
  {
    title: "Actions",
    key: "actions",
    align: "end" as const,
    sortable: false,
  },
].map((h) => ({
  ...h,
  class: "text-caption font-weight-bold text-grey-darken-1 pb-4",
}));

const transactions = ref([
  {
    id: "#TXN-001",
    description: "ຄ່າຮຽນ - ນັກຮຽນໃໝ່",
    category: "ຄ່າຮຽນ",
    type: "income",
    amount: "2,500,000",
    date: "15/12/2024",
    time: "09:30",
    status: "ຊຳລະແລ້ວ",
  },
  {
    id: "#TXN-002",
    description: "ເງິນເດືອນຄູ",
    category: "ເງິນເດືອນ",
    type: "expense",
    amount: "8,000,000",
    date: "14/12/2024",
    time: "14:00",
    status: "ຊຳລະແລ້ວ",
  },
  {
    id: "#TXN-003",
    description: "ຄ່າອຸປະກອນການສອນ",
    category: "ອຸປະກອນ",
    type: "expense",
    amount: "1,200,000",
    date: "13/12/2024",
    time: "11:15",
    status: "ຊຳລະແລ້ວ",
  },
  {
    id: "#TXN-004",
    description: "ຄ່າຮຽນ - ພາກຮຽນ 2",
    category: "ຄ່າຮຽນ",
    type: "income",
    amount: "3,000,000",
    date: "12/12/2024",
    time: "10:00",
    status: "ຄ້າງຊຳລະ",
  },
  {
    id: "#TXN-005",
    description: "ຄ່າໄຟຟ້າ",
    category: "ສາທາລະນູປະໂພກ",
    type: "expense",
    amount: "500,000",
    date: "11/12/2024",
    time: "16:30",
    status: "ຊຳລະແລ້ວ",
  },
]);
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
  height: 64px !important;
}
:deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
</style>
