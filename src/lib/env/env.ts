const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

if (!rawApiBaseUrl && import.meta.env.DEV) {
  throw new Error(
    'Missing VITE_API_BASE_URL. Copy .env.example to .env and configure the Laravel API URL.',
  )
}

export const env = Object.freeze({
  apiBaseUrl: (rawApiBaseUrl ?? '').replace(/\/+$/, ''),
})
