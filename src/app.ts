import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import { createInvitationRouter } from './routes/invitation.routes.js'
import type { NotificationSender } from './controllers/invitation.controller.js'

interface AppOptions {
  allowedOrigins: string[]
  sendNotification: NotificationSender
}

export function createApp({ allowedOrigins, sendNotification }: AppOptions) {
  const app = express()
  const originSet = new Set(allowedOrigins)

  app.disable('x-powered-by')
  app.use(cors({
    origin(origin, callback) {
      callback(null, !origin || originSet.has(origin))
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }))
  app.use(express.json({ limit: '8kb' }))

  app.get('/health', (_request, response) => {
    response.status(200).json({ success: true, status: 'ok' })
  })
  app.use('/api/invitacion', createInvitationRouter(sendNotification))
  app.use((_request, response) => {
    response.status(404).json({ success: false, message: 'Recurso no encontrado.' })
  })

  const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
    const candidate = error as { type?: string }

    if (candidate?.type === 'entity.too.large') {
      response.status(413).json({ success: false, message: 'La solicitud supera el tamaño permitido.' })
      return
    }

    if (error instanceof SyntaxError && 'body' in error) {
      response.status(400).json({ success: false, message: 'El cuerpo debe ser JSON válido.' })
      return
    }

    response.status(500).json({ success: false, message: 'Ocurrió un error interno.' })
  }

  app.use(errorHandler)
  return app
}
