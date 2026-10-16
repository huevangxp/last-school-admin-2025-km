<template>
  <div class="page">
    <PageHeader
      :title="t('profile')"
      :subtitle="t('my-profile-subtitle')"
      icon="mdi-account-circle-outline"
      :breadcrumbs="breadcrumbs"
    />

    <v-form ref="formRef" @submit.prevent="save">
      <v-row>
        <!-- Identity card: avatar + read-only account facts -->
        <v-col cols="12" md="4">
          <v-card class="panel h-100 fade-in" elevation="0">
            <div class="profile-hero">
              <div class="profile-avatar">
                <v-img v-if="avatarPreview" :src="avatarPreview" cover alt=""></v-img>
                <v-icon v-else size="48">mdi-account</v-icon>
              </div>
              <div class="profile-name text-capitalize">
                {{ displayName || t("information") }}
              </div>
              <div class="profile-handle">@{{ username }}</div>

              <div class="d-flex justify-center flex-wrap ga-2 mt-3">
                <span class="status-pill status-pill--navy text-capitalize">
                  <v-icon size="12">mdi-shield-account-outline</v-icon>
                  {{ t(roleKey) }}
                </span>
                <span
                  class="status-pill"
                  :class="form.status === 'active' ? 'status-pill--green' : 'status-pill--grey'"
                >
                  <span class="status-dot"></span>
                  {{ form.status === "active" ? t("active") : t("inactive") }}
                </span>
              </div>
            </div>

            <v-divider class="my-5"></v-divider>

            <div class="info-row">
              <div class="info-row-icon">
                <v-icon size="16">mdi-at</v-icon>
              </div>
              <div class="min-w-0">
                <div class="info-row-label">{{ t("username") }}</div>
                <div class="info-row-value">{{ username || "—" }}</div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-row-icon">
                <v-icon size="16">mdi-phone-outline</v-icon>
              </div>
              <div class="min-w-0">
                <div class="info-row-label">{{ t("phone") }}</div>
                <div class="info-row-value">{{ form.phone_number || "—" }}</div>
              </div>
            </div>

            <div class="form-section mt-5">
              <v-icon size="16">mdi-camera-outline</v-icon>
              {{ t("image") }}
            </div>
            <label class="field-label">{{ t("admin-profile-photo") }}</label>
            <ImagePicker v-model="form.avatar" :label="t('image')" />
            <div class="field-hint">{{ t("recommended-photo-size") }}</div>
          </v-card>
        </v-col>

        <!-- Editable personal details -->
        <v-col cols="12" md="8">
          <v-card class="panel fade-in" elevation="0">
            <div class="panel-head">
              <div class="d-flex align-center ga-3">
                <div class="page-icon">
                  <v-icon size="20">mdi-account-edit-outline</v-icon>
                </div>
                <div>
                  <div class="panel-title">{{ t("personal-information") }}</div>
                  <div class="panel-sub">{{ t("my-profile-subtitle") }}</div>
                </div>
              </div>
            </div>

            <div v-if="loadingData" class="chart-empty py-10">
              <v-progress-circular indeterminate size="22" width="2" color="primary" />
              <span>{{ t("loading") }}</span>
            </div>

            <v-row v-else>
              <!-- Teacher / admin: single full name. Student: first + last. -->
              <v-col v-if="!isStudent" cols="12">
                <label class="field-label">{{ t("name") }} *</label>
                <v-text-field
                  v-model="form.full_name"
                  :placeholder="t('enter-full-name')"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  color="primary"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <template v-else>
                <v-col cols="12" md="6">
                  <label class="field-label">{{ t("firstname") }} *</label>
                  <v-text-field
                    v-model="form.first_name"
                    :placeholder="t('eg-firstname')"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    color="primary"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label class="field-label">{{ t("lastname") }} *</label>
                  <v-text-field
                    v-model="form.last_name"
                    :placeholder="t('eg-lastname')"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    color="primary"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </template>

              <v-col cols="12" md="6">
                <label class="field-label">{{ t("username") }}</label>
                <v-text-field
                  :model-value="username"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  color="primary"
                  readonly
                  disabled
                  prepend-inner-icon="mdi-at"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <label class="field-label">{{ t("gender") }} *</label>
                <v-select
                  v-model="form.gender"
                  :items="genderOptions"
                  :placeholder="t('select')"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  color="primary"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">{{ t("dob") }}</label>
                <DialogDate
                  v-model="showDobPicker"
                  :date="form.dob"
                  @update:date="form.dob = $event"
                />
                <v-text-field
                  v-model="form.dob"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  color="primary"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  @click="showDobPicker = true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">{{ t("phone") }}</label>
                <v-text-field
                  v-model="form.phone_number"
                  placeholder="+856 20 ..."
                  variant="outlined"
                  density="comfortable"
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

            <div class="form-actions">
              <v-btn
                variant="flat"
                class="modern-action-btn secondary"
                to="/"
              >
                {{ t("cancel") }}
              </v-btn>
              <v-btn
                variant="flat"
                class="modern-action-btn primary"
                type="submit"
                :loading="loading"
                :disabled="loadingData"
              >
                <v-icon start size="18">mdi-content-save-outline</v-icon>
                {{ t("save") }}
              </v-btn>
            </div>
          </v-card>

          <!-- Change password -->
          <v-card class="panel mt-4 fade-in" elevation="0">
            <div class="panel-head">
              <div class="d-flex align-center ga-3">
                <div class="page-icon page-icon--amber">
                  <v-icon size="20">mdi-lock-outline</v-icon>
                </div>
                <div>
                  <div class="panel-title">{{ t("change-password") }}</div>
                  <div class="panel-sub">{{ t("security-desc") }}</div>
                </div>
              </div>
            </div>

            <v-row>
              <v-col cols="12" md="4">
                <label class="field-label">{{ t("current-password") }}</label>
                <v-text-field
                  v-model="pw.current"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  color="primary"
                  prepend-inner-icon="mdi-lock-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <label class="field-label">{{ t("new-password") }}</label>
                <v-text-field
                  v-model="pw.next"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  color="primary"
                  prepend-inner-icon="mdi-lock-plus-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <label class="field-label">{{ t("confirmPassword") }}</label>
                <v-text-field
                  v-model="pw.confirm"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  color="primary"
                  prepend-inner-icon="mdi-lock-check-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="pwError">
                <v-alert type="error" variant="tonal" density="compact">{{ pwError }}</v-alert>
              </v-col>
            </v-row>

            <div class="form-actions">
              <v-btn
                variant="flat"
                class="modern-action-btn primary"
                :loading="pwSaving"
                @click="changePassword"
              >
                <v-icon start size="18">mdi-lock-reset</v-icon>
                {{ t("change-password") }}
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </div>
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
/* Identity block at the top of the summary card */
.profile-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 4px;
}
.profile-avatar {
  width: 112px;
  height: 112px;
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-navy);
  background: var(--ds-navy-tint);
  border: 3px solid #fff;
  box-shadow: 0 14px 28px -16px rgba(10, 49, 84, 0.6);
  margin-bottom: 14px;
}
.profile-avatar .v-img {
  width: 100%;
  height: 100%;
}
.profile-name {
  font-size: 18px;
  font-weight: 900;
  color: var(--ds-text);
  line-height: 1.25;
  word-break: break-word;
}
.profile-handle {
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-faint);
  margin-top: 2px;
}
.page-icon--amber {
  color: #b45309;
  background: #fffbeb;
}
</style>
