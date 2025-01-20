/**
 * Sums the scores of the given answers.
 * @param {Array} questionScores - Array of question score objects, each containing an `answers` array with score mappings.
 * @param {string[]} userAnswers - Array of user-provided answers.
 * @returns {number} The total score for matching answers.
 * @throws {Error} Throws an error if `questionScores` is not properly formatted.
 */
export function sum(questionScores, userAnswers) {
  if (!Array.isArray(questionScores) || questionScores.length === 0) {
    throw new Error('Invalid questionScores: must be a non-empty array.')
  }

  if (!Array.isArray(userAnswers)) {
    throw new Error('Invalid userAnswers: must be an array.')
  }

  return questionScores.reduce((total, question) => {
    if (!Array.isArray(question.answers)) {
      throw new Error(
        'Invalid questionScores format: answers must be an array.'
      )
    }

    const questionTotal = question.answers.reduce((acc, answer) => {
      if (userAnswers.includes(answer.answer)) {
        acc += answer.score
      }
      return acc
    }, 0)

    return total + questionTotal
  }, 0)
}
