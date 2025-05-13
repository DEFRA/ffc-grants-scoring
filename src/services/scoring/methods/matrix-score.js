import { log, LogCodes } from '~/src/api/logging/log.js'

/**
 * Calculates and returns the score for a given set of user answers based on the question scoring configuration
 * and dependent user answers.
 * @param {object} scoringConfig - The configuration object for scoring, including answers and dependency mappings.
 * @param {Array} userAnswers - The list of answers provided by the user.
 * @param {object} dependentUserAnswers - An object containing dependent answers referenced during score calculation.
 * @returns {{value: number, band: string}} The calculated score object based on the provided answers and scoring configuration.
 * @throws {Error} If there are issues with dependency answers, user answers, or finding matching score configurations.
 */
function matrixScore(scoringConfig, userAnswers, dependentUserAnswers) {
  // Validate that scoringConfig has an id
  if (!scoringConfig.id) {
    log(LogCodes.SCORING.MATRIX_SCORE.GENERAL_ERROR, {
      error: 'Missing question ID in scoring configuration',
      questionId: 'config-error'
    })
    throw new Error('Missing question ID in scoring configuration')
  }

  const questionId = scoringConfig.id

  try {
    // Validate inputs and extract necessary values
    validateInputs(scoringConfig, userAnswers, dependentUserAnswers, questionId)

    const userAnswer = userAnswers[0]
    const dependencyAnswer = normalizeDependencyAnswer(
      dependentUserAnswers[scoringConfig.scoreDependency],
      scoringConfig.scoreDependency,
      questionId
    )

    // Find matching answer and get score
    const matchingAnswer = findMatchingAnswer(
      scoringConfig,
      userAnswer,
      questionId
    )
    const value = getScoreValue(matchingAnswer, dependencyAnswer, questionId)

    // Find matching band
    const matchingBand = findMatchingBand(scoringConfig, value, questionId)

    return { value, band: matchingBand.name }
  } catch (error) {
    // Log the error and rethrow to ensure it's properly handled upstream
    log(LogCodes.SCORING.MATRIX_SCORE.GENERAL_ERROR, {
      error: error.message,
      questionId
    })
    throw error
  }
}

/**
 * Validates the inputs for matrix scoring
 * @param {object} scoringConfig - The configuration object for scoring
 * @param {Array} userAnswers - The list of answers provided by the user
 * @param {object} dependentUserAnswers - An object containing dependent answers referenced during score calculation
 * @param {string} questionId - The ID of the question being scored
 * @throws {Error} If there are issues with the inputs
 */
function validateInputs(
  scoringConfig,
  userAnswers,
  dependentUserAnswers,
  questionId
) {
  // Check if userAnswers array exists and is not empty
  if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
    log(LogCodes.SCORING.MATRIX_SCORE.INVALID_USER_ANSWERS, { questionId })
    throw new Error(
      `User answers array is empty or invalid for question: ${questionId}`
    )
  }

  // Check for missing dependency key
  if (!(scoringConfig.scoreDependency in dependentUserAnswers)) {
    log(LogCodes.SCORING.MATRIX_SCORE.MISSING_DEPENDENCY, {
      dependency: scoringConfig.scoreDependency,
      questionId
    })
    throw new Error(
      `Dependency answer for ${scoringConfig.scoreDependency} is missing`
    )
  }
}

/**
 * Normalizes the dependency answer
 * @param {string|Array} dependencyAnswerRaw - The raw dependency answer that could be a string or array
 * @param {string} dependencyKey - The key for the dependency in the dependentUserAnswers object
 * @param {string} questionId - The ID of the question being scored
 * @returns {string} The normalized dependency answer
 * @throws {Error} If the dependency answer is missing, empty, or an array (multiple answers not supported)
 */
function normalizeDependencyAnswer(
  dependencyAnswerRaw,
  dependencyKey,
  questionId
) {
  // Check for null/undefined dependency answer
  if (dependencyAnswerRaw == null) {
    log(LogCodes.SCORING.MATRIX_SCORE.MISSING_DEPENDENCY, {
      dependency: dependencyKey,
      questionId
    })
    throw new Error(`Dependency answer for ${dependencyKey} is missing`)
  }

  // Check if the dependency answer is an array (multiple selections)
  if (Array.isArray(dependencyAnswerRaw)) {
    log(LogCodes.SCORING.MATRIX_SCORE.GENERAL_ERROR, {
      error: `Multiple dependency answers not supported for ${dependencyKey}`,
      questionId
    })
    throw new Error(
      `Multiple dependency answers not supported for ${dependencyKey} in question: ${questionId}`
    )
  }

  // Check for empty dependency answer
  if (dependencyAnswerRaw === '') {
    log(LogCodes.SCORING.MATRIX_SCORE.EMPTY_DEPENDENCY, {
      dependency: dependencyKey,
      questionId
    })
    throw new Error(`Processed dependency answer for ${dependencyKey} is empty`)
  }

  return dependencyAnswerRaw
}

/**
 * Finds the matching answer configuration
 * @param {object} scoringConfig - The configuration object for scoring
 * @param {string} userAnswer - The user's answer to match against configurations
 * @param {string} questionId - The ID of the question being scored
 * @returns {object} The matching answer configuration
 * @throws {Error} If no matching answer is found
 */
function findMatchingAnswer(scoringConfig, userAnswer, questionId) {
  const matchingAnswer = scoringConfig.answers.find(
    (answer) => answer.answer === userAnswer
  )

  if (!matchingAnswer) {
    log(LogCodes.SCORING.MATRIX_SCORE.ANSWER_NOT_FOUND, {
      answer: userAnswer,
      questionId
    })
    throw new Error(
      `Answer "${userAnswer}" not found in question: ${questionId}`
    )
  }

  return matchingAnswer
}

/**
 * Gets the score value from the matrix
 * @param {object} matchingAnswer - The answer configuration that matches the user's answer
 * @param {string} dependencyAnswer - The normalized dependency answer
 * @param {string} questionId - The ID of the question being scored
 * @returns {number} The score value
 * @throws {Error} If no score is found for the dependency answer
 */
function getScoreValue(matchingAnswer, dependencyAnswer, questionId) {
  const value = matchingAnswer.score[dependencyAnswer]

  if (value === undefined) {
    log(LogCodes.SCORING.MATRIX_SCORE.NO_SCORE_FOR_DEPENDENCY, {
      dependency: dependencyAnswer,
      questionId
    })
    throw new Error(
      `No score found for dependency answer "${dependencyAnswer}" in question: ${questionId}`
    )
  }

  return value
}

/**
 * Finds the matching score band
 * @param {object} scoringConfig - The configuration object for scoring
 * @param {number} value - The calculated score value
 * @param {string} questionId - The ID of the question being scored
 * @returns {object} The matching score band
 * @throws {Error} If no matching score band is found
 */
function findMatchingBand(scoringConfig, value, questionId) {
  const matchingBand = scoringConfig.scoreBand.find(
    (band) => value >= band.minValue && value <= band.maxValue
  )

  if (!matchingBand) {
    const error = `No matching score band found for value ${value} in question: ${questionId}`
    log(LogCodes.SCORING.MATRIX_SCORE.GENERAL_ERROR, {
      error,
      questionId
    })
    throw new Error(error)
  }

  return matchingBand
}

export default matrixScore
