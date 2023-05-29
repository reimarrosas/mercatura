import app from '@/app'
import env from '@config/env'

app.listen(env.port, () => `Listening at http://localhost:${env.port}`)
