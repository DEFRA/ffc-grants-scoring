import { getScoringConfig } from '~/src/config/scoring-config.js'
import score from '~/src/services/scoring/score.js'
import mapToFinalResult from '~/src/api/scoring/mapper/map-to-final-result.js'
import { statusCodes } from '../common/constants/status-codes.js'
import { logger } from '../logging/log.js'

export const handler = (request, h) => {
  const { grantType } = request.params
  logger.info(`Request received for grantType=${grantType}`)

  const scoringConfig = getScoringConfig(grantType)

  if (!scoringConfig) {
    logger.error(`Scoring config missing for grantType=${grantType}`)
    return h
      .response({ error: 'Invalid grant type' })
      .code(statusCodes.badRequest)
  }
  logger.info(`Scoring config found for grantType=${grantType}`)

  try {
    // Extract user answers directly
    const answers = request.payload.data.main
    // Find matching scoring data for the provided questionIds
    const rawScores = score(
      scoringConfig,
      request.query.allowPartialScoring
    )(answers)

    const finalResult = mapToFinalResult(scoringConfig, rawScores)

    logger.info(
      `Scoring final result for grantType=${grantType}. Score=${finalResult.score}. Band=${finalResult.scoreBand}. Eligibility=${finalResult.status}`
    )

    return h.response(finalResult).code(statusCodes.ok)
  } catch (error) {
    logger.error(error.message)
    return h
      .response({
        statusCode: statusCodes.badRequest,
        error: 'Bad Request',
        message: error.message
      })
      .code(statusCodes.badRequest)
  }
}
