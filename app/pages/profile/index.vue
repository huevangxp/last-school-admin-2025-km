<template>
  <v-container fluid class="dashboard-container pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-form ref="formRef" @submit.prevent="save">
      <v-row class="ga-y-4">
        <!-- Identity card: avatar + read-only account facts -->
        <v-col cols="12" md="4">
          <v-card class="intelligence-card pa-6 text-center" elevation="0">
            <v-avatar size="120" color="primary-lighten-5" class="mb-4 elevation-1 mx-auto">
              <v-img v-if="avatarPreview" :src="avatarPreview" cover alt=""></v-img>
              <v-icon v-else color="primary" size="56">mdi-account</v-icon>
            </v-avatar>
            <div class="text-title mb-1 text-capitalize">
              {{ displayName || t("information") }}
            </div>
            <div class="text-detail mb-4">@{{ username }}</div>

            <div class="d-flex justify-center ga-2 mb-6">
              <v-chip
                color="primary"
                variant="flat"
                size="small"
                class="font-weight-black text-capitalize"
              >
                {{ t(roleKey) }}
              </v-chip>
              <v-chip
                :color="form.status === 'active' ? 'success' : 'grey'"
                variant="flat"
                size="small"
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
              <!-- Teacher / admin: single full name. Student: first + last. -->
              <v-col v-if="!isStudent" cols="12">
                <label class="text-detail-tiny mb-2 d-block">{{ t("name") }} *</label>
                <v-text-field
                  v-model="form.full_name"
                  :placeholder="t('enter-full-name')"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  color="primary"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <template v-else>
                <v-col cols="12" md="6">
                  <label class="text-detail-tiny mb-2 d-block">{{ t("firstname") }} *</label>
                  <v-text-field
                    v-model="form.first_name"
                    :placeholder="t('eg-firstname')"
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                    color="primary"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label class="text-detail-tiny mb-2 d-block">{{ t("lastname") }} *</label>
                  <v-text-field
                    v-model="form.last_name"
                    :placeholder="t('eg-lastname')"
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                    color="primary"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </template>

              <v-col cols="12" md="4">
                <label class="text-detail-tiny mb-2 d-block">{{ t("username") }}</label>
                <v-text-field
                  :model-value="username"
                  variant="outlined"
                  density="compact"
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

          <!-- Change password -->
          <v-card class="intelligence-card pa-6 mt-4" elevation="0">
            <div class="d-flex align-center mb-6">
              <v-avatar color="orange-lighten-5" size="40" class="mr-3 rounded-0">
                <v-icon color="orange-darken-2" size="20">mdi-lock-outline</v-icon>
              </v-avatar>
              <div>
                <h2 class="text-title">{{ t("change-password") }}</h2>
                <p class="text-detail">{{ t("security-desc") }}</p>
              </div>
            </div>
            <v-row class="ga-y-2">
              <v-col cols="12" md="4">
                <label class="text-detail-tiny mb-2 d-block">{{ t("current-password") }}</label>
                <v-text-field
                  v-model="pw.current"
                  type="password"
                  variant="outlined"
                  density="compact"
                  hide-details
                  color="primary"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <label class="text-detail-tiny mb-2 d-block">{{ t("new-password") }}</label>
                <v-text-field
                  v-model="pw.next"
                  type="password"
                  variant="outlined"
                  density="compact"
                  hide-details
                  color="primary"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <label class="text-detail-tiny mb-2 d-block">{{ t("confirmPassword") }}</label>
                <v-text-field
                  v-model="pw.confirm"
                  type="password"
                  variant="outlined"
                  density="compact"
                  hide-details
                  color="primary"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="pwError">
                <v-alert type="error" variant="tonal" density="compact">{{ pwError }}</v-alert>
              </v-col>
            </v-row>
            <div class="d-flex justify-end mt-6">
              <v-btn
                variant="flat"
                color="primary"
                class="modern-action-btn primary"
                height="42"
                :loading="pwSaving"
                @click="changePassword"
              >
                {{ t("change-password") }}
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
import { useApiAuthStore } from "~/stores/apiAuth";
import { useUiStore } from "~/stores/ui";

// Own-profile page — available to EVERY logged-in account (admin, teacher and
// student). It reads/writes the logged-in user's OWN record through the
// self-service `/my-profile` endpoint, which resolves the target row from the
// auth token server-side — so no user id is sent from the client and no one can
// edit anyone else's account. role/status are not editable here.
const { t } = useI18n();
const authStore = useApiAuthStore();
const ui = useUiStore();
const { mediaUrl } = useMedia();

// Cookies mirrored into the header so the top bar reflects a new name/avatar
// immediately after saving.
const username = useCookie<string>("username", { default: () => "" });
const roleCookie = useCookie<string>("role", { default: () => "" });
const phoneCookie = useCookie<string>("phone");
const avatarCookie = useCookie<string>("avatar");

const role = computed(() => (roleCookie.value || "").toLowerCase());
const isStudent = computed(() => role.value === "student");

const loading = ref(false);
const loadingData = ref(true);
const errorMessage = ref("");
const formRef = ref();
const showDobPicker = ref(false);

const form = ref({
  full_name: "",
  first_name: "",
  last_name: "",
  gender: "",
  dob: "",
  phone_number: "",
  avatar: "",
  role: "teacher",
  status: "active",
});

const displayName = computed(() =>
  isStudent.value
    ? `${form.value.first_name} ${form.value.last_name}`.trim()
    : form.value.full_name
);

// Show the newly picked avatar (relative path → absolute) or fall back to the
// cookie the header already uses.
const avatarPreview = computed(() =>
  form.value.avatar
    ? mediaUrl(form.value.avatar)
    : avatarCookie.value && avatarCookie.value !== "null"
      ? mediaUrl(avatarCookie.value)
      : ""
);

const roleKey = computed(() => {
  if (isStudent.value) return "student";
  return ["admin", "administrator"].includes((form.value.role || "").toLowerCase())
    ? "administrator"
    : "teacher";
});

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
    const me = await authStore.fetchMyProfile();
    if (me) {
      form.value = {
        full_name: me.full_name || "",
        first_name: me.first_name || "",
        last_name: me.last_name || "",
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

// ---- Change password ----
const pw = ref({ current: "", next: "", confirm: "" });
const pwError = ref("");
const pwSaving = ref(false);
const changePassword = async () => {
  pwError.value = "";
  if (!pw.value.current || !pw.value.next) {
    pwError.value = t("all-fields-required");
    return;
  }
  if (pw.value.next.length < 6) {
    pwError.value = t("password-min-6");
    return;
  }
  if (pw.value.next !== pw.value.confirm) {
    pwError.value = t("passwords-do-not-match");
    return;
  }
  pwSaving.value = true;
  try {
    await authStore.updateMyPassword(pw.value.current, pw.value.next);
    pw.value = { current: "", next: "", confirm: "" };
    ui.notify(t("saved-successfully"), "success");
  } catch (error: any) {
    pwError.value = error.response?.data?.message || t("failed-to-save");
  } finally {
    pwSaving.value = false;
  }
};

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    // One self-service call for every role; the server picks teacher vs student
    // by the token and only accepts safe fields (name/gender/dob/phone/avatar).
    await authStore.updateMyProfile(
      isStudent.value
        ? {
            first_name: form.value.first_name,
            last_name: form.value.last_name,
            gender: form.value.gender,
            dob: form.value.dob,
            phone_number: form.value.phone_number,
            avatar: form.value.avatar,
          }
        : {
            full_name: form.value.full_name,
            gender: form.value.gender,
            dob: form.value.dob,
            phone_number: form.value.phone_number,
            avatar: form.value.avatar,
          }
    );

    // Reflect the changes in the header immediately. The header's display name
    // is the login handle (the `username` cookie), so it is left untouched; only
    // the avatar and phone we mirror there are refreshed. `userAvatar` is a
    // shared useState the header reads, so the new photo shows there at once.
    phoneCookie.value = form.value.phone_number || "";
    avatarCookie.value = form.value.avatar || "";
    useState<string>("userAvatar").value = form.value.avatar || "";

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
