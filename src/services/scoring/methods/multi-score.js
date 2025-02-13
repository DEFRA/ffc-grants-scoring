/**
 * Processes scoring data and returns the total score for a given question,
 * supporting multiple answers.
 * @param {import("~/src/config/scoring-types.js").Question} questionScoringConfig - The question scoring config containing answers and scores.
 * @param {string[]} userAnswers - Array of input values representing user answers.
 * @returns {import("~/src/config/scoring-types.js").ScoreResult} A score result with numeric value and band.
 * @throws {Error} Throws if none of the `userAnswers` are found in the scoring rules.
 */
function multiScore(questionScoringConfig, userAnswers) {
  // @todo this code is nasty, if it remains in the repo it needs to be moved to middleware. Ideally we should never need this once DXT has completed their work.
  if (userAnswers.length === 1) {
    userAnswers = [...new Set(userAnswers[0].split(','))]
  }

  const scores = userAnswers.map((userAnswer) => {
    const matchingAnswer = questionScoringConfig.answers.find(
      (answer) => answer.answer === userAnswer
    )

    if (!matchingAnswer) {
      throw new Error(
        `Answer "${userAnswer}" not found in question: ${questionScoringConfig.id}.`
      )
    }

    return matchingAnswer.score
  })

  // Sum up all the valid scores
  const value = scores.reduce((total, score) => total + score, 0)
  const band =
    questionScoringConfig.scoreBand.find(
      (scoreBand) => value >= scoreBand.minValue && value <= scoreBand.maxValue
    ).name ?? null
  return { value, band }
}

export default multiScore
