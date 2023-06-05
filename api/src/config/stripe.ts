import Stripe from 'stripe'
import config from '@config/env'

const stripe = new Stripe(config.stripeKey, {
  apiVersion: '2022-11-15'
})

export default stripe
