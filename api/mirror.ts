import handler from '@/lib/handler'

const healthCheck = handler(async (): Promise<string> => "I'm alive!")

export default healthCheck
