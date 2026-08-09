import type { CSSProperties } from 'react'
import type { PublicWeddingTheme } from './types'

type ThemeStyle = CSSProperties & Record<`--${string}`, string>
const hexColor = /^#[0-9A-F]{6}$/i

const fontStacks: Record<string, string> = {
  inter: 'Inter, ui-sans-serif, system-ui, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
  'times new roman': '"Times New Roman", Times, serif',
  'cormorant garamond': 'Georgia, "Times New Roman", serif',
}

export function publicThemeStyle(theme: PublicWeddingTheme): ThemeStyle {
  const style: ThemeStyle = {}
  const colors = [
    ['--color-primary', theme.primaryColor],
    ['--color-secondary', theme.secondaryColor],
    ['--color-accent', theme.accentColor],
    ['--color-background', theme.backgroundColor],
  ] as const
  for (const [property, value] of colors) if (value && hexColor.test(value)) style[property] = value
  const heading = theme.headingFont ? fontStacks[theme.headingFont.trim().toLowerCase()] : undefined
  const body = theme.bodyFont ? fontStacks[theme.bodyFont.trim().toLowerCase()] : undefined
  if (heading) style['--font-display'] = heading
  if (body) style['--font-body'] = body
  return style
}

function calendarDay(value: string | Date) {
  const date = typeof value === 'string' ? new Date(`${value.slice(0, 10)}T00:00:00`) : new Date(value.getFullYear(), value.getMonth(), value.getDate())
  return Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000)
}

export function weddingCountdown(date: string, now = new Date()) {
  const days = calendarDay(date) - calendarDay(now)
  if (days < 0) return { value: null, label: 'Wedding date has passed' }
  if (days === 0) return { value: 0, label: 'Wedding day' }
  return { value: days, label: days === 1 ? 'day until the wedding' : 'days until the wedding' }
}
