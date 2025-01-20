import { getScoringConfig } from '~/src/config/scoring-config.js'
import score from '~/src/services/scoring/score.js'
import mapToFinalResult from '~/src/api/scoring/mapper/map-to-final-result.js'
import { statusCodes } from '../common/constants/status-codes.js'

export const handler = (request, h) => {
  const { answers } = request.payload
  const { grantType } = request.params

  const scoringConfig = getScoringConfig(grantType)

  if (!scoringConfig) {
    return h
      .response({ error: 'Invalid grant type' })
      .code(statusCodes.badRequest)
  }

  try {
    // Find matching scoring data for the provided questionIds
    const rawScores = score(scoringConfig)(answers)
    const finalResult = mapToFinalResult(scoringConfig, rawScores)
    return h.response(finalResult).code(statusCodes.ok)
  } catch (error) {
    return h.response(error.message).code(statusCodes.badRequest)
  }
}
