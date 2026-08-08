export function formatWeddingDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`)

  if (Number.isNaN(parsed.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
  }).format(parsed)
}
