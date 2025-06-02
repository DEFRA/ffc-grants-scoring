// Error Message Constants
const ERROR_MESSAGES = {
  MISSING_DEPENDENCY: (questionId, dependencyId) =>
    `Answer for question "${dependencyId}" not found, and is a dependency of "${questionId}".`,
  QUESTIONS_MISSING: (missingIds) =>
    `Questions with id(s): ${missingIds.join(', ')} not found in user's answers.`
}

/**
 * Converts the input into an array if it is not already an array.
 * For string values with commas, splits them into an array.
 * @param {any} responses - The input value to be converted to an array.
 * @returns {Array} Returns an array.
 */
function toArray(responses) {
  if (Array.isArray(responses)) {
    return responses
  }

  // Handle comma-separated strings for multi-select fields
  if (typeof responses === 'string' && responses.includes(',')) {
    return responses.split(',')
  }

  return [responses]
}

/**
 * Finds and returns the answer value for a dependency ID within the deferred answers array.
 * If the dependency ID does not exist in the array, an error is thrown.
 * @param {Array} dependentAnswers - An array of deferred answers where each entry is a tuple containing an ID and its respective value.
 * @param {string|number} dependencyId - The ID of the dependency to be located in the deferred answers array.
 * @param {string|number} questionId - The ID of the question linked to the dependency.
 * @returns {*} The value associated with the specified dependency ID.
 * @throws {Error} If the dependency ID is not found in the deferred answers array.
 */
function findDependencyAnswer(dependentAnswers, dependencyId, questionId) {
  const dependencyValue = dependentAnswers.find(([id]) => id === dependencyId)
  if (!dependencyValue) {
    throw new Error(ERROR_MESSAGES.MISSING_DEPENDENCY(questionId, dependencyId))
  }
  return dependencyValue[1]
}

/**
 * Filters user answers, retaining only those present in the scoring configuration.
 * @param {object} userAnswers - The user's provided answers.
 * @param {Set<string>} validQuestionIds - Valid question IDs set.
 * @returns {Array} Filtered valid answers.
 */
function filterValidAnswers(userAnswers, validQuestionIds) {
  return Object.entries(userAnswers).filter(([questionId]) =>
    validQuestionIds.has(questionId)
  )
}

/**
 * Finds IDs for required questions not present in user answers.
 * @param {Array} filteredAnswers - Filtered valid answers.
 * @param {Set<string>} requiredQuestionIds - All required question IDs.
 * @returns {Array} IDs of missing questions.
 */
function findMissingQuestions(filteredAnswers, requiredQuestionIds) {
  const answeredIds = new Set(filteredAnswers.map(([questionId]) => questionId))
  return [...requiredQuestionIds].filter((id) => !answeredIds.has(id))
}

/**
 * Splits the filtered answers into deferred answers and direct scoring answers.
 * @param {Array} filteredAnswers - Filtered valid answers.
 * @param {Map<string, object>} questionMap - Question configuration map.
 * @returns {object} Object containing deferredAnswers and answersToScore arrays.
 */
function splitDeferredAnswers(filteredAnswers, questionMap) {
  return filteredAnswers.reduce(
    (acc, [questionId, answers]) => {
      const question = questionMap.get(questionId)
      const target = question.isDependency
        ? acc.deferredAnswers
        : acc.answersToScore
      target.push([questionId, answers])
      return acc
    },
    { deferredAnswers: [], answersToScore: [] }
  )
}

/**
 * Scores the user answers based on the provided scoring configurations.
 * @param {Array} filteredAnswers - Filtered valid answers.
 * @param {Map<string, object>} questionMap - Question configuration map.
 * @returns {Array} Scored answers array.
 */
function scoreAnswers(filteredAnswers, questionMap) {
  const { deferredAnswers, answersToScore } = splitDeferredAnswers(
    filteredAnswers,
    questionMap
  )

  const results = []

  answersToScore.forEach(([questionId, answers]) => {
    const question = questionMap.get(questionId)
    const dependentAnswers = {}

    if (question.scoreDependency) {
      dependentAnswers[question.scoreDependency] = findDependencyAnswer(
        deferredAnswers,
        question.scoreDependency,
        questionId
      )
    }

    const answersScored = question.scoreMethod(
      question,
      toArray(answers),
      dependentAnswers
    )

    results.push({
      questionId,
      changeLink: question.changeLink,
      category: question.category,
      fundingPriorities: question.fundingPriorities,
      score: answersScored
    })

    if (question.scoreDependency) {
      const dependentQuestion = questionMap.get(question.scoreDependency)
      results.push({
        questionId: dependentQuestion.id,
        changeLink: dependentQuestion.changeLink,
        score: { ...answersScored, value: 0 }
      })
    }
  })

  return results
}

/**
 * Returns a function to score user answers.
 * @param {object} scoringConfig - Scoring configuration.
 * @param {boolean} allowPartialScoring - Flag for allowing partial scoring.
 * @returns {Function} User answer scoring function.
 */
function score(scoringConfig, allowPartialScoring) {
  const questionMap = new Map(
    scoringConfig.questions.map((question) => [question.id, question])
  )
  const scoringConfigQuestionIds = new Set(questionMap.keys())

  return (userAnswers) => {
    const filteredAnswers = filterValidAnswers(
      userAnswers,
      scoringConfigQuestionIds
    )

    if (!allowPartialScoring) {
      const missingQuestions = findMissingQuestions(
        filteredAnswers,
        scoringConfigQuestionIds
      )

      if (missingQuestions.length > 0) {
        throw new Error(ERROR_MESSAGES.QUESTIONS_MISSING(missingQuestions))
      }
    }

    return scoreAnswers(filteredAnswers, questionMap)
  }
}

export default score
