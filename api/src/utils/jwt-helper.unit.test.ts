import { IJwtHelper } from '@type/auth'
import { JwtHelper } from '@utils/jwt-helper'
import { IConfig } from '@type/config'

describe('JWT Helper', () => {
  let jwtHelper: IJwtHelper

  beforeAll(() => {
    jwtHelper = new JwtHelper({
      token: {
        secret: 'secret'
      }
    } as IConfig)
  })

  it('should return the payload on valid JWT', () => {
    // Arrange
    const token =
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.nZU_gPcMXkWpkCUpJceSxS7lSickF0tTImHhAR949Z-Nt69LgW8G6lid-mqd9B579tYM8C4FN2jdhR2VRMsjtA'

    // Act
    const payload = jwtHelper.extractPayload(token)

    // Assert
    expect(payload).not.toBeUndefined()
  })

  it('should return undefined on malformed JWT', () => {
    // Arrange
    const token =
      'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.nZU_gPcMXkWpkCUpJceSxS7lSickF0tTImHhAR949Z-Nt69LgW8G6lid-mqd9B579tYM8C4FN2jdhR2VRMsjtA'

    // Act
    const payload = jwtHelper.extractPayload(token)

    // Assert
    expect(payload).toBeUndefined()
  })

  it('should return undefined on invalid secret', () => {
    // Arrange
    const token =
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.-_cBUFRwiSx8tICnU5Ghc4QGSULPFo4tcEb_4Z1eJSF77cgUBKyE6Ucsx0NGQjVkfA9y2q8igY3Sh-RCjD0VFA'

    // Act
    const payload = jwtHelper.extractPayload(token)

    // Assert
    expect(payload).toBeUndefined()
  })
})
