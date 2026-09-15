// Backend origin. Set VITE_API_BASE_URL at build time (e.g. on Render); the
// default keeps a plain dev checkout working against a local backend.
export const API_BASE_URL = (
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

export const WS_TEST_STATUS_URL = `${WS_BASE_URL}/ws/test-status`;
