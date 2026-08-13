/**
 * Warns before typed-but-unsaved work is thrown away.
 *
 * Grade entry is the motivating case: a teacher can type thirty scores and lose
 * every one of them by clicking a sidebar link, with no prompt and no way back.
 * This guards both exits that can do that:
 *
 *   - in-app navigation (sidebar, breadcrumb, back button) → a confirm dialog
 *   - closing/reloading the tab → the browser's native "Leave site?" prompt
 *
 * Usage:
 *
 *   const dirty = computed(() => JSON.stringify(rows.value) !== snapshot.value)
 *   const { markClean } = useUnsavedChanges(dirty)
 *   // after a successful save:
 *   markClean()
 *
 * `isDirty` is any ref/computed/getter that is true while there is unsaved work.
 */
export const useUnsavedChanges = (
  isDirty: Ref<boolean> | (() => boolean),
  message?: string
) => {
  const { t } = useI18n();
  const dirty = computed(() =>
    typeof isDirty === "function" ? isDirty() : isDirty.value
  );

  // Set by markClean() so a save immediately silences the guard, even if the
  // caller's own dirty check hasn't recomputed yet.
  const suppressed = ref(false);
  const active = computed(() => dirty.value && !suppressed.value);

  const markClean = () => {
    suppressed.value = true;
  };
  // Any further edit re-arms the guard.
  watch(dirty, (v) => {
    if (v) suppressed.value = false;
  });

  // Native prompt for tab close / reload / external links. The browser shows its
  // own wording here — custom text has been ignored by every major browser for
  // years — so preventDefault is all that is needed.
  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    if (!active.value) return;
    e.preventDefault();
    e.returnValue = "";
  };

  onMounted(() => window.addEventListener("beforeunload", onBeforeUnload));
  onBeforeUnmount(() => window.removeEventListener("beforeunload", onBeforeUnload));

  // In-app navigation. Nuxt route changes never touch beforeunload, so without
  // this the sidebar silently discards the work.
  onBeforeRouteLeave(() => {
    if (!active.value) return true;
    return window.confirm(message || t("unsaved-changes-warning"));
  });

  return { isDirty: active, markClean };
};
