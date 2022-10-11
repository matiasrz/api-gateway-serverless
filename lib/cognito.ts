import { APIGatewayEvent } from 'aws-lambda'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
import { AttributeListType } from 'aws-sdk/clients/cognitoidentityserviceprovider'

import logger from './logger'
import $env from '.'

class AWSCognito {
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
   * - To get a custom attribute from Cognito JWT => event.requestContext?.authorizer?.jwt?.claims['custom:uuid']
   * @param event with type {@link APIGatewayEvent}
   * @returns {string} cognitoIdentityId
   */
  // eslint-disable-next-line class-methods-use-this
  getIdentityId = (event: APIGatewayEvent): string => event.requestContext?.identity?.cognitoIdentityId as string

  /**
   * Updates the user data on cognito
   * @param id string
   * @param attrs {@link AttributeListType} object
   */
  async updateUser(email: string, attrs: AttributeListType) {
    try {
      await this.instance.adminUpdateUserAttributes({
        UserPoolId: $env.AWS_USER_POOL_ID,
        Username: email,
        UserAttributes: attrs
      }).promise()
    } catch (error) {
      logger.error(error)
    }
  }

  /**
   * Create a user from data given
   * This method covers:
   * 1. Create user by passing temporaryPassword config
   * 2. Automatic email verification
   * @param attributesToUpdate {@link AttributeListType} object
   */
  async createUser(email: string, password?: string) {
    let additionalKeys = {}
    const hasValidPassword = password && typeof password === 'string'

    if (hasValidPassword) {
      additionalKeys = { MessageAction: 'SUPPRESS' }
    }

    try {
      await this.instance.adminCreateUser({
        UserPoolId: $env.AWS_USER_POOL_ID,
        DesiredDeliveryMediums: ['EMAIL'],
        Username: email,
        ...additionalKeys,
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          },
          {
            Name: 'email_verified',
            Value: 'true'
          },
          // {
          //   Name: 'custom:uuid',
          //   Value: uuid
          // },
        ],
      }).promise()

      if (hasValidPassword) {
        await this.instance.adminSetUserPassword({
          Password: password,
          Username: email,
          UserPoolId: $env.AWS_USER_POOL_ID,
          Permanent: true
        }).promise()
      }

    } catch (error) {
      logger.error(error)
    }
  }

  /**
   * Delete user from cognito user pool
   * @param username string
   */
  async deleteUser(username: string) {
    try {
      await this.instance.adminDeleteUser({
        UserPoolId: $env.AWS_USER_POOL_ID,
        Username: username
      }).promise()
    } catch (error) {
      logger.error(error)
    }
  }
}

export default new AWSCognito()
