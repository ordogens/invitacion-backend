import { Router } from 'express'
import { createInvitationController, type NotificationSender } from '../controllers/invitation.controller.js'

export function createInvitationRouter(sendNotification: NotificationSender) {
  const router = Router()
  router.post('/confirmar', createInvitationController(sendNotification))
  return router
}
