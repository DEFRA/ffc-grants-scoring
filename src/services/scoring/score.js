/**
 * Calculates and evaluates the score based on provided scoring data, an answer, and a predicate function.
 * @param {import("~/src/config/scoring-types.js").ScoringConfig} scoringConfig - The data used for scoring, containing scoring criteria or rules.
 * @returns {Function} A function that takes an answer object and returns another function.
 * @throws {TypeError} Throws if `scoringData` is not an array.
 * @throws {Error} Throws if a question ID is not found in the scoring data.
 * The returned function accepts a predicate function to process and evaluate the scoring.
 */
function score(scoringConfig) {
  return (answers) => {
    const scoredAnswers = answers.map(({ questionId, answers }) => {
      const question = scoringConfig.questions.find((q) => q.id === questionId)
      if (!question) {
        throw new Error(
          `Question with id ${questionId} not found in scoringData.`
        )
      }

      const predicate = question.scoreMethod
      const score = predicate(question, answers)

      return { questionId, score }
    })
    return scoredAnswers
  }
}

export default score
