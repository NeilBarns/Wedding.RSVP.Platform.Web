import { Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'

type ContentImageProps = {
  src: string
  alt: string | null
  className?: string
  eager?: boolean
}

export function ContentImage({ src, alt, className = '', eager = false }: ContentImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div className={`flex items-center justify-center bg-[var(--color-surface)] ${className}`} aria-hidden="true"><ImageIcon className="size-8 text-[var(--color-border)]" /></div>
  }

  return <img src={src} alt={alt ?? ''} className={className} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} onError={() => setFailed(true)} />
}
