import Assert from 'assert'
import { BatchWriteItemRequestMap, DocumentClient } from 'aws-sdk/clients/dynamodb'

import { batchWriteStruct } from './helper'
import $env from '.'

import IEntityCommonProps = ProjectName.Entities.EntityCommonProps
import IGetItemInput = DocumentClient.GetItemInput
import IGetItemOutput = DocumentClient.GetItemOutput
import IScanInput = DocumentClient.ScanInput
import IScanOutput = DocumentClient.ScanOutput
import IPutItemInput = DocumentClient.PutItemInput
import IPutItemOutput = DocumentClient.PutItemOutput
import IDeleteItemInput = DocumentClient.DeleteItemInput
import IDeleteItemOutput = DocumentClient.DeleteItemOutput
import IQueryInput = DocumentClient.QueryInput
import IQueryOutput = DocumentClient.QueryOutput
import IBatchWriteItemInput = DocumentClient.BatchWriteItemInput
import BatchWriteItemOutput = DocumentClient.BatchWriteItemOutput

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
   * @param params type {@link IQueryInput}
   * @returns Promise<{@link IQueryOutput}>
   */
  private $query = (params: IQueryInput): Promise<IQueryOutput> => this.instance.query(params).promise()

  /**
   * Encapsulation of original method into more practical execution
   * @param params type {@link IScanInput}
   * @returns Promise<{@link IScanOutput}>
   */
  private $scan = (params: IScanInput): Promise<IScanOutput> => this.instance.scan(params).promise()

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
   * Encapsulation of original method into more practical execution
   * @param params type {@link IBatchWriteItemInput}
   * @returns Promise<{@link BatchWriteItemOutput}>
   */
  // eslint-disable-next-line arrow-body-style
  private $batchWriteItems = (params: IBatchWriteItemInput): Promise<BatchWriteItemOutput> => {
    return this.instance.batchWrite(params).promise()
  }

  /**
   * Get a database element with params
   * @param params type {@link IGetItemInput} omitting TableName property
   * @param TableName type {string} pre-filled with {@link $env.MAIN_TABLE}
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
   * Query database for results
   * @param params type {@link IQueryInput} omitting TableName property
   * @param TableName type {string} pre-filled with {@link $env.MAIN_TABLE}
   * @returns Promise<{@link TEntity[]}>
   */
  async query<TEntity>(
    params: Omit<IQueryInput, 'TableName'>,
    TableName = $env.MAIN_TABLE
  ): Promise<TEntity[]> {
    Assert.ok(TableName)

    const result = await this.$query({ TableName, ...params })
    return result.Items as TEntity[]
  }

  /**
   * Scan database for results
   * @param params type {@link IScanInput} omitting TableName property
   * @param TableName type {string} pre-filled with {@link $env.MAIN_TABLE}
   * @returns Promise<{@link TEntity[]}>
   */
  async scan<TEntity>(
    params: Omit<IScanInput, 'TableName'>,
    TableName = $env.MAIN_TABLE
  ): Promise<TEntity[]> {
    Assert.ok(TableName)

    const result = await this.$scan({ TableName, ...params })
    return result.Items as TEntity[]
  }

  /**
   * Create/Update database element with params
   * @param params type {@link IPutItemInput} omitting TableName property
   * @param TableName type {string} pre-filled with {@link $env.MAIN_TABLE}
   * @returns Promise<void>
   */
  async put(params: Omit<IPutItemInput, 'TableName'>, TableName = $env.MAIN_TABLE): Promise<void> {
    Assert.ok(TableName)

    await this.$put({ TableName, ...params })
  }

  /**
   * Delete a database element with {@link IDeleteItemInput.Key} object
   * @param params type {@link IDeleteItemInput} omitting TableName property
   * @param TableName type {string} pre-filled with {@link $env.MAIN_TABLE}
   * @returns Promise<boolean>
   */
  async delete(params: Pick<IDeleteItemInput, 'Key'>, TableName = $env.MAIN_TABLE): Promise<boolean> {
    Assert.ok(TableName)

    await this.$delete({ TableName, ...params })
    return true
  }

  /**
   * Create/Update/Delete items in batch of 25(which is the maximum according to AWS docs).
   * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
   * @param params type {@link IBatchWriteItemInput}
   * @returns Promise<void>
   */
  async batchWriteItems<TEntity extends IEntityCommonProps>(
    items: TEntity[],
    requestType: string
  ): Promise<void> {
    const request: BatchWriteItemRequestMap = {}
    const requestName = `${requestType}Request`
    let fromIndex = 0
    let toIndex = items.length > 25 ? 25 : items.length

    while (fromIndex !== items.length) {
      const toIndexProjection = toIndex + 25
      request[$env.MAIN_TABLE] = items.map((item) => ({
        [requestName]: batchWriteStruct(item, requestType)
      }))

      // eslint-disable-next-line no-await-in-loop
      await this.$batchWriteItems({ RequestItems: request })

      // Preparing next batch of items if there is any
      fromIndex = toIndex
      toIndex = items.length > toIndexProjection ? toIndexProjection : items.length
    }
  }

}

export default new AWSDynamoDB()
