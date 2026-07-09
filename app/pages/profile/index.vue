<template>
  <v-container fluid class="dashboard-container pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <v-row class="ga-y-4">
        <!-- Identity card: avatar + read-only account facts -->
        <v-col cols="12" md="4">
          <v-card class="intelligence-card pa-6 text-center" elevation="0">
            <v-avatar size="120" color="primary-lighten-5" rounded="0" class="mb-4 elevation-1 mx-auto">
              <v-img v-if="avatarPreview" :src="avatarPreview" cover></v-img>
              <v-icon v-else color="primary" size="56">mdi-account</v-icon>
            </v-avatar>
            <div class="text-title mb-1 text-capitalize">
              {{ form.full_name || t("information") }}
            </div>
            <div class="text-detail mb-4">@{{ username }}</div>

            <div class="d-flex justify-center ga-2 mb-6">
              <v-chip
                color="primary"
                variant="flat"
                size="small"
                rounded="0"
                class="font-weight-black text-capitalize"
              >
                {{ t(roleKey) }}
              </v-chip>
              <v-chip
                :color="form.status === 'active' ? 'success' : 'grey'"
                variant="flat"
                size="small"
                rounded="0"
                class="font-weight-black text-uppercase"
              >
                {{ form.status === 'active' ? t('active') : t('inactive') }}
              </v-chip>
            </div>

            <label class="text-detail-tiny mb-2 d-block text-start">{{
              t("admin-profile-photo")
            }}</label>
            <ImagePicker v-model="form.avatar" :label="t('image')" />
            <div class="text-detail-tiny mt-1 text-start text-grey">
              {{ t("recommended-photo-size") }}
            </div>
          </v-card>
        </v-col>

        <!-- Editable personal details -->
        <v-col cols="12" md="8">
          <v-card class="intelligence-card pa-6" elevation="0">
            <div class="d-flex align-center mb-6">
              <v-avatar color="primary-lighten-5" size="40" class="mr-3 rounded-0">
                <v-icon color="primary" size="20">mdi-account-edit-outline</v-icon>
              </v-avatar>
              <div>
                <h2 class="text-title">{{ t("personal-information") }}</h2>
                <p class="text-detail">{{ t("my-profile-subtitle") }}</p>
              </div>
            </div>

            <div v-if="loadingData" class="py-10 text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>

            <v-row v-else class="ga-y-2">
              <v-col cols="12">
                <label class="text-detail-tiny mb-2 d-block">{{ t("name") }} *</label>
                <v-text-field
                  v-model="form.full_name"
                  :placeholder="t('enter-full-name')"
                  variant="outlined"
                  density="compact"
                  rounded="0"
                  hide-details="auto"
                  color="primary"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <label class="text-detail-tiny mb-2 d-block">{{ t("username") }}</label>
                <v-text-field
                  :model-value="username"
                  variant="outlined"
                  density="compact"
                  rounded="0"
                  hide-details="auto"
                  color="primary"
                  readonly
                  disabled
                  prepend-inner-icon="mdi-at"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <label class="text-detail-tiny mb-2 d-block">{{ t("gender") }} *</label>
                <v-select
                  v-model="form.gender"
                  :items="genderOptions"
                  :placeholder="t('select')"
                  variant="outlined"
                  density="compact"
                  rounded="0"
                  hide-details="auto"
                  color="primary"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <label class="text-detail-tiny mb-2 d-block">{{ t("dob") }}</label>
                <DialogDate
                  v-model="showDobPicker"
                  :date="form.dob"
                  @update:date="form.dob = $event"
                />
                <v-text-field
                  v-model="form.dob"
                  variant="outlined"
                  density="compact"
                  rounded="0"
                  hide-details="auto"
                  color="primary"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  @click="showDobPicker = true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <label class="text-detail-tiny mb-2 d-block">{{ t("phone") }}</label>
                <v-text-field
                  v-model="form.phone_number"
                  placeholder="+856 20 ..."
                  variant="outlined"
                  density="compact"
                  rounded="0"
                  hide-details="auto"
                  color="primary"
                  prepend-inner-icon="mdi-phone-outline"
                ></v-text-field>
              </v-col>

              <v-col cols="12" v-if="errorMessage">
                <v-alert type="error" variant="tonal" density="compact">{{
                  errorMessage
                }}</v-alert>
              </v-col>
            </v-row>

            <div class="d-flex justify-end ga-3 mt-6">
              <v-btn
                variant="flat"
                color="grey-lighten-4"
                class="modern-action-btn secondary border text-slate-700"
                height="42"
                to="/"
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
                :disabled="loadingData"
              >
                {{ t("save") }}
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTeacherStore } from "~/stores/apiTeacher";
import { useUiStore } from "~/stores/ui";

// Own-profile page — available to both admin and teacher accounts. It edits the
// logged-in user's own record (identified by the `id` cookie), not someone
// else's, so it is intentionally NOT marked `requiresAdmin`.
const { t } = useI18n();
const teacherStore = useTeacherStore();
const ui = useUiStore();
const { mediaUrl } = useMedia();

// Logged-in user id + cookies mirrored into the header. Updating the profile
// keeps these in sync so the top bar reflects the new name/avatar immediately.
const userId = useCookie<string>("id");
const username = useCookie<string>("username", { default: () => "" });
const roleCookie = useCookie<string>("role", { default: () => "" });
const phoneCookie = useCookie<string>("phone");
const emailCookie = useCookie<string>("email");
const avatarCookie = useCookie<string>("avatar");

const loading = ref(false);
const loadingData = ref(true);
const errorMessage = ref("");
const formRef = ref();
const showDobPicker = ref(false);

const form = ref({
  full_name: "",
  email: "",
  gender: "",
  dob: "",
  phone_number: "",
  avatar: "",
  role: "teacher",
  status: "active",
});

// Show the newly picked avatar (relative path → absolute) or fall back to the
// cookie the header already uses.
const avatarPreview = computed(() =>
  form.value.avatar
    ? mediaUrl(form.value.avatar)
    : avatarCookie.value && avatarCookie.value !== "null"
      ? mediaUrl(avatarCookie.value)
      : ""
);

const roleKey = computed(() =>
  ["admin", "administrator"].includes((form.value.role || "").toLowerCase())
    ? "administrator"
    : "teacher"
);

const genderOptions = [
  { title: t("male"), value: "male" },
  { title: t("female"), value: "female" },
];

const rules = {
  required: (v: any) => !!v || t("required"),
};

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("profile"), disabled: true, to: "" },
];

onMounted(async () => {
  try {
    const me = await teacherStore.fetchTeacherById(String(userId.value));
    if (me) {
      form.value = {
        full_name: me.full_name || "",
        email: me.email || emailCookie.value || "",
        gender: me.gender || "",
        dob: me.dob ? String(me.dob).substring(0, 10) : "",
        phone_number: me.phone_number || "",
        avatar: me.avatar && me.avatar !== "null" ? me.avatar : "",
        role: me.role || roleCookie.value || "teacher",
        status: me.status || "active",
      };
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = t("failed-update");
  } finally {
    loadingData.value = false;
  }
});

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await teacherStore.updateTeacher(String(userId.value), {
      full_name: form.value.full_name,
      email: form.value.email,
      gender: form.value.gender,
      dob: form.value.dob,
      phone_number: form.value.phone_number,
      avatar: form.value.avatar,
      // Preserve role/status — they are not owner-editable here.
      role: form.value.role,
      status: form.value.status,
    });

    // Reflect the changes in the header immediately.
    username.value = form.value.full_name || username.value;
    phoneCookie.value = form.value.phone_number || "";
    emailCookie.value = form.value.email || "";
    avatarCookie.value = form.value.avatar || "";

    ui.notify(t("saved-successfully"), "success");
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || t("failed-update");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}
.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
  height: 100%;
}
.modern-action-btn {
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  padding: 0 20px !important;
}
.modern-action-btn.primary {
  background: linear-gradient(135deg, #0a3154 0%, #082741 100%) !important;
  color: white !important;
}
.text-slate-700 {
  color: #334155 !important;
}
</style>
