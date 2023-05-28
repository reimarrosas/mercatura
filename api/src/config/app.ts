import { Express, RequestHandler, Router } from 'express'
import { IMiddleware } from '@/types'

export class App {
  constructor(private app: Express) {}

  useAppMiddleware = (middleware: IMiddleware) => {
    this.app.use(middleware.handler)
  }

  useExternalMiddleware = (middleware: RequestHandler) => {
    this.app.use(middleware)
  }

  useRoute = (route: Router) => {
    this.app.use(route)
  }

  assignRoute = (route: string, handler: RequestHandler) => {
    this.app.use(route, handler)
  }

  listen = (port: string | number, cb?: () => void) => {
    if (!cb) {
      cb = () => `Listening at http://localhost:${port}`
    }
    this.app.listen(port, cb)
  }
}
