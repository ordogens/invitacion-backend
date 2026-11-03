import type { PlanDetails } from '../types/invitation.js'

interface TelegramResponse {
  ok?: boolean
}

export function formatInvitationMessage(plan: PlanDetails) {
  const [year, month, day] = plan.date.split('-').map(Number)
  // A UTC noon anchor formats the date-only value without shifting its calendar day.
  const date = new Date(Date.UTC(year, month - 1, day, 12))
  const dateDisplay = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
  const [hours = '0', minutes = '00'] = plan.time.split(':')
  const hour = Number(hours)
  const timeDisplay = `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'p. m.' : 'a. m.'}`
  const lines = [
    '🐱 ¡Nueva confirmación de la invitación!',
    '',
    `📅 Fecha: ${dateDisplay}`,
    `🕒 Hora: ${timeDisplay}`,
    `🍽️ Plan: ${plan.places.join(', ')}`,
  ]

  if (plan.message?.trim()) lines.push(`💬 Mensaje: ${plan.message.trim()}`)

  return lines.join('\n')
}

export async function sendTelegramMessage(
  plan: PlanDetails,
  credentials: { botToken: string; chatId: string },
) {
  const response = await fetch(`https://api.telegram.org/bot${credentials.botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: credentials.chatId,
      text: formatInvitationMessage(plan),
    }),
    signal: AbortSignal.timeout(10_000),
  })

  let result: TelegramResponse | null = null
  try {
    result = await response.json() as TelegramResponse
  } catch {
    // Treat an unreadable Telegram response as a failed delivery.
  }

  if (!response.ok || result?.ok !== true) {
    throw new Error('Telegram no confirmó la entrega del mensaje.')
  }
}
