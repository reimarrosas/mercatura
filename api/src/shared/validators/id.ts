import { z } from 'zod'

export const id = z.coerce.number().int().gt(0)

export type ID = z.infer<typeof id>
