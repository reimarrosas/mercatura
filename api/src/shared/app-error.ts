import { HttpStatus } from '@shared/http-status'

export class AppError extends Error {
  constructor(readonly statusCode: HttpStatus, readonly description: string) {
    super(description)
    this.name = HttpStatus[statusCode]
  }

  override toString = () =>
    `${this.statusCode} ${this.name} - ${this.description}`
}
