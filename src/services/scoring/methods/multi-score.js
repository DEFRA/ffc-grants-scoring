/**
 * Processes scoring data and returns the total score for a given question,
 * supporting multiple answers.
 * @param {import("~/src/config/scoring-types.js").Question} questionScoringConfig - The question scoring config containing answers and scores.
 * @param {string[]} userAnswers - Array of input values representing user answers.
 * @returns {import("~/src/config/scoring-types.js").ScoreResult} A score result with numeric value and band.
 * @throws {Error} Throws if none of the `userAnswers` are found in the scoring rules.
 */
function multiScore(questionScoringConfig, userAnswers) {
  const scores = userAnswers.map((userAnswer) => {
    const matchingScoreConfig = questionScoringConfig.answers.find(
      (scoringComponent) => scoringComponent.answer === userAnswer
    )

    if (!matchingScoreConfig) {
      throw new Error(
        `Answer "${userAnswer}" not found in question: ${questionScoringConfig.id}.`
      )
    }

    // This is needed to allow "None of the above" to be handled correctly but also to ensure that
    // the types are correct for the following scores.reduce function. Ideally we would like
    // to throw an error here to catch invalid scoring configurations passed in to multiScore
    if (typeof matchingScoreConfig.score !== 'number') {
      matchingScoreConfig.score = 0
    }

    /** @type {number} */
    return matchingScoreConfig.score
  })

  // Sum up all the valid scores
  const value = scores.reduce((total, score) => total + score, 0)
  const foundBand = questionScoringConfig.scoreBand.find(
    (scoreBand) => value >= scoreBand.minValue && value <= scoreBand.maxValue
  )
  const band = foundBand ? foundBand.name : null

  return { value, band }
}

export default multiScore
