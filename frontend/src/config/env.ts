export const env = {
  PORT: Number(import.meta.env.VITE_PORT) || 5173,
  API_URL: import.meta.env.VITE_API_URL || '/api/v1',
  BACKEND_TARGET: import.meta.env.VITE_BACKEND_TARGET || 'http://localhost:8080',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  IS_PROD: import.meta.env.PROD,
  IS_DEV: import.meta.env.DEV,
} as const;

export default env;
