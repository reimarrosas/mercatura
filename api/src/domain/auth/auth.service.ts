import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

import { ILoginDto, ISignupDto } from '@/domain/auth/auth-dto'
import { IAuthData } from '@shared/validators/auth-data'

export interface IAuthService {
  createUser: (dto: ISignupDto) => Promise<IAuthData>
  loginUser: (dto: ILoginDto) => Promise<IAuthData | undefined>
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

  const loginUser = async (data: ILoginDto): Promise<IAuthData | undefined> => {
    const user = await db.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (user) {
      const result = await bcrypt.compare(data.password, user.password)

      if (result) {
        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    }

    return undefined
  }

  return {
    createUser,
    loginUser
  }
}
