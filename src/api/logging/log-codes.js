// istanbul ignore file

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
        `Validation Error for grantType=${messageOptions.grantType} with message(s): ${messageOptions.messages}`
    }
  }
}
