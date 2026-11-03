import { z } from 'zod'
import { invitationFoodOptions } from '../types/invitation.js'

function isCalendarDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  const candidate = new Date(Date.UTC(year, month - 1, day))

  return candidate.toISOString().slice(0, 10) === value
}

export const invitationSchema = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe usar el formato YYYY-MM-DD.')
    .refine(isCalendarDate, 'La fecha no existe en el calendario.')
    .refine((date) => date >= '2026-11-04' && date <= '2026-11-08', 'La fecha debe estar entre el 4 y el 8 de noviembre de 2026.'),
  time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'La hora debe usar el formato HH:mm.'),
  message: z.string().max(240, 'El mensaje no puede superar 240 caracteres.').optional(),
  places: z.array(z.enum(invitationFoodOptions)).min(1, 'Selecciona al menos una opción de comida.'),
}).strict()

export type ValidatedPlanDetails = z.infer<typeof invitationSchema>
