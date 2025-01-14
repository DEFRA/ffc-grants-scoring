/**
 * Calculates and evaluates the score based on provided scoring data, an answer, and a predicate function.
 * @param {Array} scoringData - The data used for scoring, containing scoring criteria or rules.
 * @returns {Function} A function that takes an answer object and returns another function.
 * @throws {TypeError} Throws if `scoringData` is not an array.
 * @throws {Error} Throws if a question ID is not found in the scoring data.
 * The returned function accepts a predicate function to process and evaluate the scoring.
 */
export function score(scoringData) {
  if (!Array.isArray(scoringData)) {
    throw new TypeError('scoringData must be an array')
  }

  return (...questionIds) => {
    const questionData = questionIds.map((questionId) => {
      const question = scoringData.find((q) => q.id === questionId)
      if (!question) {
        throw new Error(
          `Question with id ${questionId} not found in scoringData.`
        )
      }
      return question
    })

    return (answer) => (predicate) => predicate(questionData, answer)
  }
}
