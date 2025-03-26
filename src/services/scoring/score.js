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
 * Splits deferred answers from answers to score.
 * @param {Array} filteredAnswers
 * @param {Map<string, Object>} questionMap
 * @returns {Array, Array} An array of deferred answers and an array of answers to score.
 */
function splitDeferredAnswers(filteredAnswers, questionMap) {
  return filteredAnswers.reduce(
    (acc, [questionId, answers]) => {
      const question = questionMap.get(questionId)

      if (question.isDependency) {
        acc.deferredAnswers.push([questionId, answers])
      } else {
        acc.answersToScore.push([questionId, answers])
      }

      return acc
    },
    { deferredAnswers: [], answersToScore: [] }
  )
}

/**
 * Scores valid answers based on scoring config.
 * @param {Array} filteredAnswers - The filtered user answers.
 * @param {Map<string, object>} questionMap - A Map of question ID to scoring config.
 * @returns {Array} The scored results.
 */
function scoreAnswers(filteredAnswers, questionMap) {
  const { deferredAnswers, answersToScore } = splitDeferredAnswers(
    filteredAnswers,
    questionMap
  )

  const deferredResults = []
  const scoreResults = answersToScore.flatMap(([questionId, answers]) => {
    const question = questionMap.get(questionId)
    const dependentUserAnswers = {}

    if (question.scoreDependency) {
      dependentUserAnswers[question.scoreDependency] = deferredAnswers.find(
        ([questionId]) => questionId === question.scoreDependency
      )[1]

      // dependentUserAnswers.adding-value = 'adding-value-A1'

      if (dependentUserAnswers[question.scoreDependency] === undefined) {
        throw new Error(
          `Answer for question "${question.scoreDependency}" not found, and is a dependency of "${question.id}".`
        )
      }
    }

    // Ensure responses are always an array
    const responses = Array.isArray(answers) ? answers : [answers]
    const score = question.scoreMethod(
      question,
      responses,
      dependentUserAnswers
    )

    if (question.scoreDependency) {
      const deferred = questionMap.get(question.scoreDependency)

      deferredResults.push({
        questionId: deferred.id,
        category: deferred.category,
        fundingPriorities: deferred.fundingPriorities,
        score
      })
    }

    return {
      questionId,
      category: question.category,
      fundingPriorities: question.fundingPriorities,
      score: question.scoreMethod(question, responses, dependentUserAnswers)
    }
  })

  return [...scoreResults, ...deferredResults]
}

/**
 * Calculates and evaluates the score based on provided scoring data and answers.
 * @param {import("~/src/config/scoring-types.js").ScoringConfig} scoringConfig - The scoring data.
 * @param {boolean} allowPartialScoring - Whether to allow partial scoring.
 * @returns {Function} A function that takes user answers and returns an array of scored results.
 * @throws {Error} If required questions are missing from user answers.
 */
function score(scoringConfig, allowPartialScoring) {
  const questionMap = new Map(scoringConfig.questions.map((q) => [q.id, q]))
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
        throw new Error(
          `Questions with id(s): ${missingQuestions.join(', ')} not found in user's answers.`
        )
      }
    }

    return scoreAnswers(filteredAnswers, questionMap)
  }
}

export default score
