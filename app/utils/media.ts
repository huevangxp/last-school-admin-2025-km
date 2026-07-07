// The API server also serves uploaded images (outside /api). Uploaded records
// store only the relative path (e.g. /uploads/images/x.png); prepend the origin
// when rendering.
export const API_ORIGIN = "http://localhost:4000";

export const mediaUrl = (path?: string | null): string => {
  if (!path) return "";
  if (/^https?:\/\//.test(path) || path.startsWith("data:")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
};
