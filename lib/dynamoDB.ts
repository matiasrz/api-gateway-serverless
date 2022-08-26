import Assert from 'assert'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import $env from '.'

import IGetItemInput = DocumentClient.GetItemInput
import IGetItemOutput = DocumentClient.GetItemOutput
import IPutItemInput = DocumentClient.PutItemInput
import IPutItemOutput = DocumentClient.PutItemOutput
import IDeleteItemInput = DocumentClient.DeleteItemInput
import IDeleteItemOutput = DocumentClient.DeleteItemOutput

class AWSDynamoDB {
  private instance = new DocumentClient()

  constructor() {
    this.composeInstance()
  }

  /**
   * Initialize instance with Environment variables defined
   */
  private composeInstance() {
    this.instance = new DocumentClient({
      credentials: {
        accessKeyId: $env.AWS_ACCESS_KEY_ID,
        secretAccessKey: $env.AWS_SECRET_ACCESS_KEY,
      },
      region: $env.AWS_REGION
    })
  }

  /**
   * Encapsulation of original method into more practical execution
   * @param params type {@link IGetItemInput}
   * @returns Promise<{@link IGetItemOutput}>
   */
  private $get = (params: IGetItemInput): Promise<IGetItemOutput> => this.instance.get(params).promise()

  /**
   * Encapsulation of original method into more practical execution
   * @param params type {@link IPutItemInput}
   * @returns Promise<{@link IPutItemOutput}>
   */
  private $put = (params: IPutItemInput): Promise<IPutItemOutput> => this.instance.put(params).promise()

  /**
   * Encapsulation of original method into more practical execution
   * @param params type {@link IDeleteItemInput}
   * @returns Promise<{@link IDeleteItemOutput}>
   */
  private $delete = (params: IDeleteItemInput): Promise<IDeleteItemOutput> => this.instance.delete(params).promise()

  /**
   * Get a database element with params
   * @param params type {@link IGetItemInput} omitting TableName property
   * @param TableName type {@link string} pre-filled with {@link $env.MAIN_TABLE}
   * @returns Promise<{@link TEntity}>
   */
  async getById<TEntity>(
    params: Omit<IGetItemInput, 'TableName'>,
    TableName = $env.MAIN_TABLE
  ): Promise<TEntity> {
    Assert.ok(TableName)

    const result = await this.$get({ TableName, ...params })
    return result.Item as TEntity
  }

  /**
   * Create/Update database element with params
   * @param params type {@link IPutItemInput} omitting TableName property
   * @param TableName type {@link string} pre-filled with {@link $env.MAIN_TABLE}
   * @returns Promise
   */
  async put(params: Omit<IPutItemInput, 'TableName'>, TableName = $env.MAIN_TABLE): Promise<void> {
    Assert.ok(TableName)

    await this.$put({ TableName, ...params })
  }

  /**
   * Delete a database element with {@link IDeleteItemInput.Key} object
   * @param params type {@link IDeleteItemInput} omitting TableName property
   * @param TableName type {@link string} pre-filled with {@link $env.MAIN_TABLE}
   * @returns Promise
   */
  async delete(params: Pick<IDeleteItemInput, 'Key'>, TableName = $env.MAIN_TABLE): Promise<void> {
    Assert.ok(TableName)

    await this.$delete({ TableName, ...params })
  }
}

export default new AWSDynamoDB()
