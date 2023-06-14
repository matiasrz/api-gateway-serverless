import { SNS } from 'aws-sdk'

import $env from '.'

class AWSSNS {
  private instance = new SNS()

  constructor() {
    this.composeInstance()
  }

  /**
   * Initialize instance with Environment variables defined
   */
  private composeInstance() {
    this.instance = new SNS({
      accessKeyId: $env.AWS_ACCESS_KEY_ID,
      secretAccessKey: $env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-west-1'
    })
  }

  /**
   * Send OTP code
   * @param PhoneNumber 
   * @param code 
   */
  async sendOTP(PhoneNumber: string, code: string) {
    const params = { Message: `[Coin Crumbs] Your secret code: ${code}`, PhoneNumber }
    await this.instance.publish(params).promise()
  }
}

export default new AWSSNS()
