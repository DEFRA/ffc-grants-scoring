import { validateLogCode } from './log-code-validator.js'

export const LogCodes = {
  SCORING: {
    REQUEST_RECEIVED: {
      level: 'info',
      messageFunc: (messageOptions) =>
        `Request received for grantType=${messageOptions.grantType}`
    },
    REQUEST_PAYLOAD: {
      level: 'debug',
      messageFunc: (messageOptions) =>
        `Request payload for grantType=${messageOptions.grantType}:\n${JSON.stringify(messageOptions.payload, null, 2)}`
    },
    CONFIG_MISSING: {
      level: 'error',
      messageFunc: (messageOptions) =>
        `Scoring config missing for grantType=${messageOptions.grantType}`
    },
    CONFIG_FOUND: {
      level: 'info',
      messageFunc: (messageOptions) =>
        `Scoring config found for grantType=${messageOptions.grantType}`
    },
    FINAL_RESULT: {
      level: 'info',
      messageFunc: (messageOptions) =>
        `Scoring final result for grantType=${messageOptions.grantType}. Score=${messageOptions.finalResult.score}. Band=${messageOptions.finalResult.scoreBand}. Eligibility=${messageOptions.finalResult.status}`
    },
    CONVERSION_ERROR: {
      level: 'error',
      messageFunc: (messageOptions) =>
        `Scoring conversion error for grantType=${messageOptions.grantType}. Error: ${messageOptions.error}`
    },
    VALIDATION_ERROR: {
      level: 'error',
      messageFunc: (messageOptions) =>
        `Validation Error for grantType=${messageOptions.grantType} with message(s): ${messageOptions.message}`
    },
    CONFIG_ERROR: {
      level: 'error',
      messageFunc: (messageOptions) =>
        `Config error for grantType=${messageOptions.grantType}: ${messageOptions.error}`
    },
    MATRIX_SCORE: {
      MISSING_DEPENDENCY: {
        level: 'error',
        messageFunc: (messageOptions) =>
          `Matrix scoring error: Dependency answer for ${messageOptions.dependency} is missing for question ${messageOptions.questionId}`
      },
      EMPTY_DEPENDENCY: {
        level: 'error',
        messageFunc: (messageOptions) =>
          `Matrix scoring error: Processed dependency answer for ${messageOptions.dependency} is empty for question ${messageOptions.questionId}`
      },
      INVALID_USER_ANSWERS: {
        level: 'error',
        messageFunc: (messageOptions) =>
          `Matrix scoring error: User answers array is empty or invalid for question: ${messageOptions.questionId}`
      },
      ANSWER_NOT_FOUND: {
        level: 'error',
        messageFunc: (messageOptions) =>
          `Matrix scoring error: Answer "${messageOptions.answer}" not found in question: ${messageOptions.questionId}`
      },
      NO_SCORE_FOR_DEPENDENCY: {
        level: 'error',
        messageFunc: (messageOptions) =>
          `Matrix scoring error: No score found for dependency answer "${messageOptions.dependency}" in question: ${messageOptions.questionId}`
      },
      GENERAL_ERROR: {
        level: 'error',
        messageFunc: (messageOptions) =>
          `Matrix scoring error: ${messageOptions.error} in question: ${messageOptions.questionId}`
      }
    }
  }
}

// Validate all log codes once at startup
export const validateLogCodes = (logCodes) => {
  Object.values(logCodes).forEach((entry) => {
    Object.entries(entry).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        throw new Error('logCode must be a non-empty object')
      }

      // Check if this is a leaf node (has level and messageFunc) or a nested node
      if (typeof value === 'object' && value !== null) {
        if ('level' in value || 'messageFunc' in value) {
          // This is a leaf node, check that it has both required properties
          if (!('level' in value && 'messageFunc' in value)) {
            throw new Error(
              `Invalid log code definition for "${key}": Missing "level" or "messageFunc"`
            )
          }

          try {
            validateLogCode(value)
          } catch (e) {
            throw new Error(
              `Invalid log code definition for "${key}": ${e.message}`
            )
          }
        } else {
          // This is a nested node, recursively validate it
          validateLogCodes({ [key]: value })
        }
      } else {
        throw new Error(
          `Invalid log code definition for "${key}": unexpected value type`
        )
      }
    })
  })
}

// Run validation on all log codes
validateLogCodes(LogCodes)
