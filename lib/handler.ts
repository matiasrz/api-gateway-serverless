import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

import logger from '@/lib/logger'

export default function handler<T>(lambda: (event: APIGatewayEvent, context: Context) => Promise<T>) {
  return async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    let statusCode = 500
    let bodyJSON = ''

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
        const allowedKeys = Object.getOwnPropertyNames(error).filter((key) => key === 'message')
        bodyJSON = JSON.stringify(error, allowedKeys)
      })

    return ({ statusCode, body: bodyJSON })
  }
}
