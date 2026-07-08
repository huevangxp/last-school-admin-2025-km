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

  // Role-scoped URL guards. The sidebar already hides pages a role shouldn't
  // see, but these also block reaching them by typing the URL, so menu gating
  // and URL access stay in sync.
  if (token.value) {
    const role = (useCookie<string>("role").value || "").toLowerCase();
    // Strip the i18n locale prefix so it matches the unprefixed allow-lists.
    const path = (to?.path || "/").replace(/^\/(en|la)(?=\/|$)/, "") || "/";
    const matches = (list: string[]) =>
      list.some((a) => path === a || path.startsWith(a + "/"));

    // Student: read-only, limited to five pages. Anything else → score report.
    // (/scores serves the read-only report to students; entry mode is hidden.)
    if (role === "student") {
      const allowed = [
        "/teachers/organization",
        "/scores",
        "/class/organization",
        "/announcement",
      ];
      // Only the study timetable (/timetable). The teaching timetable
      // (/timetable/teaching) is a teacher/admin page, so match /timetable
      // exactly rather than as a prefix.
      if (path !== "/timetable" && !matches(allowed)) {
        return navigateTo("/scores");
      }
    }

    // Teacher: everything the teacher sidebar shows (non-admin items) plus the
    // profile pages. Admin-only management pages (students, classes, subjects,
    // news, gallery, contact, configuration, …) are off-limits by URL too.
    if (role === "teacher") {
      const allowedPrefixes = [
        "/announcement",
        "/class/organization",
        "/scores", // score entry + report (single page)
        "/timetable",
        "/teachers/organization",
        "/financial",
        "/settings",
      ];
      // "/" (dashboard) and "/admin" (profile "information") are allowed exactly,
      // but not their admin-only sub-routes (e.g. /admin/add).
      const allowedExact = ["/", "/admin"];
      if (!(allowedExact.includes(path) || matches(allowedPrefixes))) {
        return navigateTo("/teachers/organization");
      }
    }
  }
});
