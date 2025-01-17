import { scoringConfig } from '../../config/scoring-config.js'
import mapToFinalResult from '../../../src/services/scoring/scoring-mapper.js'
import score from '../../services/scoring/score.js'

export const handler = (request, h) => {
  const { answers } = request.payload

  try {
    // Find matching scoring data for the provided questionIds
    const rawScores = score(scoringConfig)(answers)
    const finalResult = mapToFinalResult(scoringConfig, rawScores)
    return h.response(finalResult).code(200)
  } catch (error) {
    return h.response(error.message).code(400)
  }
}
