import { APIGatewayEvent } from 'aws-lambda'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
import { AttributeListType } from 'aws-sdk/clients/cognitoidentityserviceprovider'

import logger from './logger'
import $env from '.'

class Cognito {
  private instance = new CognitoIdentityServiceProvider()

  constructor() {
    this.composeInstance()
  }

  /**
   * Initialize instance with Environment variables defined
   */
  private composeInstance() {
    this.instance = new CognitoIdentityServiceProvider({
      credentials: {
        accessKeyId: $env.AWS_ACCESS_KEY_ID,
        secretAccessKey: $env.AWS_SECRET_ACCESS_KEY,
      },
      region: $env.AWS_REGION
    })
  }

  /**
   * Get identityId(UUID) from an APIGateway event object
   * @param event with type {@link APIGatewayEvent}
   * @returns {string} cognitoIdentityId
   */
  // eslint-disable-next-line class-methods-use-this
  getIdentityId = (event: APIGatewayEvent): string => event.requestContext?.identity?.cognitoIdentityId as string

  /**
   * Updates the user data on cognito
   * @param id string
   * @param attributesToUpdate {@link AttributeListType} object
   */
  async updateCognitoData(id: string, attributesToUpdate: AttributeListType) {
    try {
      await this.instance.adminUpdateUserAttributes({
        UserPoolId: $env.AWS_USER_POOL_ID,
        Username: id,
        UserAttributes: attributesToUpdate
      }).promise()
    } catch (error) {
      logger.error(error)
    }
  }
}

export default new Cognito()
