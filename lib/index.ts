import Assert from 'assert'

const awsAccessKeyId = process.env.DEV_ACCESS_KEY_ID as string
const awsSecretAccessKey = process.env.DEV_SECRET_ACCESS_KEY as string
const region = process.env.REGION as string
const stage = process.env.STAGE as string
const cognitoUserPoolId = process.env.DEV_USER_POOL_ID as string

Assert.ok(awsAccessKeyId)
Assert.ok(awsSecretAccessKey)
Assert.ok(region)
Assert.ok(stage)
Assert.ok(cognitoUserPoolId)

const $env = {
  cognitoUserPoolId,
  awsAccessKeyId,
  awsSecretAccessKey,
  region,
  stage,
}

export default $env
