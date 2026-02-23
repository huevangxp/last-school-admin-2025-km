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
          Settings
        </h1>
        <p class="text-body-2 text-grey-darken-1 font-weight-medium">
          Manage system preferences and configurations.
        </p>
      </div>
    </div>

    <!-- Settings Cards Grid -->
    <v-row>
      <!-- General Settings -->
      <v-col cols="12" md="6">
        <v-card class="bean-card pa-6 h-100" elevation="0" rounded="xl">
          <div class="d-flex align-center mb-6">
            <v-avatar
              color="blue-lighten-5"
              size="52"
              class="mr-4 rounded-lg icon-box"
            >
              <v-icon color="blue-darken-2" size="26">mdi-cog-outline</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-secondary">
                General Settings
              </h3>
              <p class="text-caption text-grey-darken-1 font-weight-medium">
                School information and system settings
              </p>
            </div>
          </div>

          <v-divider class="mb-4 border-subtle"></v-divider>

          <v-list class="bg-transparent" lines="two">
            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-school-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ຊື່ໂຮງຮຽນ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ມ.ສ ກາງໃໝ່</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil-outline"
                  variant="text"
                  size="small"
                  color="grey"
                ></v-btn>
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-map-marker-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ທີ່ຢູ່</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ບ້ານ ກາງໃໝ່, ເມືອງ ໄຊທານີ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil-outline"
                  variant="text"
                  size="small"
                  color="grey"
                ></v-btn>
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20">mdi-phone-outline</v-icon>
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ເບີໂທລະສັບ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >+856 20 5555 5555</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil-outline"
                  variant="text"
                  size="small"
                  color="grey"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Academic Settings -->
      <v-col cols="12" md="6">
        <v-card class="bean-card pa-6 h-100" elevation="0" rounded="xl">
          <div class="d-flex align-center mb-6">
            <v-avatar
              color="green-lighten-5"
              size="52"
              class="mr-4 rounded-lg icon-box"
            >
              <v-icon color="green-darken-2" size="26"
                >mdi-book-open-page-variant-outline</v-icon
              >
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-secondary">
                ການຕັ້ງຄ່າວິຊາການ
              </h3>
              <p class="text-caption text-grey-darken-1 font-weight-medium">
                ປີການສຶກສາ ແລະ ພາກຮຽນ
              </p>
            </div>
          </div>

          <v-divider class="mb-4 border-subtle"></v-divider>

          <v-list class="bg-transparent" lines="two">
            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-calendar-month-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ປີການສຶກສາ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >2024-2025</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-chip
                  color="green-lighten-4"
                  class="text-green-darken-3 font-weight-bold"
                  size="small"
                  variant="flat"
                  label
                  >ປັດຈຸບັນ</v-chip
                >
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-calendar-range-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ພາກຮຽນ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ພາກຮຽນ 1</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil-outline"
                  variant="text"
                  size="small"
                  color="grey"
                ></v-btn>
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-clock-time-four-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ວັນເປີດຮຽນ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >01/09/2024 - 30/06/2025</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil-outline"
                  variant="text"
                  size="small"
                  color="grey"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Notification Settings -->
      <v-col cols="12" md="6">
        <v-card class="bean-card pa-6 h-100" elevation="0" rounded="xl">
          <div class="d-flex align-center mb-6">
            <v-avatar
              color="purple-lighten-5"
              size="52"
              class="mr-4 rounded-lg icon-box"
            >
              <v-icon color="purple-darken-2" size="26"
                >mdi-bell-outline</v-icon
              >
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-secondary">
                ການແຈ້ງເຕືອນ
              </h3>
              <p class="text-caption text-grey-darken-1 font-weight-medium">
                ຕັ້ງຄ່າການແຈ້ງເຕືອນ
              </p>
            </div>
          </div>

          <v-divider class="mb-4 border-subtle"></v-divider>

          <v-list class="bg-transparent" lines="two">
            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20">mdi-email-outline</v-icon>
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ແຈ້ງເຕືອນອີເມວ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ຮັບການແຈ້ງເຕືອນທາງອີເມວ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-switch
                  v-model="emailNotifications"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                  class="cream-switch"
                ></v-switch>
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-message-text-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ແຈ້ງເຕືອນ SMS</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ຮັບການແຈ້ງເຕືອນທາງ SMS</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-switch
                  v-model="smsNotifications"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                  class="cream-switch"
                ></v-switch>
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-bell-ring-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ແຈ້ງເຕືອນໃນລະບົບ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ຮັບການແຈ້ງເຕືອນໃນລະບົບ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-switch
                  v-model="pushNotifications"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                  class="cream-switch"
                ></v-switch>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Security Settings -->
      <v-col cols="12" md="6">
        <v-card class="bean-card pa-6 h-100" elevation="0" rounded="xl">
          <div class="d-flex align-center mb-6">
            <v-avatar
              color="orange-lighten-5"
              size="52"
              class="mr-4 rounded-lg icon-box"
            >
              <v-icon color="orange-darken-2" size="26"
                >mdi-shield-lock-outline</v-icon
              >
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-secondary">ຄວາມປອດໄພ</h3>
              <p class="text-caption text-grey-darken-1 font-weight-medium">
                ການຕັ້ງຄ່າຄວາມປອດໄພ
              </p>
            </div>
          </div>

          <v-divider class="mb-4 border-subtle"></v-divider>

          <v-list class="bg-transparent" lines="two">
            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20">mdi-key-outline</v-icon>
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ປ່ຽນລະຫັດຜ່ານ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ປ່ຽນລະຫັດຜ່ານບັນຊີຂອງທ່ານ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  color="grey-darken-1"
                  size="small"
                  class="text-none font-weight-bold"
                  rounded="lg"
                  border
                  >ປ່ຽນ</v-btn
                >
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-two-factor-authentication</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ການຢືນຢັນ 2 ຂັ້ນຕອນ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ເພີ່ມຄວາມປອດໄພໃຫ້ບັນຊີ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-switch
                  v-model="twoFactorAuth"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                  class="cream-switch"
                ></v-switch>
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20">mdi-history</v-icon>
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ປະຫວັດການເຂົ້າສູ່ລະບົບ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ເບິ່ງປະຫວັດການເຂົ້າສູ່ລະບົບ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  color="grey-darken-1"
                  size="small"
                  class="text-none font-weight-bold"
                  rounded="lg"
                  border
                  >ເບິ່ງ</v-btn
                >
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Language & Theme -->
      <v-col cols="12" md="6">
        <v-card class="bean-card pa-6 h-100" elevation="0" rounded="xl">
          <div class="d-flex align-center mb-6">
            <v-avatar
              color="indigo-lighten-5"
              size="52"
              class="mr-4 rounded-lg icon-box"
            >
              <v-icon color="indigo-darken-2" size="26"
                >mdi-palette-outline</v-icon
              >
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-secondary">
                ພາສາ & ຮູບແບບ
              </h3>
              <p class="text-caption text-grey-darken-1 font-weight-medium">
                ປັບແຕ່ງພາສາ ແລະ ຮູບແບບ
              </p>
            </div>
          </div>

          <v-divider class="mb-4 border-subtle"></v-divider>

          <v-list class="bg-transparent" lines="two">
            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20">mdi-translate</v-icon>
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ພາສາ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ເລືອກພາສາທີ່ໃຊ້ງານ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-select
                  v-model="selectedLanguage"
                  :items="['ລາວ', 'English']"
                  variant="outlined"
                  density="compact"
                  hide-details
                  rounded="lg"
                  color="primary"
                  base-color="grey-lighten-1"
                  class="cream-select font-weight-bold"
                  style="width: 140px"
                ></v-select>
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-theme-light-dark</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ໂໝດມືດ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ເປີດ/ປິດ ໂໝດມືດ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-switch
                  v-model="darkMode"
                  color="primary"
                  hide-details
                  density="compact"
                  inset
                  class="cream-switch"
                ></v-switch>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Backup & Data -->
      <v-col cols="12" md="6">
        <v-card class="bean-card pa-6 h-100" elevation="0" rounded="xl">
          <div class="d-flex align-center mb-6">
            <v-avatar
              color="teal-lighten-5"
              size="52"
              class="mr-4 rounded-lg icon-box"
            >
              <v-icon color="teal-darken-2" size="26"
                >mdi-database-outline</v-icon
              >
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-secondary">
                ຂໍ້ມູນ & ສຳຮອງ
              </h3>
              <p class="text-caption text-grey-darken-1 font-weight-medium">
                ສຳຮອງ ແລະ ກູ້ຄືນຂໍ້ມູນ
              </p>
            </div>
          </div>

          <v-divider class="mb-4 border-subtle"></v-divider>

          <v-list class="bg-transparent" lines="two">
            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-cloud-upload-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ສຳຮອງຂໍ້ມູນ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ສຳຮອງລ້າສຸດ: 15/12/2024</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  color="grey-darken-1"
                  size="small"
                  class="text-none font-weight-bold"
                  rounded="lg"
                  border
                  >ສຳຮອງ</v-btn
                >
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-grey-lighten-4"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="secondary" size="20"
                    >mdi-cloud-download-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ກູ້ຄືນຂໍ້ມູນ</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ກູ້ຄືນຈາກໄຟລ໌ສຳຮອງ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  color="grey-darken-1"
                  size="small"
                  class="text-none font-weight-bold"
                  rounded="lg"
                  border
                  >ກູ້ຄືນ</v-btn
                >
              </template>
            </v-list-item>

            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <div
                  class="mr-4 d-flex align-center justify-center rounded bg-red-lighten-5"
                  style="width: 40px; height: 40px"
                >
                  <v-icon color="red-darken-2" size="20"
                    >mdi-delete-sweep-outline</v-icon
                  >
                </div>
              </template>
              <v-list-item-title
                class="font-weight-bold text-secondary text-body-2"
                >ລ້າງຂໍ້ມູນ Cache</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption text-grey-darken-1"
                >ລ້າງຂໍ້ມູນ cache ເພື່ອເພີ່ມປະສິດທິພາບ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  color="error"
                  size="small"
                  class="text-none font-weight-bold"
                  rounded="lg"
                  border
                  >ລ້າງ</v-btn
                >
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("settings"), disabled: true, to: "/settings" },
];

// Settings State
const emailNotifications = ref(true);
const smsNotifications = ref(false);
const pushNotifications = ref(true);
const twoFactorAuth = ref(false);
const darkMode = ref(false);
const selectedLanguage = ref("ລາວ");
</script>

<style scoped>
/* Cream UI Variables */
.dashboard-container {
  /* --cream-bg: #fafaf5; */
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

/* List Item Styling */
:deep(.v-list-item__prepend) {
  width: 56px;
}

/* Input Customization */
.cream-switch :deep(.v-switch__thumb) {
  background-color: #ffffff !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.cream-switch :deep(.v-switch__track) {
  background-color: #e2e8f0 !important;
  opacity: 1 !important;
}

.cream-switch.v-switch--active :deep(.v-switch__track) {
  background-color: rgb(var(--v-theme-primary)) !important;
}

/* Select Customization */
.cream-select :deep(.v-field__outline__start),
.cream-select :deep(.v-field__outline__end),
.cream-select :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

/* Divider */
.border-subtle {
  border-color: #f1f5f9 !important;
}

.icon-box {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}
</style>
