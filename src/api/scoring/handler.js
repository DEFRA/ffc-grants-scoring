import { getScoringConfig } from '~/src/config/scoring-config.js'
import score from '~/src/services/scoring/score.js'
import mapToFinalResult from '~/src/api/scoring/mapper/map-to-final-result.js'
import { statusCodes } from '../common/constants/status-codes.js'
import { log, LogCodes } from '../logging/log.js'

export const handler = (request, h) => {
  const { grantType } = request.params
  log(LogCodes.SCORING.REQUEST_RECEIVED, {
    message: `Request received for grantType=${grantType}`
  })

  const scoringConfig = getScoringConfig(grantType)

  if (!scoringConfig) {
    log(LogCodes.SCORING.CONFIG_MISSING, {
      message: `Scoring config missing for grantType=${grantType}`
    })
    return h
      .response({ error: 'Invalid grant type' })
      .code(statusCodes.badRequest)
  }
  log(LogCodes.SCORING.CONFIG_FOUND, {
    message: `Scoring config found for grantType=${grantType}`
  })

  try {
    // Extract user answers directly
    const answers = request.payload.data.main
    // Find matching scoring data for the provided questionIds
    const rawScores = score(
      scoringConfig,
      request.query.allowPartialScoring
    )(answers)

    const finalResult = mapToFinalResult(scoringConfig, rawScores)

    log(LogCodes.SCORING.FINAL_RESULT, {
      message: `Scoring final result for grantType=${grantType}. Score=${finalResult.score}. Band=${finalResult.scoreBand}. Eligibility=${finalResult.status}`
    })

    return h.response(finalResult).code(statusCodes.ok)
  } catch (error) {
    log(LogCodes.SCORING.CONVERSION_ERROR, {
      message: error.message
    })
    return h
      .response({
        statusCode: statusCodes.badRequest,
        error: 'Bad Request',
        message: error.message
      })
      .code(statusCodes.badRequest)
  }
}
