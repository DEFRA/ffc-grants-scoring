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
 * @param {object} questionScores
 * @param {string} userAnswer - The input value representing a category of crops.
 * @returns {number} A numeric value corresponding to the provided answer: 3 for 'Protected cropping', 2 for 'Fruit', 1 for 'Field-scale crops', or 0 for any other value.
 */
export function simpleScore(questionScores, userAnswer) {
  return questionScores[0].answers.find(
    (answer) => answer.answer === userAnswer
  ).score
}
