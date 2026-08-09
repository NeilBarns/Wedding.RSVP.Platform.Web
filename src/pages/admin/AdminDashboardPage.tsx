import { Check, Clock3, Mail, Send, Users, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AttentionCard } from '../../features/adminDashboard/components/AttentionCard'
import { DashboardHeader } from '../../features/adminDashboard/components/DashboardHeader'
import { MetricCard } from '../../features/adminDashboard/components/MetricCard'
import { PublicAccessNotice } from '../../features/adminDashboard/components/PublicAccessNotice'
import { RecentInvitations } from '../../features/adminDashboard/components/RecentInvitations'
import { RsvpProgressCard } from '../../features/adminDashboard/components/RsvpProgressCard'
import { WeddingSummaryCard } from '../../features/adminDashboard/components/WeddingSummaryCard'
import { getDashboardInvitations, getDashboardWedding } from '../../features/adminDashboard/api'
import type { DashboardInvitationResponse } from '../../features/adminDashboard/types'
import { calculateGuestMetrics, getAttentionItems, isDeadlineApproaching } from '../../features/adminDashboard/utils'
import type { AdminWeddingSettings } from '../../features/adminWedding/types'
import { useAuth } from '../../features/auth/useAuth'
import { ApiError } from '../../lib/api'

type LoadState = 'loading' | 'ready' | 'not-found' | 'error' | 'rate-limited'

function DashboardSkeleton() {
  return <div className="mt-8 space-y-6" role="status" aria-label="Loading dashboard overview"><div className="grid gap-5 lg:grid-cols-2"><div className="h-72 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-surface)]" /><div className="h-72 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-surface)]" /></div><div className="grid grid-cols-2 gap-4 lg:grid-cols-3"><div className="h-32 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-surface)]" /><div className="h-32 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-surface)]" /><div className="h-32 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-surface)]" /></div><span className="sr-only">Loading dashboard...</span></div>
}

function SectionError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6" role="alert"><h2 className="font-semibold">Overview unavailable</h2><p className="mt-2 text-sm text-[var(--color-muted)]">{message}</p><button type="button" onClick={onRetry} className="mt-4 min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 text-sm font-semibold hover:bg-[var(--color-background)]">Try again</button></div>
}

export default function AdminDashboardPage() {
  const { refreshAuth } = useAuth()
  const [wedding, setWedding] = useState<AdminWeddingSettings | null>(null)
  const [invitations, setInvitations] = useState<DashboardInvitationResponse | null>(null)
  const [weddingState, setWeddingState] = useState<LoadState>('loading')
  const [invitationState, setInvitationState] = useState<LoadState>('loading')
  const [weddingReload, setWeddingReload] = useState(0)
  const [invitationReload, setInvitationReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    getDashboardWedding({ signal: controller.signal }).then((value) => {
      if (!controller.signal.aborted) { setWedding(value); setWeddingState('ready') }
    }).catch((error: unknown) => {
      if (controller.signal.aborted) return
      if (error instanceof ApiError && error.status === 401) void refreshAuth(false).catch(() => undefined)
      setWeddingState(error instanceof ApiError && error.status === 404 ? 'not-found' : error instanceof ApiError && error.status === 429 ? 'rate-limited' : 'error')
    })
    return () => controller.abort()
  }, [refreshAuth, weddingReload])

  useEffect(() => {
    const controller = new AbortController()
    getDashboardInvitations({ signal: controller.signal }).then((value) => {
      if (!controller.signal.aborted) { setInvitations(value); setInvitationState('ready') }
    }).catch((error: unknown) => {
      if (controller.signal.aborted) return
      if (error instanceof ApiError && error.status === 401) void refreshAuth(false).catch(() => undefined)
      setInvitationState(error instanceof ApiError && error.status === 404 ? 'not-found' : error instanceof ApiError && error.status === 429 ? 'rate-limited' : 'error')
    })
    return () => controller.abort()
  }, [invitationReload, refreshAuth])

  const completeInvitationSet = invitations?.meta.last_page === 1
  const metrics = useMemo(() => completeInvitationSet && invitations ? calculateGuestMetrics(invitations.data) : null, [completeInvitationSet, invitations])
  const attentionItems = useMemo(() => invitations ? getAttentionItems(invitations.data, isDeadlineApproaching(wedding?.rsvpDeadline ?? null)) : [], [invitations, wedding?.rsvpDeadline])
  const bothLoading = weddingState === 'loading' && invitationState === 'loading'

  return (
    <section className="mx-auto max-w-7xl">
      <DashboardHeader status={wedding?.status} />
      {bothLoading ? <DashboardSkeleton /> : <div className="mt-8 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {weddingState === 'ready' && wedding ? <WeddingSummaryCard wedding={wedding} /> : weddingState === 'loading' ? <div className="h-72 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-surface)]" role="status"><span className="sr-only">Loading wedding summary...</span></div> : weddingState === 'not-found' ? <SectionError message="Wedding settings are not available." onRetry={() => { setWeddingState('loading'); setWeddingReload((value) => value + 1) }} /> : <SectionError message={weddingState === 'rate-limited' ? 'Too many requests. Please wait a moment and try again.' : "We couldn't load the wedding summary."} onRetry={() => { setWeddingState('loading'); setWeddingReload((value) => value + 1) }} />}
          {invitationState === 'ready' ? <RsvpProgressCard metrics={metrics} /> : invitationState === 'loading' ? <div className="h-72 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-surface)]" role="status"><span className="sr-only">Loading RSVP progress...</span></div> : <SectionError message={invitationState === 'rate-limited' ? 'Too many requests. Please wait a moment and try again.' : invitationState === 'not-found' ? 'Invitation information is unavailable until wedding settings exist.' : "We couldn't load RSVP progress."} onRetry={() => { setInvitationState('loading'); setInvitationReload((value) => value + 1) }} />}
        </div>

        {wedding ? <PublicAccessNotice status={wedding.status} /> : null}

        {invitationState === 'ready' && invitations ? <>
          <section aria-labelledby="metrics-heading"><h2 id="metrics-heading" className="sr-only">Wedding metrics</h2><div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6"><MetricCard label="Invitations" value={invitations.meta.total} icon={Mail} helper="All households" />{metrics ? <><MetricCard label="Guests" value={metrics.guests} icon={Users} /><MetricCard label="Attending" value={metrics.attending} icon={Check} /><MetricCard label="Declined" value={metrics.declined} icon={X} /><MetricCard label="Awaiting response" value={metrics.pending} icon={Clock3} /><MetricCard label="Submitted households" value={metrics.submittedHouseholds} icon={Send} /></> : null}</div>{!completeInvitationSet ? <p className="mt-3 text-sm text-[var(--color-muted)]" role="status">Guest totals are omitted because more than 100 invitations exist and the current API does not provide global guest aggregates.</p> : null}</section>

          {invitations.meta.total === 0 ? <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 text-center"><h2 className="font-[var(--font-display)] text-2xl">No invitations yet</h2><p className="mt-2 text-[var(--color-muted)]">Invitation and RSVP activity will appear here once households are added.</p><Link to="/admin/invitations" className="mt-5 inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 font-semibold text-white">Manage invitations</Link></section> : <div className="grid gap-6 xl:grid-cols-2"><AttentionCard items={attentionItems} /><RecentInvitations invitations={invitations.data} /></div>}
        </> : null}

        <nav className="flex flex-wrap gap-3" aria-label="Dashboard actions"><Link to="/admin/invitations" className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 font-semibold text-white">Manage invitations</Link><Link to="/admin/wedding" className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 font-semibold">Wedding settings</Link></nav>
      </div>}
    </section>
  )
}
