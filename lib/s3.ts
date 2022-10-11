import { S3 } from 'aws-sdk'
import { DeleteObjectsRequest, ListObjectsRequest } from 'aws-sdk/clients/s3'

import logger from './logger'
import $env from '.'

class AWSS3 {
  private instance = new S3()

  constructor() {
    this.composeInstance()
  }

  /**
   * Initialize instance with Environment variables defined
   */
  private composeInstance() {
    this.instance = new S3({
      accessKeyId: $env.AWS_ACCESS_KEY_ID,
      secretAccessKey: $env.AWS_SECRET_ACCESS_KEY,
      region: $env.AWS_REGION,
    })
  }

  async deleteObject(Prefix: string) {
    const listParams: ListObjectsRequest = { Bucket: 'bucket-name', Prefix }
    const delParams: DeleteObjectsRequest = { Bucket: 'bucket-name', Delete: { Objects: [] } }

    const { Contents, IsTruncated } = await this.instance.listObjectsV2(listParams).promise()

    if (!Contents || (Contents && Contents.length === 0)) return

    logger.info('AWSS3 - deleteObject.delParams: ', delParams)
    logger.info('AWSS3 - deleteObject.listParams: ', listParams)

    Contents.forEach(({ Key }) => delParams.Delete.Objects.push({ Key: Key as string }))

    await this.instance.deleteObjects(delParams).promise()

    if (IsTruncated) await this.deleteObject(Prefix)
  }
}

export default new AWSS3()
