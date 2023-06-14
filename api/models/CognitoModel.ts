/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
import {
  CreateAuthChallengeTriggerEvent,
  DefineAuthChallengeTriggerEvent,
  PreSignUpTriggerEvent,
  VerifyAuthChallengeResponseTriggerEvent
} from 'aws-lambda'
import { randomInt } from 'crypto'

import logger from '@/lib/logger'
import SNS from '@/lib/sns'

/**
 * Create auth challenge for Cognito
 * @param event type {CreateAuthChallengeTriggerEvent}
 * @returns Promise<{@link CreateAuthChallengeTriggerEvent}>
 */
export const createAuthChallenge = async (
  event: CreateAuthChallengeTriggerEvent
): Promise<CreateAuthChallengeTriggerEvent> => {
  let passCode: string | null
  const phoneNumber = event.request.userAttributes.phone_number
  const { session } = event.request

  if (session && session.length && (session.slice(-1)[0].challengeName === 'SRP_A' || session.length === 0)) {
    passCode = `${randomInt(999999)}`
    await SNS.sendOTP(phoneNumber, passCode)
  } else {
    const { challengeMetadata } = session.slice(-1)[0]
    const matched = (challengeMetadata ?? '').match(/CODE-(\d*)/)
    passCode = matched ? matched[1] : ''
  }
  event.response.publicChallengeParameters = { phone: event.request.userAttributes.phone_number }
  event.response.privateChallengeParameters = { passCode }
  event.response.challengeMetadata = `CODE-${passCode}`

  logger.info('RETURNED event: ', JSON.stringify(event, null, 2))

  return event
}

/**
 * Create pre-signup for Cognito
 * @param event type {PreSignUpTriggerEvent}
 * @returns Promise<{@link PreSignUpTriggerEvent}>
 */
export const createPreSignUp = async (event: PreSignUpTriggerEvent): Promise<PreSignUpTriggerEvent> => {
  event.response.autoConfirmUser = true
  event.response.autoVerifyPhone = true
  return event
}

/**
 * Define auth challenge for Cognito
 * @param event type {DefineAuthChallengeTriggerEvent}
 * @returns Promise<{@link DefineAuthChallengeTriggerEvent}>
 */
export const defineAuthChallenge = async (
  event: DefineAuthChallengeTriggerEvent
): Promise<DefineAuthChallengeTriggerEvent> => {
  const { session } = event.request
  if (session && session.length && session.slice(-1)[0].challengeName === 'SRP_A') {
    logger.info('New CUSTOM_CHALLENGE', JSON.stringify(event, null, 2))
    event.request.session = []
    event.response.issueTokens = false
    event.response.failAuthentication = false
    event.response.challengeName = 'CUSTOM_CHALLENGE'
  } else if (session && session.length
      && session.slice(-1)[0].challengeName === 'CUSTOM_CHALLENGE'
      && session.slice(-1)[0].challengeResult === true
  ) {
    logger.info('CORRECT Answer: The user provided a right answer')
    event.response.issueTokens = true
    event.response.failAuthentication = false
  } else if (session && session.length >= 4 && session.slice(-1)[0].challengeResult === false) {
    logger.info('FAILED Authentication: The user provided a wrong answer 3 times')
    event.response.issueTokens = false
    event.response.failAuthentication = true
  } else {
    logger.info(`WRONG Answer: Attempt [${session.length}]`)
    event.response.issueTokens = false
    event.response.failAuthentication = false
    event.response.challengeName = 'CUSTOM_CHALLENGE'
  }

  logger.info('RETURNED event: ', JSON.stringify(event, null, 2))

  return event
}

/**
 * Verify auth challenge for Cognito
 * @param event type {VerifyAuthChallengeResponseTriggerEvent}
 * @returns Promise<{@link VerifyAuthChallengeResponseTriggerEvent}>
 */
export const verifyAuthChallenge = async (
  event: VerifyAuthChallengeResponseTriggerEvent
): Promise<VerifyAuthChallengeResponseTriggerEvent> => {
  const { request } = event
  const expectedAnswer = request.privateChallengeParameters.passCode || null
  event.response.answerCorrect = request.challengeAnswer === expectedAnswer

  return event
}
