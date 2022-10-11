import { apiGatewayHandler } from '@/lib/handler'

/* eslint-disable import/prefer-default-export */
/* eslint-disable-next-line @typescript-eslint/require-await */
export const healthCheck = apiGatewayHandler(async (): Promise<string> => "I'm alive!")
