/**
 * Maps raw scoring results to the final formatted response.
 * @param {import("~/src/config/scoring-types.js").ScoringConfig} scoringConfig - The configuration data for scoring.
 * @param {Array<import("~/src/api/scoring/mapper/scoring-mapper-types.js").RawScore>} rawScores - The array of raw scoring results.
 * @returns {import("~/src/api/scoring/mapper/scoring-mapper-types.js").FormattedScoringResponse} The formatted scoring response.
 * @throws {TypeError} If `rawScores` is not an array.
 * @throws {Error} If no matching score band is found for the total score.
 */
import { log, LogCodes } from '~/src/api/logging/log.js'

function mapToFinalResult(scoringConfig, rawScores) {
  if (!Array.isArray(rawScores)) {
    throw new TypeError('rawScores must be an array')
  }

  const score = rawScores.reduce((sum, result) => sum + result.score.value, 0)

  // Calculate max score by summing up the highest possible score for each question
  const maxScore = scoringConfig.maxScore
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0

  // Find the matching score band - handle case when no band matches
  const matchingBand = scoringConfig.scoreBand.find(
    (band) => score >= band.minValue && score <= band.maxValue
  )

  if (!matchingBand) {
    const error = `No matching score band found for total score ${score}. Check configuration for scoreBand gaps.`
    log(LogCodes.SCORING.MATRIX_SCORE.GENERAL_ERROR, {
      error,
      questionId: 'final-scoring'
    })
    throw new Error(error)
  }

  return {
    answers: rawScores,
    score,
    status:
      percentage >= scoringConfig.eligibilityPercentageThreshold
        ? 'Eligible'
        : 'Ineligible',
    scoreBand: matchingBand.name
  }
}

export default mapToFinalResult
