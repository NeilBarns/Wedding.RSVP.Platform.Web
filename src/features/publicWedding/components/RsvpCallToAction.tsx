import { MailOpen } from 'lucide-react'

export function RsvpCallToAction() {
  return <section id="rsvp" className="scroll-mt-24 px-5 pb-24 pt-10 text-center sm:px-8 sm:pb-32"><div className="mx-auto max-w-4xl rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-6 py-14 text-white shadow-[var(--shadow-soft)] sm:px-12 sm:py-20"><MailOpen className="mx-auto size-7" aria-hidden="true" /><h2 className="mt-5 font-[var(--font-display)] text-4xl sm:text-5xl">We hope you'll join us</h2><p className="mx-auto mt-5 max-w-xl leading-7 text-white/80">Have an invitation link? Open your personal invitation to RSVP. Personal links are sent directly to invited households.</p><p className="mt-7 text-sm font-semibold uppercase tracking-[0.15em]">Please use the link included with your invitation</p></div></section>
}
