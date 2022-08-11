import Assert from 'assert'

import logger from './logger'

logger.info('Filling environment variables... ')

const API_URL = process.env.API_URL as string
const AWS_ACCESS_KEY_ID = process.env.AWS_L_ACCESS_KEY_ID as string
const AWS_REGION = process.env.AWS_REGION as string
const AWS_SECRET_ACCESS_KEY = process.env.AWS_L_SECRET_ACCESS_KEY as string
const AWS_USER_POOL_ID = process.env.AWS_USER_POOL_ID as string
const MAIN_TABLE = process.env.MAIN_TABLE as string
const SLS_STAGE = process.env.STAGE as string

Assert.ok(API_URL)
Assert.ok(AWS_ACCESS_KEY_ID)
Assert.ok(AWS_REGION)
Assert.ok(AWS_SECRET_ACCESS_KEY)
Assert.ok(AWS_USER_POOL_ID)
Assert.ok(MAIN_TABLE)
Assert.ok(SLS_STAGE)

const $env = {
  API_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_USER_POOL_ID,
  MAIN_TABLE,
  SLS_STAGE
}

logger.info($env)

export default $env
