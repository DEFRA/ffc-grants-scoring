/**
 * Processes scoring data and returns the scor of a given question
 * @param {Array} questionScores - Array of question data containing answers and scores.
 * @param {string} userAnswer - The input value representing a category of crops.
 * @returns {number} A numeric value corresponding to the provided answer.
 * @throws {TypeError} Throws if `questionScores` is not an array or missing.
 * @throws {Error} Throws if the `userAnswer` is not found in the scoring rules.
 */
export function simpleScore(questionScores, userAnswer) {
  if (
    !Array.isArray(questionScores) ||
    questionScores.length === 0 ||
    !questionScores[0]?.answers
  ) {
    throw new TypeError('questionScores must be a non-empty array')
  }

  const matchingAnswer = questionScores[0].answers.find(
    (answer) => answer.answer === userAnswer
  )

  if (!matchingAnswer) {
    throw new Error(`Answer "${userAnswer}" not found in question scores.`)
  }

  return matchingAnswer.score
}
