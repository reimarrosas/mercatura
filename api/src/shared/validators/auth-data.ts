import { z } from 'zod'

export const authData = z.object({
  id: z.number().int().gt(0),
  name: z.string().min(2),
  email: z.string().email()
})

export type IAuthData = z.infer<typeof authData>
