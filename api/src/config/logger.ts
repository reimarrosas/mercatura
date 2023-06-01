import pino from 'pino'

interface LogFn {
  <T extends object>(obj: T, msg?: string, ...args: any[]): void
  (obj: unknown, msg?: string, ...args: any[]): void
  (msg: string, ...args: any[]): void
}

export interface ILogger {
  fatal: LogFn
  error: LogFn
  warn: LogFn
  info: LogFn
  debug: LogFn
  trace: LogFn
}

const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})

export default logger
