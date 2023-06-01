import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

import { ISignupDto } from '@/domain/auth/auth-dto'
import { IAuthData } from '@shared/validators/auth-data'

export interface IAuthService {
  createUser: (dto: ISignupDto) => Promise<IAuthData>
}

export const authServiceFactory = (db: PrismaClient): IAuthService => {
  const createUser = async (data: ISignupDto): Promise<IAuthData> => {
    const hashSaltRounds = 10
    data.password = await bcrypt.hash(data.password, hashSaltRounds)

    return db.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true
      }
    })
  }

  return {
    createUser
  }
}
