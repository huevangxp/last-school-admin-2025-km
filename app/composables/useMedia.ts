// Build an absolute URL for an uploaded image. Records store only the relative
// path (e.g. /uploads/images/x.png); prepend the API origin from runtimeConfig
// so it works in dev and production (NUXT_PUBLIC_API_BASE).
export const useMedia = () => {
  const apiBase = useRuntimeConfig().public.apiBase as string;

  const mediaUrl = (path?: string | null): string => {
    if (!path) return "";
    if (/^https?:\/\//.test(path) || path.startsWith("data:")) return path;
    return `${apiBase}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return { mediaUrl };
};
