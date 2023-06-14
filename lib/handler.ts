import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
  CreateAuthChallengeTriggerEvent,
  DefineAuthChallengeTriggerEvent,
  DynamoDBStreamEvent,
  PreSignUpTriggerEvent,
  VerifyAuthChallengeResponseTriggerEvent
} from 'aws-lambda'

import logger from '@/lib/logger'

export type CognitoCustomAuthFlowEvent = DefineAuthChallengeTriggerEvent
  | CreateAuthChallengeTriggerEvent
  | PreSignUpTriggerEvent
  | VerifyAuthChallengeResponseTriggerEvent

export function apiGatewayHandler<T>(lambda: (event: APIGatewayEvent, context: Context) => Promise<T>) {
  return async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    let statusCode = 500
    let bodyJSON = ''

    logger.info('APIGatewayEvent', JSON.stringify(event))

    const { requestContext, body } = event
    const routeKey = requestContext && requestContext.routeKey ? requestContext.routeKey : '-'

    logger.info(routeKey, body)
    await lambda(event, context)
      .then((res) => {
        logger.info('[Promise|OK]', res)
        statusCode = 200
        bodyJSON = JSON.stringify(res)
      })
      .catch((error: unknown) => {
        logger.error('[Promise|ERROR]', error)
        const allowedKeys = Object.getOwnPropertyNames(error).filter((key) => ['message', 'code'].includes(key))
        bodyJSON = JSON.stringify(error, allowedKeys)
      })

    return ({ statusCode, body: bodyJSON })
  }
}

export function dbStreamHandler<T>(lambda: (event: DynamoDBStreamEvent, context: Context) => Promise<T>) {
  return async (event: DynamoDBStreamEvent, context: Context): Promise<void> => {
    logger.info('DynamoDBStreamEvent', JSON.stringify(event))
    await lambda(event, context)
      .then((res) => logger.info('[Promise|OK]', res))
      .catch((error: unknown) => logger.error('[Promise|ERROR]', error))
  }
}

export function crawlerHandler<T>(lambda: (event: any, context: Context) => Promise<T>) {
  return async (event: any, context: Context): Promise<void> => {
    logger.info('ICrawlerParams', JSON.stringify(event))
    await lambda(event, context)
      .then((res) => logger.info('[Promise|OK]', res))
      .catch((error: unknown) => logger.error('[Promise|ERROR]', error))
  }
}

export function customAuthFlowHandler<T>(lambda: (event: CognitoCustomAuthFlowEvent, context: Context) => Promise<T>) {
  return async (event: CognitoCustomAuthFlowEvent, context: Context): Promise<void> => {
    logger.info('ICrawlerParams', JSON.stringify(event))
    await lambda(event, context)
      .then((res) => logger.info('[Promise|OK]', res))
      .catch((error: unknown) => logger.error('[Promise|ERROR]', error))
  }
}
