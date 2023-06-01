import { z } from 'zod'

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
})

export type ILoginDto = z.infer<typeof loginDto>

export const signupDto = loginDto.extend({
  name: z.string().min(2)
})

export type ISignupDto = z.infer<typeof signupDto>
