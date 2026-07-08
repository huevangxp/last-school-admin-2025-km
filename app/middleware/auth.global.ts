import { storeToRefs } from "pinia";
import { useApiAuthStore } from "~/stores/apiAuth";

export default defineNuxtRouteMiddleware((to) => {
  const { authenticated } = storeToRefs(useApiAuthStore());
  const token = useCookie("token");

  if (token.value) {
    authenticated.value = true;
  }

  // If authenticated and trying to access login page, redirect to home
  if (token.value && (to?.name === "login___la" || to?.name === "login___en")) {
    return navigateTo("/");
  }

  // If not authenticated and trying to access protected pages, redirect to login
  if (!token.value && to?.name !== "login___la" && to?.name !== "login___en") {
    abortNavigation();
    return navigateTo("/login");
  }

  // Role guard: pages marked `requiresAdmin` (e.g. creating/editing teachers)
  // are off-limits to the teacher role. A missing/legacy role cookie is treated
  // as admin so existing admins are never locked out.
  if (token.value && to?.meta?.requiresAdmin) {
    const role = useCookie<string>("role");
    const isAdmin = ["admin", "administrator"].includes(
      (role.value || "administrator").toLowerCase()
    );
    if (!isAdmin) {
      return navigateTo("/teachers/organization");
    }
  }

  // Student guard: the student role is read-only and limited to four pages
  // (teacher org chart, score report, timetable, class organization). Any other
  // URL — dashboard included — is redirected to the score report so a student
  // can never open score entry, financial, admin, etc. by typing the URL.
  if (token.value) {
    const role = (useCookie<string>("role").value || "").toLowerCase();
    if (role === "student") {
      // Strip the i18n locale prefix so it matches the unprefixed allow-list.
      const path = (to?.path || "/").replace(/^\/(en|la)(?=\/|$)/, "") || "/";
      const allowed = [
        "/teachers/organization",
        "/scores/report",
        "/timetable",
        "/class/organization",
        "/announcement",
      ];
      const ok = allowed.some((a) => path === a || path.startsWith(a + "/"));
      if (!ok) {
        return navigateTo("/scores/report");
      }
    }
  }
});
