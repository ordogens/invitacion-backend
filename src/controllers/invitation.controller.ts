import type { Request, Response } from 'express'
import { invitationSchema } from '../schemas/invitation.schema.js'
import type { PlanDetails } from '../types/invitation.js'

export type NotificationSender = (plan: PlanDetails) => Promise<void>

export function createInvitationController(sendNotification: NotificationSender) {
  return async function confirmInvitation(request: Request, response: Response) {
    const parsed = invitationSchema.safeParse(request.body)

    if (!parsed.success) {
      response.status(400).json({
        success: false,
        message: 'Revisa los datos del formulario.',
        errors: parsed.error.issues.map(({ path, message }) => ({
          field: path.join('.'),
          message,
        })),
      })
      return
    }

    try {
      await sendNotification(parsed.data)
      response.status(200).json({
        success: true,
        message: 'Confirmación recibida.',
      })
    } catch {
      // Do not expose or log the Telegram URL, token, or upstream response.
      response.status(502).json({
        success: false,
        message: 'No pudimos enviar la confirmación. Inténtalo de nuevo en un momento.',
      })
    }
  }
}
