/* eslint-disable react-refresh/only-export-components -- Route modules intentionally combine lazy definitions and router configuration. */
import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { FullPageLoading } from '../components/feedback/FullPageLoading'
import { AdminLayout } from '../components/layout/AdminLayout'
import { PublicLayout } from '../components/layout/PublicLayout'
import { AdminAuthRoot } from '../features/auth/AdminAuthRoot'
import { RequireAuth } from '../features/auth/RequireAuth'

const PublicHomePage = lazy(() => import('../pages/public/PublicHomePage'))
const InvitationPage = lazy(() => import('../pages/public/InvitationPage'))
const ConfirmationPage = lazy(() => import('../pages/public/ConfirmationPage'))
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'))
const AdminWeddingPage = lazy(() => import('../pages/admin/AdminWeddingPage'))
const AdminInvitationsPage = lazy(
  () => import('../pages/admin/AdminInvitationsPage'),
)
const AdminInvitationDetailPage = lazy(
  () => import('../pages/admin/AdminInvitationDetailPage'),
)
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function withSuspense(page: ReactNode) {
  return (
    <Suspense fallback={<FullPageLoading label="Preparing this page…" />}>
      {page}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: withSuspense(<PublicHomePage />) },
      { path: '/invite/:token', element: withSuspense(<InvitationPage />) },
      {
        path: '/invite/:token/confirmation',
        element: withSuspense(<ConfirmationPage />),
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminAuthRoot />,
    children: [
      {
        path: 'login',
        element: withSuspense(<AdminLoginPage />),
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: withSuspense(<AdminDashboardPage />) },
              { path: 'wedding', element: withSuspense(<AdminWeddingPage />) },
              {
                path: 'invitations',
                element: withSuspense(<AdminInvitationsPage />),
              },
              {
                path: 'invitations/:invitationId',
                element: withSuspense(<AdminInvitationDetailPage />),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <PublicLayout>{withSuspense(<NotFoundPage />)}</PublicLayout>
    ),
  },
])
