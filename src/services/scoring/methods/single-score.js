/**
 * Processes scoring data and returns the score for a given question
 * @param {import("~/src/config/scoring-types.js").Question} questionScoringConfig - The question scoring config containing answers and scores.
 * @param {string[]} userAnswers - Array of input values with single user answers.
 * @returns {import("~/src/config/scoring-types.js").ScoreResult} A score result with numeric value and band.
 * @throws {Error} Throws if the `userAnswer` is not found in the scoring rules.
 */
function singleScore(questionScoringConfig, userAnswers) {
  if (userAnswers.length > 1) {
    throw new Error(
      `Multiple answers provided for single-answer question: ${questionScoringConfig.id}`
    )
  }

  const matchingAnswer = questionScoringConfig.answers.find(
    (answer) => answer.answer === userAnswers[0]
  )

  if (!matchingAnswer) {
    throw new Error(
      `Answer "${userAnswers[0]}" not found in question: ${questionScoringConfig.id}.`
    )
  }

  const value = matchingAnswer.score
  const foundBand = questionScoringConfig.scoreBand.find(
    (scoreBand) => value >= scoreBand.minValue && value <= scoreBand.maxValue
  )
  const band = foundBand ? foundBand.name : null
  return { value, band }
}

export default singleScore
