<template>
  <v-container fluid class="pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">
          <span>Settings</span>
        </h1>
        <p class="text-body-2 text-grey-darken-1">
          Manage system settings and preferences
        </p>
      </div>
    </div>

    <!-- Settings Cards Grid -->
    <v-row>
      <!-- General Settings -->
      <v-col cols="12" md="6">
        <v-card
          class="rounded-xl pa-6"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center mb-4">
            <v-avatar color="blue-lighten-5" size="48" class="mr-3">
              <v-icon color="blue" size="24">mdi-cog</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-grey-darken-4">
                General Settings
              </h3>
              <p class="text-caption text-grey-darken-1">
                School information and system settings
              </p>
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <v-list class="bg-transparent">
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-school</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ຊື່ໂຮງຮຽນ</v-list-item-title
              >
              <v-list-item-subtitle>ມ.ສ ກາງໃໝ່</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="primary"
                ></v-btn>
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-map-marker</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ທີ່ຢູ່</v-list-item-title
              >
              <v-list-item-subtitle
                >ບ້ານ ກາງໃໝ່, ເມືອງ ໄຊທານີ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="primary"
                ></v-btn>
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-phone</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ເບີໂທລະສັບ</v-list-item-title
              >
              <v-list-item-subtitle>+856 20 5555 5555</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="primary"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Academic Settings -->
      <v-col cols="12" md="6">
        <v-card
          class="rounded-xl pa-6"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center mb-4">
            <v-avatar color="green-lighten-5" size="48" class="mr-3">
              <v-icon color="green" size="24">mdi-book-open-variant</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-grey-darken-4">
                ການຕັ້ງຄ່າວິຊາການ
              </h3>
              <p class="text-caption text-grey-darken-1">
                ປີການສຶກສາ ແລະ ພາກຮຽນ
              </p>
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <v-list class="bg-transparent">
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-calendar</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ປີການສຶກສາ</v-list-item-title
              >
              <v-list-item-subtitle>2024-2025</v-list-item-subtitle>
              <template v-slot:append>
                <v-chip color="success" size="small" label>ປັດຈຸບັນ</v-chip>
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-calendar-range</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ພາກຮຽນ</v-list-item-title
              >
              <v-list-item-subtitle>ພາກຮຽນ 1</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="primary"
                ></v-btn>
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-clock</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ວັນເປີດຮຽນ</v-list-item-title
              >
              <v-list-item-subtitle
                >01/09/2024 - 30/06/2025</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="primary"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Notification Settings -->
      <v-col cols="12" md="6">
        <v-card
          class="rounded-xl pa-6"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center mb-4">
            <v-avatar color="purple-lighten-5" size="48" class="mr-3">
              <v-icon color="purple" size="24">mdi-bell</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-grey-darken-4">
                ການແຈ້ງເຕືອນ
              </h3>
              <p class="text-caption text-grey-darken-1">ຕັ້ງຄ່າການແຈ້ງເຕືອນ</p>
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <v-list class="bg-transparent">
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-email</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ແຈ້ງເຕືອນອີເມວ</v-list-item-title
              >
              <v-list-item-subtitle
                >ຮັບການແຈ້ງເຕືອນທາງອີເມວ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-switch
                  v-model="emailNotifications"
                  color="primary"
                  hide-details
                  density="compact"
                ></v-switch>
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-message</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ແຈ້ງເຕືອນ SMS</v-list-item-title
              >
              <v-list-item-subtitle
                >ຮັບການແຈ້ງເຕືອນທາງ SMS</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-switch
                  v-model="smsNotifications"
                  color="primary"
                  hide-details
                  density="compact"
                ></v-switch>
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-bell-ring</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ແຈ້ງເຕືອນໃນລະບົບ</v-list-item-title
              >
              <v-list-item-subtitle
                >ຮັບການແຈ້ງເຕືອນໃນລະບົບ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-switch
                  v-model="pushNotifications"
                  color="primary"
                  hide-details
                  density="compact"
                ></v-switch>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Security Settings -->
      <v-col cols="12" md="6">
        <v-card
          class="rounded-xl pa-6"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center mb-4">
            <v-avatar color="orange-lighten-5" size="48" class="mr-3">
              <v-icon color="orange" size="24">mdi-shield-lock</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-grey-darken-4">
                ຄວາມປອດໄພ
              </h3>
              <p class="text-caption text-grey-darken-1">ການຕັ້ງຄ່າຄວາມປອດໄພ</p>
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <v-list class="bg-transparent">
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-key</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ປ່ຽນລະຫັດຜ່ານ</v-list-item-title
              >
              <v-list-item-subtitle
                >ປ່ຽນລະຫັດຜ່ານບັນຊີຂອງທ່ານ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  color="primary"
                  size="small"
                  class="text-none"
                  rounded="lg"
                  >ປ່ຽນ</v-btn
                >
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1"
                  >mdi-two-factor-authentication</v-icon
                >
              </template>
              <v-list-item-title class="font-weight-medium"
                >ການຢືນຢັນ 2 ຂັ້ນຕອນ</v-list-item-title
              >
              <v-list-item-subtitle
                >ເພີ່ມຄວາມປອດໄພໃຫ້ບັນຊີ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-switch
                  v-model="twoFactorAuth"
                  color="primary"
                  hide-details
                  density="compact"
                ></v-switch>
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-history</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ປະຫວັດການເຂົ້າສູ່ລະບົບ</v-list-item-title
              >
              <v-list-item-subtitle
                >ເບິ່ງປະຫວັດການເຂົ້າສູ່ລະບົບ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  color="grey-darken-1"
                  size="small"
                  class="text-none"
                  rounded="lg"
                  >ເບິ່ງ</v-btn
                >
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Language & Theme -->
      <v-col cols="12" md="6">
        <v-card
          class="rounded-xl pa-6"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center mb-4">
            <v-avatar color="indigo-lighten-5" size="48" class="mr-3">
              <v-icon color="indigo" size="24">mdi-palette</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-grey-darken-4">
                ພາສາ & ຮູບແບບ
              </h3>
              <p class="text-caption text-grey-darken-1">
                ປັບແຕ່ງພາສາ ແລະ ຮູບແບບ
              </p>
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <v-list class="bg-transparent">
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-translate</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ພາສາ</v-list-item-title
              >
              <v-list-item-subtitle>ເລືອກພາສາທີ່ໃຊ້ງານ</v-list-item-subtitle>
              <template v-slot:append>
                <v-select
                  v-model="selectedLanguage"
                  :items="['ລາວ', 'English']"
                  variant="outlined"
                  density="compact"
                  hide-details
                  rounded="lg"
                  style="width: 120px"
                ></v-select>
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-theme-light-dark</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ໂໝດມືດ</v-list-item-title
              >
              <v-list-item-subtitle>ເປີດ/ປິດ ໂໝດມືດ</v-list-item-subtitle>
              <template v-slot:append>
                <v-switch
                  v-model="darkMode"
                  color="primary"
                  hide-details
                  density="compact"
                ></v-switch>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Backup & Data -->
      <v-col cols="12" md="6">
        <v-card
          class="rounded-xl pa-6"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center mb-4">
            <v-avatar color="teal-lighten-5" size="48" class="mr-3">
              <v-icon color="teal" size="24">mdi-database</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-grey-darken-4">
                ຂໍ້ມູນ & ສຳຮອງ
              </h3>
              <p class="text-caption text-grey-darken-1">
                ສຳຮອງ ແລະ ກູ້ຄືນຂໍ້ມູນ
              </p>
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <v-list class="bg-transparent">
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-cloud-upload</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ສຳຮອງຂໍ້ມູນ</v-list-item-title
              >
              <v-list-item-subtitle
                >ສຳຮອງລ້າສຸດ: 15/12/2024</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  color="primary"
                  size="small"
                  class="text-none"
                  rounded="lg"
                  >ສຳຮອງ</v-btn
                >
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-cloud-download</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ກູ້ຄືນຂໍ້ມູນ</v-list-item-title
              >
              <v-list-item-subtitle>ກູ້ຄືນຈາກໄຟລ໌ສຳຮອງ</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  color="grey-darken-1"
                  size="small"
                  class="text-none"
                  rounded="lg"
                  >ກູ້ຄືນ</v-btn
                >
              </template>
            </v-list-item>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-delete-sweep</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium"
                >ລ້າງຂໍ້ມູນ Cache</v-list-item-title
              >
              <v-list-item-subtitle
                >ລ້າງຂໍ້ມູນ cache ເພື່ອເພີ່ມປະສິດທິພາບ</v-list-item-subtitle
              >
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  color="error"
                  size="small"
                  class="text-none"
                  rounded="lg"
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
.gap-3 {
  gap: 12px;
}
</style>
