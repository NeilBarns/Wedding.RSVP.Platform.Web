import { zodResolver } from '@hookform/resolvers/zod'
import { LockKeyhole, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { ActionButton } from '../../components/ui/ActionButton'
import { login } from '../../features/auth/api'
import {
  loginSchema,
  type LoginFormValues,
} from '../../features/auth/loginSchema'
import { useAuth } from '../../features/auth/useAuth'
import { ApiError } from '../../lib/api'

type LoginLocationState = {
  from?: unknown
}

function requestedAdminPath(state: unknown): string {
  if (!state || typeof state !== 'object') return '/admin'
  const from = (state as LoginLocationState).from
  return typeof from === 'string' && from.startsWith('/admin') && from !== '/admin/login'
    ? from
    : '/admin'
}

export default function AdminLoginPage() {
  const { status, refreshAuth } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function submit(values: LoginFormValues) {
    setFormError(null)

    try {
      await login({ email: values.email.trim().toLowerCase(), password: values.password })
      const user = await refreshAuth(false)
      if (user) {
        form.reset({ email: '', password: '' })
        navigate(requestedAdminPath(location.state), { replace: true })
      }
    } catch (error) {
      form.resetField('password')
      if (error instanceof ApiError && error.status === 422) {
        const credentialFailure = error.validationErrors?.email?.some((message) =>
          message.toLowerCase().includes('credential'),
        )

        if (credentialFailure) {
          setFormError('The email or password you entered is incorrect.')
        } else {
          if (error.validationErrors?.email) {
            form.setError('email', { message: 'Please enter a valid email address.' })
          }
          if (error.validationErrors?.password) {
            form.setError('password', { message: 'Please enter your password.' })
          }
          setFormError('Please review the highlighted fields.')
        }
      } else if (error instanceof ApiError && error.status === 429) {
        setFormError('Too many login attempts. Please wait a moment and try again.')
      } else {
        setFormError("We couldn't sign you in right now. Please try again.")
      }
    }
  }

  if (status === 'initializing') {
    return <FullPageLoading label="Checking your admin session…" />
  }

  if (status === 'authenticated') {
    return <Navigate to={requestedAdminPath(location.state)} replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-5 py-12">
      <section className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-soft)] sm:p-8">
        <LockKeyhole className="mb-5 size-8 text-[var(--color-primary)]" aria-hidden="true" />
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">Neil &amp; Hazel CMS</p>
        <h1 className="mt-2 font-[var(--font-display)] text-3xl">Admin login</h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">Sign in to manage the wedding experience.</p>

        {status === 'error' ? (
          <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-sm" role="alert">
            We couldn’t verify an existing session. You can still try signing in below.
          </div>
        ) : null}
        <div className="mt-5 min-h-6 text-sm text-[var(--color-error)]" role="alert" aria-live="assertive">
          {formError}
        </div>

        <form className="mt-2 space-y-5" onSubmit={form.handleSubmit(submit)} noValidate>
          <div>
            <label className="font-medium" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              inputMode="email"
              autoComplete="username"
              className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3"
              aria-invalid={Boolean(form.formState.errors.email)}
              aria-describedby={form.formState.errors.email ? 'admin-email-error' : undefined}
              {...form.register('email')}
            />
            {form.formState.errors.email ? <p id="admin-email-error" className="mt-1 text-sm text-[var(--color-error)]" role="alert">{form.formState.errors.email.message}</p> : null}
          </div>
          <div>
            <label className="font-medium" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3"
              aria-invalid={Boolean(form.formState.errors.password)}
              aria-describedby={form.formState.errors.password ? 'admin-password-error' : undefined}
              {...form.register('password')}
            />
            {form.formState.errors.password ? <p id="admin-password-error" className="mt-1 text-sm text-[var(--color-error)]" role="alert">{form.formState.errors.password.message}</p> : null}
          </div>
          <ActionButton type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            <LogIn className="size-4" aria-hidden="true" />
            {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
          </ActionButton>
        </form>
      </section>
    </main>
  )
}
