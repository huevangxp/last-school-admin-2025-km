<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8"
    >
      <div>
        <h1
          class="text-h4 font-weight-bold text-secondary mb-1"
          style="letter-spacing: -0.5px"
        >
          Manage Financial
        </h1>
        <p class="text-body-2 text-grey-darken-1 font-weight-medium">
          Track revenue, expenses, and transaction history.
        </p>
      </div>

      <div class="d-flex gap-3 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="text-none font-weight-bold"
          height="44"
          rounded="xl"
          prepend-icon="mdi-tray-arrow-down"
          border
        >
          Export
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6 font-weight-bold"
          height="44"
          rounded="xl"
          elevation="4"
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
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-grey text-uppercase mb-1 tracking-wide"
              >
                ລາຍຮັບທັງໝົດ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">₭45.2M</h2>
            </div>
            <v-avatar
              color="green-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="green-darken-2" size="26">mdi-cash-plus</v-icon>
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2">
            <v-icon
              icon="mdi-arrow-up-right"
              color="green-darken-1"
              size="16"
              class="mr-1"
            ></v-icon>
            <span class="text-caption font-weight-bold text-green-darken-2"
              >+12.5% this month</span
            >
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-grey text-uppercase mb-1 tracking-wide"
              >
                ລາຍຈ່າຍທັງໝົດ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">₭28.7M</h2>
            </div>
            <v-avatar
              color="red-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="red-darken-2" size="26">mdi-cash-minus</v-icon>
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2">
            <v-icon
              icon="mdi-arrow-down-right"
              color="red-darken-1"
              size="16"
              class="mr-1"
            ></v-icon>
            <span class="text-caption font-weight-bold text-red-darken-2"
              >+5.2% vs last month</span
            >
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-grey text-uppercase mb-1 tracking-wide"
              >
                ຍອດຄົງເຫຼືອ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">₭16.5M</h2>
            </div>
            <v-avatar
              color="purple-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="purple-darken-2" size="26"
                >mdi-wallet-outline</v-icon
              >
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2">
            <span class="text-caption font-weight-medium text-grey-darken-1"
              >Available balance</span
            >
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-grey text-uppercase mb-1 tracking-wide"
              >
                ຄ້າງຊຳລະ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">15</h2>
            </div>
            <v-avatar
              color="orange-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="orange-darken-2" size="26"
                >mdi-clock-time-four-outline</v-icon
              >
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2">
            <span
              class="text-caption font-weight-medium text-grey-darken-1 text-decoration-underline cursor-pointer"
              >View details</span
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
          placeholder="Search transactions..."
          variant="outlined"
          density="comfortable"
          hide-details
          class="cream-input"
          style="max-width: 380px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="lg"
        ></v-text-field>

        <div class="d-flex gap-3 align-center flex-wrap">
          <v-select
            :items="['ທັງໝົດ', 'ລາຍຮັບ', 'ລາຍຈ່າຍ']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            color="primary"
            base-color="grey-lighten-1"
            class="cream-select"
            style="min-width: 160px"
            prepend-inner-icon="mdi-filter-variant"
          ></v-select>

          <v-select
            :items="['ທັງໝົດ', 'ຊຳລະແລ້ວ', 'ຄ້າງຊຳລະ', 'ຍົກເລີກ']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            color="primary"
            base-color="grey-lighten-1"
            class="cream-select"
            style="min-width: 160px"
          ></v-select>

          <v-btn
            variant="outlined"
            color="grey-darken-1"
            class="text-none"
            height="40"
            rounded="lg"
            icon="mdi-dots-horizontal"
            border
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
          <span
            class="font-weight-bold text-secondary bg-grey-lighten-4 px-2 py-1 rounded text-caption"
            >{{ item.id }}</span
          >
        </template>

        <!-- Description Slot -->
        <template v-slot:item.description="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              :color="
                item.type === 'income' ? 'green-lighten-5' : 'red-lighten-5'
              "
              size="42"
              class="mr-3 border-cream shadow-sm"
              rounded="lg"
            >
              <v-icon
                :color="
                  item.type === 'income' ? 'green-darken-1' : 'red-darken-1'
                "
                size="22"
              >
                {{
                  item.type === "income"
                    ? "mdi-arrow-bottom-left"
                    : "mdi-arrow-top-right"
                }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-secondary">
                {{ item.description }}
              </div>
              <div class="text-caption text-grey-darken-1 font-weight-medium">
                {{ item.category }}
              </div>
            </div>
          </div>
        </template>

        <!-- Amount Slot -->
        <template v-slot:item.amount="{ item }">
          <span
            :class="
              item.type === 'income'
                ? 'text-green-darken-2'
                : 'text-red-darken-2'
            "
            class="font-weight-black text-body-1"
          >
            {{ item.type === "income" ? "+" : "-" }}₭{{ item.amount }}
          </span>
        </template>

        <!-- Date Slot -->
        <template v-slot:item.date="{ item }">
          <div>
            <div class="font-weight-bold text-secondary">
              {{ item.date }}
            </div>
            <div class="text-caption text-grey-darken-1 font-weight-medium">
              {{ item.time }}
            </div>
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
            class="font-weight-bold"
            variant="flat"
            label
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-1 justify-end">
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
          <div
            class="d-flex flex-column flex-md-row align-center justify-space-between pt-8 border-t"
          >
            <div
              class="text-caption text-grey-darken-1 font-weight-bold mb-4 mb-md-0"
            >
              Showing
              <span class="text-secondary">1-{{ transactions.length }}</span>
              of
              <span class="text-secondary">{{ transactions.length }}</span>
              results
            </div>
            <div class="d-flex gap-2 align-center">
              <v-btn
                icon
                variant="outlined"
                color="grey-lighten-1"
                size="small"
                rounded="lg"
                class="mr-2"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                size="small"
                elevation="2"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 36px; height: 36px"
                >1</v-btn
              >
              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 36px; height: 36px"
                >2</v-btn
              >
              <v-btn
                variant="text"
                color="grey-darken-1"
                size="small"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 36px; height: 36px"
                >3</v-btn
              >
              <v-btn
                icon
                variant="outlined"
                color="grey-lighten-1"
                size="small"
                rounded="lg"
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
  class:
    "text-caption font-weight-bold text-grey-darken-1 pb-4 text-uppercase tracking-wider",
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
/* Cream UI Variables */
.dashboard-container {
  /* --cream-bg: #fafaf5; */
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
  background-color: #ffffff;
  border: 1px solid #e2e8f0 !important;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
  transition: all 0.3s ease;
}

.bean-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.025) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

/* Table Styling */
:deep(.v-data-table) {
  background: transparent !important;
}

:deep(.v-data-table__tr:hover .v-data-table__td) {
  background-color: #f8fafc !important; /* Soft Slate Hover */
}

:deep(.v-data-table__th) {
  background-color: transparent !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #f1f5f9 !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  height: 72px !important;
}

/* Input Customization */
.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.cream-input :deep(.v-field--focused .v-field__outline__start),
.cream-input :deep(.v-field--focused .v-field__outline__end),
.cream-input :deep(.v-field--focused .v-field__outline__notch) {
  border-color: rgb(var(--v-theme-primary)) !important;
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
.border-t {
  border-top: 1px solid #e2e8f0;
}
.shadow-sm {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
