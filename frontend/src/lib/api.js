export const API_BASE = import.meta.env.VITE_API_BASE || "";

export function api(path) {
  // ensure path starts with '/'
  if (!path.startsWith("/")) path = "/" + path;
  return API_BASE ? `${API_BASE}${path}` : path;
}
