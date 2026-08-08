export type ValidationErrors = Record<string, string[]>

export class ApiError extends Error {
  readonly status: number
  readonly validationErrors?: ValidationErrors

  constructor(
    status: number,
    message: string,
    validationErrors?: ValidationErrors,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.validationErrors = validationErrors
  }
}
