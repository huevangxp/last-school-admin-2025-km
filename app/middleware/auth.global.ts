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
});
