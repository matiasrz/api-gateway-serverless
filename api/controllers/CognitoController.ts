import {
  CreateAuthChallengeTriggerEvent,
  DefineAuthChallengeTriggerEvent,
  PreSignUpTriggerEvent,
  VerifyAuthChallengeResponseTriggerEvent
} from 'aws-lambda'

import { CognitoCustomAuthFlowEvent, customAuthFlowHandler } from '@/lib/handler'
import {
  createAuthChallenge,
  createPreSignUp,
  defineAuthChallenge,
  verifyAuthChallenge
} from '@/models/CognitoModel'

/**
 * Create custom auth challenge for Cognito
 * @param event type {@link CognitoCustomAuthFlowEvent}
 * @return Promise<CreateAuthChallengeTriggerEvent>
 */
export const create = customAuthFlowHandler(async (event: CognitoCustomAuthFlowEvent) => createAuthChallenge(
  event as CreateAuthChallengeTriggerEvent
))

/**
 * Define custom auth challenge for Cognito
 * @param event type {@link CognitoCustomAuthFlowEvent}
 * @return Promise<DefineAuthChallengeTriggerEvent>
 */
export const define = customAuthFlowHandler(async (event: CognitoCustomAuthFlowEvent) => defineAuthChallenge(
  event as DefineAuthChallengeTriggerEvent
))

/**
 * Pre sign up custom auth challenge for Cognito
 * @param event type {@link CognitoCustomAuthFlowEvent}
 * @return Promise<DefineAuthChallengeTriggerEvent>
 */
export const preSignUp = customAuthFlowHandler(async (event: CognitoCustomAuthFlowEvent) => createPreSignUp(
  event as PreSignUpTriggerEvent
))

/**
 * Verify custom auth challenge for Cognito
 * @param event type {@link CognitoCustomAuthFlowEvent}
 * @return Promise<DefineAuthChallengeTriggerEvent>
 */
export const verify = customAuthFlowHandler(async (event: CognitoCustomAuthFlowEvent) => verifyAuthChallenge(
  event as VerifyAuthChallengeResponseTriggerEvent
))
