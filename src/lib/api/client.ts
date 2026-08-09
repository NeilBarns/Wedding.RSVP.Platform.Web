import { env } from '../env/env'
import { ApiError, type ValidationErrors } from './ApiError'

type RequestBody = BodyInit | Record<string, unknown> | unknown[] | null
type RequestOptions = Omit<RequestInit, 'body' | 'method'> & {
  body?: RequestBody
}

type ErrorPayload = {
  message?: unknown
  errors?: unknown
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined
  }

  const prefix = `${name}=`
  const cookie = document.cookie
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix))

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined
}

function isJsonBody(body: RequestBody): body is Record<string, unknown> | unknown[] {
  return (
    body !== null &&
    typeof body === 'object' &&
    !(body instanceof Blob) &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof ArrayBuffer)
  )
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }

  const text = await response.text()
  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

function validationErrorsFrom(payload: ErrorPayload): ValidationErrors | undefined {
  if (!payload.errors || typeof payload.errors !== 'object') {
    return undefined
  }

  const errors = Object.entries(payload.errors).filter(
    (entry): entry is [string, string[]] =>
      Array.isArray(entry[1]) && entry[1].every((value) => typeof value === 'string'),
  )

  return errors.length > 0 ? Object.fromEntries(errors) : undefined
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase()) && !headers.has('X-XSRF-TOKEN')) {
    const csrfToken = readCookie('XSRF-TOKEN')
    if (csrfToken) {
      headers.set('X-XSRF-TOKEN', csrfToken)
    }
  }

  let body = options.body as BodyInit | null | undefined
  if (isJsonBody(options.body ?? null)) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(options.body)
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    method,
    headers,
    body,
    credentials: 'include',
  })
  const payload = await parseResponse(response)

  if (!response.ok) {
    const errorPayload =
      payload && typeof payload === 'object' ? (payload as ErrorPayload) : {}
    const message =
      typeof errorPayload.message === 'string'
        ? errorPayload.message
        : 'The request could not be completed.'

    throw new ApiError(
      response.status,
      message,
      validationErrorsFrom(errorPayload),
    )
  }

  return payload as T
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body?: RequestBody, options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: RequestBody, options?: RequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, options),
}

export function fetchCsrfCookie(options?: RequestOptions) {
  return request<void>('GET', '/sanctum/csrf-cookie', options)
}
