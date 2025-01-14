import { simpleScore } from '~/src/services/scoring/simple-score.js'
import { scoringData } from '../../../src/config/scoring-data.js'
import { score } from '../../services/scoring/score.js'

export const handler = (request, h) => {
  const { answers } = request.payload

  // Extract question IDs and answers
  const questionId = answers.map((answer) => answer.questionId)[0]
  const answer = answers.map((answer) => answer.answer)[0]

  try {
    // Find matching scoring data for the provided questionIds
    const result = score(scoringData)(questionId)(answer)(simpleScore)
    return h.response({ message: String(result) }).code(200)
  } catch (error) {
    return h.response({ message: error.message }).code(400)
  }
}
