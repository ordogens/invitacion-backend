import 'dotenv/config'
import { createApp } from './app.js'
import { sendTelegramMessage } from './services/telegram.service.js'

function requiredEnvironmentValue(name: 'TELEGRAM_BOT_TOKEN' | 'TELEGRAM_CHAT_ID') {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Falta configurar ${name} en backend/.env.`)
  return value
}

function getPort() {
  const port = Number(process.env.PORT ?? 3001)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT debe ser un número entero entre 1 y 65535.')
  }
  return port
}

function getAllowedOrigins() {
  const isProduction = process.env.NODE_ENV === 'production'
  const configuredOrigins = process.env.FRONTEND_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? []

  if (isProduction && configuredOrigins.length === 0) {
    throw new Error('Configura FRONTEND_ORIGIN antes de iniciar el backend en producción.')
  }

  const origins = new Set(configuredOrigins)
  if (!isProduction) {
    origins.add('http://localhost:5173')
    origins.add('http://127.0.0.1:5173')
  }

  for (const origin of origins) {
    try {
      const parsed = new URL(origin)
      if (parsed.origin !== origin || !['http:', 'https:'].includes(parsed.protocol)) throw new Error()
    } catch {
      throw new Error('FRONTEND_ORIGIN debe contener orígenes HTTP/HTTPS válidos, separados por comas.')
    }
  }

  return [...origins]
}

const port = getPort()
const botToken = requiredEnvironmentValue('TELEGRAM_BOT_TOKEN')
const chatId = requiredEnvironmentValue('TELEGRAM_CHAT_ID')
const allowedOrigins = getAllowedOrigins()
const app = createApp({
  allowedOrigins,
  sendNotification: (plan) => sendTelegramMessage(plan, { botToken, chatId }),
})

app.listen(port, () => {
  console.info(`Backend de invitación escuchando en el puerto ${port}.`)
})
