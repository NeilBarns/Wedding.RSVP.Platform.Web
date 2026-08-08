import { useCallback, useEffect, useRef, useState } from 'react'
import { getHealth } from './api'

type HealthState = 'loading' | 'success' | 'error'

export function useHealthCheck() {
  const [state, setState] = useState<HealthState>('loading')
  const controllerRef = useRef<AbortController | null>(null)

  const check = useCallback(async () => {
    await Promise.resolve()
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setState('loading')

    try {
      const result = await getHealth({ signal: controller.signal })
      if (!controller.signal.aborted) {
        setState(result.status === 'ok' ? 'success' : 'error')
      }
    } catch {
      if (!controller.signal.aborted) {
        setState('error')
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    controllerRef.current = controller

    getHealth({ signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setState(result.status === 'ok' ? 'success' : 'error')
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState('error')
        }
      })

    return () => controller.abort()
  }, [])

  return { state, retry: check }
}
