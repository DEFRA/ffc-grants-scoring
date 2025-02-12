/**
 * Calculates and evaluates the score based on provided scoring data, an answer, and a predicate function.
 * @param {import("~/src/config/scoring-types.js").ScoringConfig} scoringConfig - The data used for scoring, containing scoring criteria or rules.
 * @returns {Function} A function that takes an answer object and returns another function.
 * @throws {TypeError} Throws if `scoringData` is not an array.
 * @throws {Error} Throws if a question ID is not found in the scoring data.
 * The returned function accepts a predicate function to process and evaluate the scoring.
 */
function score(scoringConfig) {
  return (userAnswers) => {
    const scoringConfigQuestionIds = scoringConfig.questions.map(
      (value) => value.id
    )

    // @todo - This code is not optimised and can be improved
    // filter out all userAnswers that are not in the scoring data
    const filteredAnswers = userAnswers.filter(({ questionId }) =>
      scoringConfigQuestionIds.includes(questionId)
    )

    const userAnswerQuestionIds = filteredAnswers.map(
      ({ questionId }) => questionId
    )

    const questionsDiff = scoringConfigQuestionIds.reduce((acc, questionId) => {
      if (!userAnswerQuestionIds.includes(questionId)) {
        acc.push(questionId)
      }
      return acc
    }, [])

    if (questionsDiff.length > 0) {
      throw new Error(
        `Questions with id(s) ${questionsDiff.join(', ')} not found in users answers.`
      )
    }

    const scoredAnswers = filteredAnswers.map(
      ({ questionId, answers: responses }) => {
        const question = scoringConfig.questions.find(
          (q) => q.id === questionId
        )

        const predicate = question.scoreMethod
        const calculatedScore = predicate(question, responses)
        const category = question.category
        const fundingPriorities = question.fundingPriorities

        return {
          questionId,
          category,
          fundingPriorities,
          score: calculatedScore
        }
      }
    )

    return scoredAnswers
  }
}

export default score
