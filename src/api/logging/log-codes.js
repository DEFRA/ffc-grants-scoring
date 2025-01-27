export const LogCodes = {
  SCORING: {
    REQUEST_RECEIVED: {
      level: 'info',
      event: 'scoring_request_received'
    },
    CONFIG_MISSING: {
      level: 'error',
      event: 'scoring_config_missing'
    },
    CONFIG_FOUND: {
      level: 'info',
      event: 'scoring_config_found'
    },
    FINAL_RESULT: {
      level: 'info',
      event: 'scoring_final_result'
    },
    CONVERSION_ERROR: {
      level: 'error',
      event: 'scoring_conversion_error'
    }
  }
}

export const LogCodeLevels = ['info', 'error', 'debug']
