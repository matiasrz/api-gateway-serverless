import { SES } from 'aws-sdk'

import $env from '.'

class AWSSES {
  private instance = new SES()

  constructor() {
    this.composeInstance()
  }

  /**
   * Initialize instance with Environment variables defined
   */
  private composeInstance() {
    this.instance = new SES({
      accessKeyId: $env.AWS_ACCESS_KEY_ID,
      secretAccessKey: $env.AWS_SECRET_ACCESS_KEY,
      region: $env.AWS_REGION
    })
  }

  /**
   * Switch case to select different templates created
   * @param attrs with type {@link ProjectName.SESSentAttributes}
   * @returns SES.Body | undefined
   */
  private getTemplate(attrs: ProjectName.SESSentAttributes): SES.Body | undefined {
    const { inviter, invitationURL } = attrs

    switch (attrs.template) {
      case 'invitation':
        if (!inviter || !invitationURL) {
          throw new Error("(Clears throat) You know, I can't send an invitation with invalid inviter and invitationURL")
        }
        return this.invitationTemplate(inviter, invitationURL)
        break

      default:
        return undefined
        break
    }
  }

  /**
   * Compose invitation template
   * @param inviter with type string
   * @param invitationURL  with type string
   * @returns 
   */
  // eslint-disable-next-line class-methods-use-this
  private invitationTemplate(inviter: string, invitationURL: string): SES.Body {
    return ({
      Html: {
        Data: `<div>
          <p>
            ${inviter} welcomes you to Project!.</br>
            Please complete your registration <a href="${invitationURL}">here</a>
          </p>
        </div>`
      },
      Text: {
        Data: `
          ${inviter} welcomes you to Project!\n
          Please complete your registration in the following link: \n
          ${invitationURL}
        `
      }
    })
  }

  /**
   * Send email to an specific addresses.
   * For multiple destination, pass a string splitted by ;
   * @param email 
   */
  async sendTo(attrs: ProjectName.SESSentAttributes) {
    const { addresses, subject } = attrs
    const template = this.getTemplate(attrs)

    if (!template) throw new Error("Oops, couldn't find the requested template")

    await this.instance.sendEmail({
      Destination: {
        ToAddresses: addresses.split(';')
      },
      Source: 'matias+hsj-noreply@goco.dk',
      Message: {
        Subject: {
          Data: subject
        },
        Body: template
      }
    }).promise()
  }

}

export default new AWSSES()
