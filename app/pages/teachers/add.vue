<template>
  <v-container fluid class="dashboard-container pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <!-- Identity + Account -->
      <v-card class="intelligence-card pa-6 mb-6" elevation="0">
        <div class="d-flex align-center mb-6">
          <v-avatar color="primary-lighten-5" size="40" class="mr-3 rounded-lg">
            <v-icon color="primary" size="20">mdi-account-tie-outline</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-title">{{ t("information") }}</h2>
            <p class="text-detail">Teacher identity & login</p>
          </div>
        </div>

        <v-row class="ga-y-2">
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("firstname") }} *</label
            >
            <v-text-field
              v-model="form.firstName"
              placeholder="e.g. ສົມໃຈ"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("lastname") }} *</label
            >
            <v-text-field
              v-model="form.lastName"
              placeholder="e.g. ພົມມະ"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("username") }} *</label
            >
            <v-text-field
              v-model="form.username"
              placeholder="Login username"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("password") }} *</label
            >
            <v-text-field
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("gender") }} *</label
            >
            <v-select
              v-model="form.gender"
              :items="genderOptions"
              placeholder="Select"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{ t("dob") }} *</label>
            <v-text-field
              v-model="form.dob"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block">{{ t("phone") }}</label>
            <v-text-field
              v-model="form.phone"
              placeholder="+856 20 ..."
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ t("role") }} *</label
            >
            <v-select
              v-model="form.role"
              :items="roleOptions"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              class="premium-input"
              color="primary"
            ></v-select>
          </v-col>

          <v-col cols="12" v-if="errorMessage">
            <v-alert type="error" variant="tonal" density="compact">{{
              errorMessage
            }}</v-alert>
          </v-col>
        </v-row>
      </v-card>

      <div class="d-flex justify-end ga-3">
        <v-btn
          variant="flat"
          color="grey-lighten-4"
          class="modern-action-btn secondary border text-slate-700"
          height="42"
          @click="$router.back()"
        >
          {{ t("cancel") }}
        </v-btn>
        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="42"
          type="submit"
          :loading="loading"
        >
          {{ t("save") }}
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTeacherStore } from "~/stores/apiTeacher";

const { t } = useI18n();
const router = useRouter();
const teacherStore = useTeacherStore();
const loading = ref(false);
const errorMessage = ref("");
const formRef = ref();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("teachers"), disabled: false, to: "/teachers" },
  { title: t("add"), disabled: true, to: "/teachers/add" },
];

const form = ref({
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  gender: null,
  dob: "",
  phone: "",
  role: "teacher",
});

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
];

const roleOptions = [
  { title: "Teacher", value: "teacher" },
  { title: "Admin", value: "admin" },
];

const rules = {
  required: (v: any) => !!v || t("required"),
};

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const f = form.value;
  loading.value = true;
  try {
    await teacherStore.createTeacher({
      full_name: `${f.firstName} ${f.lastName}`.trim(),
      username: f.username,
      password: f.password,
      gender: f.gender,
      dob: f.dob,
      phone_number: f.phone,
      role: f.role,
      avatar: "https://picsum.photos/200",
      status: "active",
    });
    router.push("/teachers");
  } catch (error: any) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || "Failed to create teacher.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1000px;
  margin: 0 auto;
}

.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}

.modern-action-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  padding: 0 20px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}

.premium-input :deep(.v-field__outline__start),
.premium-input :deep(.v-field__outline__end),
.premium-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.premium-input :deep(.v-field--focused .v-field__outline__start),
.premium-input :deep(.v-field--focused .v-field__outline__end),
.premium-input :deep(.v-field--focused .v-field__outline__notch) {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 1.5px !important;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
