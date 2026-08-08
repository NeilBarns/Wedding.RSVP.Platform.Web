import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '../../lib/api'
import { getPublicInvitation } from './api'
import type { PublicInvitationData } from './types'

type InvitationState =
  | { status: 'loading'; data: null }
  | { status: 'success'; data: PublicInvitationData }
  | { status: 'not-found'; data: null }
  | { status: 'error'; data: null }

export function usePublicInvitation(token: string) {
  const [state, setState] = useState<InvitationState>({
    status: 'loading',
    data: null,
  })
  const controllerRef = useRef<AbortController | null>(null)

  const load = useCallback(async () => {
    await Promise.resolve()
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setState({ status: 'loading', data: null })

    try {
      const data = await getPublicInvitation(token, {
        signal: controller.signal,
      })
      if (!controller.signal.aborted) {
        setState({ status: 'success', data })
      }
    } catch (error) {
      if (controller.signal.aborted) {
        return
      }

      setState({
        status: error instanceof ApiError && error.status === 404
          ? 'not-found'
          : 'error',
        data: null,
      })
    }
  }, [token])

  useEffect(() => {
    const controller = new AbortController()
    controllerRef.current = controller

    getPublicInvitation(token, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ status: 'success', data })
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          status:
            error instanceof ApiError && error.status === 404
              ? 'not-found'
              : 'error',
          data: null,
        })
      })

    return () => controller.abort()
  }, [token])

  return { ...state, retry: load }
}
