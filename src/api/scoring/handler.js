import { getScoringConfig } from '~/src/config/scoring-config.js'
import score from '~/src/services/scoring/score.js'
import mapToFinalResult from '~/src/api/scoring/mapper/map-to-final-result.js'
import { statusCodes } from '../common/constants/status-codes.js'
import { log, LogCodes } from '../logging/log.js'

export const handler = (request, h) => {
  const { answers } = request.payload
  const { grantType } = request.params
  log(LogCodes.SCORING.REQUEST_RECEIVED, {
    msg: 'Scoring request received',
    grantType,
    answers
  })
  const scoringConfig = getScoringConfig(grantType)

  if (!scoringConfig) {
    log(LogCodes.SCORING.CONFIG_MISSING, {
      msg: 'Grant type not found',
      grantType
    })
    return h
      .response({ error: 'Invalid grant type' })
      .code(statusCodes.badRequest)
  }
  log(LogCodes.SCORING.CONFIG_FOUND, {
    msg: 'Grant type scoring data found',
    grantType,
    scoringConfig
  })

  try {
    // Find matching scoring data for the provided questionIds
    const rawScores = score(scoringConfig)(answers)
    const finalResult = mapToFinalResult(scoringConfig, rawScores)
    log(LogCodes.SCORING.FINAL_RESULT, {
      msg: 'Scoring final results',
      grantType,
      rawScores,
      finalResult
    })
    return h.response(finalResult).code(statusCodes.ok)
  } catch (error) {
    log(LogCodes.SCORING.CONVERSION_ERROR, { grantType, error })
    return h
      .response({
        statusCode: statusCodes.badRequest,
        error: 'Bad Request',
        message: error.message
      })
      .code(statusCodes.badRequest)
  }
}
