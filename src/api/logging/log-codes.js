import { validateLogCode } from './log-code-validator.js'

export const LogCodes = {
  SCORING: {
    REQUEST_RECEIVED: {
      level: 'info',
      messageFunc: (messageOptions) =>
        `Request received for grantType=${messageOptions.grantType}`
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
      if ('level' in value && 'messageFunc' in value) {
        try {
          validateLogCode(value)
        } catch (e) {
          throw new Error(
            `Invalid log code definition for "${key}": ${e.message}`
          )
        }
      } else {
        throw new Error(
          `Invalid log code definition for "${key}": Missing "level" or "messageFunc"`
        )
      }
    })
  })
}

// Run validation on all log codes
validateLogCodes(LogCodes)
