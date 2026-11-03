export const invitationFoodOptions = [
  'Salchipapas',
  'Pizza',
  'Tacos',
  'Alitas de pollo',
  'Ensalada de frutas',
  'Coito',
] as const

export type InvitationFood = (typeof invitationFoodOptions)[number]

export interface PlanDetails {
  date: string
  time: string
  message?: string
  places: InvitationFood[]
}
