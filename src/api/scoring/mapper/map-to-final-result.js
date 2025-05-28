import { log, LogCodes } from '~/src/api/logging/log.js'

/**
 * Checks if the score belongs to a question that is only for scoring (not included in answers).
 * @param {import('~/src/api/scoring/mapper/scoring-mapper-types.js').RawScore} score
 * @param {import('~/src/config/scoring-types.js').ScoringConfig} scoringConfig
 * @returns {boolean}
 */
const isScoreOnly = (score, scoringConfig) => {
  const question = scoringConfig.questions.find(
    (q) => q.id === score.questionId
  )
  return question ? question.isScoreOnly : false
}

/**
 * Maps raw scoring results to the final formatted response.
 * @param {import("~/src/config/scoring-types.js").ScoringConfig} scoringConfig - The configuration data for scoring.
 * @param {Array<import("~/src/api/scoring/mapper/scoring-mapper-types.js").RawScore>} rawScores - The array of raw scoring results.
 * @returns {import("~/src/api/scoring/mapper/scoring-mapper-types.js").FormattedScoringResponse} The formatted scoring response.
 * @throws {TypeError} If `rawScores` is not an array.
 * @throws {Error} If no matching score band is found for the total score.
 */
function mapToFinalResult(scoringConfig, rawScores) {
  if (!Array.isArray(rawScores)) {
    throw new TypeError('rawScores must be an array')
  }

  const totalScore = rawScores.reduce(
    (sum, result) => sum + result.score.value,
    0
  )

  // Calculate max score by summing up the highest possible score for each question
  const maxScore = scoringConfig.maxScore
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0

  // Find the matching score band - handle case when no band matches
  const matchingBand = scoringConfig.scoreBand.find(
    (band) => totalScore >= band.minValue && totalScore <= band.maxValue
  )

  if (!matchingBand) {
    const error = `No matching score band found for total score ${totalScore}. Check configuration for scoreBand gaps.`
    log(LogCodes.SCORING.MATRIX_SCORE.GENERAL_ERROR, {
      error,
      questionId: 'final-scoring'
    })
    throw new Error(error)
  }

  const filteredScores = rawScores.filter(
    (score) => !isScoreOnly(score, scoringConfig)
  )

  return {
    answers: filteredScores,
    score: totalScore,
    status:
      percentage >= scoringConfig.eligibilityPercentageThreshold
        ? 'Eligible'
        : 'Ineligible',
    scoreBand: matchingBand.name
  }
}

export default mapToFinalResult
