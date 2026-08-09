import { Palette } from 'lucide-react'
import type { FieldPath, UseFormReturn } from 'react-hook-form'
import type { WeddingSettingsFormValues } from '../validation'

const colors: { name: FieldPath<WeddingSettingsFormValues>; label: string }[] = [
  { name: 'theme.primaryColor', label: 'Primary color' },
  { name: 'theme.secondaryColor', label: 'Secondary color' },
  { name: 'theme.accentColor', label: 'Accent color' },
  { name: 'theme.backgroundColor', label: 'Background color' },
]

export function ThemeSettingsSection({ form }: { form: UseFormReturn<WeddingSettingsFormValues> }) {
  return <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7"><h2 className="flex items-center gap-2 font-[var(--font-display)] text-2xl"><Palette className="size-5" aria-hidden="true" />Theme settings</h2><p className="mt-1 text-sm text-[var(--color-muted)]">Theme settings control colors and typography independently from the selected template.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><ThemeField label="Theme key" name="theme.key" form={form} placeholder="editorial-linen" />{colors.map((item) => <ThemeField key={item.name} {...item} form={form} placeholder="#F5F1EA" />)}<ThemeField label="Heading font" name="theme.headingFont" form={form} /><ThemeField label="Body font" name="theme.bodyFont" form={form} /></div></section>
}

function ThemeField({ label, name, form, placeholder }: { label: string; name: FieldPath<WeddingSettingsFormValues>; form: UseFormReturn<WeddingSettingsFormValues>; placeholder?: string }) {
  const id = `wedding-${name.replace('.', '-')}`
  const error = name.split('.').reduce<unknown>((current, key) => current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined, form.formState.errors) as { message?: string } | undefined
  return <div><label className="font-medium" htmlFor={id}>{label}</label><input id={id} type="text" placeholder={placeholder} className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 font-mono text-sm" aria-invalid={Boolean(error)} {...form.register(name)} />{error?.message ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{error.message}</p> : null}</div>
}
