/**
 * Calculates and evaluates the score based on provided scoring data, an answer, and a predicate function.
 * @param {object} scoringData - The data used for scoring, containing scoring criteria or rules.
 * @returns {Function} A function that takes an answer object and returns another function.
 * The returned function accepts a predicate function to process and evaluate the scoring.
 */
export function score(scoringData) {
  return (...questionIds) => {
    const questionData = []

    questionIds.forEach((questionId) => {
      questionData.push(
        scoringData.find((question) => question.id === questionId)
      )
    })

    return (answer) => {
      return (predicate) => predicate(questionData, answer)
    }
  }
}

/**
 * Processes scoring data and returns the scor of a given question
 * @param {object} questionScores - Array of question data containing answers and scores.
 * @param {string} userAnswer - The input value representing a category of crops.
 * @returns {number} A numeric value corresponding to the provided answer
 */
export function simpleScore(questionScores, userAnswer) {
  if (
    !Array.isArray(questionScores) ||
    questionScores.length === 0 ||
    !questionScores[0]?.answers
  ) {
    throw new Error('Invalid questionScores structure.')
  }

  const matchingAnswer = questionScores[0].answers.find(
    (answer) => answer.answer === userAnswer
  )

  return matchingAnswer ? matchingAnswer.score : 0
}
