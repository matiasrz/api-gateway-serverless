import { APIGatewayEvent, APIGatewayProxyResult, DynamoDBStreamEvent, Context } from 'aws-lambda'

import logger from '@/lib/logger'

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
