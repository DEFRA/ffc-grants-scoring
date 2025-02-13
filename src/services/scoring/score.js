/**
 * Filters user answers, keeping only those that exist in the scoring config.
 * @param {object} userAnswers - The user's provided answers.
 * @param {Set<string>} validQuestionIds - The set of valid question IDs.
 * @returns {Array} Filtered user answers as an array of [questionId, answers].
 */
function filterValidAnswers(userAnswers, validQuestionIds) {
  return Object.entries(userAnswers).filter(([questionId]) =>
    validQuestionIds.has(questionId)
  )
}

/**
 * Finds questions that are in the scoring config but missing from user answers.
 * @param {Array} filteredAnswers - User answers after filtering.
 * @param {Set<string>} requiredQuestionIds - The set of all required question IDs.
 * @returns {Array} The IDs of missing questions.
 */
function findMissingQuestions(filteredAnswers, requiredQuestionIds) {
  const userAnswerQuestionIds = new Set(
    filteredAnswers.map(([questionId]) => questionId)
  )
  return [...requiredQuestionIds].filter((id) => !userAnswerQuestionIds.has(id))
}

/**
 * Scores valid answers based on scoring config.
 * @param {Array} filteredAnswers - The filtered user answers.
 * @param {Map<string, object>} questionMap - A Map of question ID to scoring config.
 * @returns {Array} The scored results.
 */
function scoreAnswers(filteredAnswers, questionMap) {
  return filteredAnswers.map(([questionId, answers]) => {
    const question = questionMap.get(questionId)

    // Ensure responses are always an array
    const responses = Array.isArray(answers) ? answers : [answers]

    return {
      questionId,
      category: question.category,
      fundingPriorities: question.fundingPriorities,
      score: question.scoreMethod(question, responses)
    }
  })
}

/**
 * Calculates and evaluates the score based on provided scoring data and answers.
 * @param {import("~/src/config/scoring-types.js").ScoringConfig} scoringConfig - The scoring data.
 * @param {{ allowPartialScoring: Boolean } [Object]} - Scoring options
 * @returns {Function} A function that takes user answers and returns an array of scored results.
 * @throws {Error} If required questions are missing from user answers.
 */
function score(scoringConfig, options = {}) {
  const questionMap = new Map(scoringConfig.questions.map((q) => [q.id, q]))
  const scoringConfigQuestionIds = new Set(questionMap.keys())

  return (userAnswers) => {
    const filteredAnswers = filterValidAnswers(
      userAnswers,
      scoringConfigQuestionIds
    )

    if (!options.allowPartialScoring) {
      const missingQuestions = findMissingQuestions(
        filteredAnswers,
        scoringConfigQuestionIds
      )

      if (missingQuestions.length > 0) {
        throw new Error(
          `Questions with id(s) ${missingQuestions.join(', ')} not found in user's answers.`
        )
      }
    }

    return scoreAnswers(filteredAnswers, questionMap)
  }
}

export default score
