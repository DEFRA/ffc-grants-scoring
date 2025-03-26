import singleScore from '~/src/services/scoring/methods/single-score.js'

/**
 * Calculates and returns the score for a given set of user answers based on the question scoring configuration
 * and dependent user answers.
 * @param {object} questionScoringConfig - The configuration object for scoring, including answers and dependency mappings.
 * @param {Array} userAnswers - The list of answers provided by the user.
 * @param {object} dependentUserAnswers - An object containing dependent answers referenced during score calculation.
 * @returns {{value: number, band: string}} The calculated score object based on the provided answers and scoring configuration.
 */
function matrixScore(questionScoringConfig, userAnswers, dependentUserAnswers) {
  const dependentAnswer =
    dependentUserAnswers[questionScoringConfig.scoreDependency][0]
  const modifiedScoring = questionScoringConfig.answers.map(
    ({ answer, score }) => ({
      answer,
      score: score[dependentAnswer]
    })
  )

  return singleScore(
    { ...questionScoringConfig, answers: [...modifiedScoring] },
    userAnswers
  )
}

export default matrixScore
