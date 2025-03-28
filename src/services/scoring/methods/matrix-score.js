import singleScore from './single-score.js'

/**
 * Calculates and returns the score for a given set of user answers based on the question scoring configuration
 * and dependent user answers.
 * @param {object} scoringConfig - The configuration object for scoring, including answers and dependency mappings.
 * @param {Array} userAnswers - The list of answers provided by the user.
 * @param {object} dependentUserAnswers - An object containing dependent answers referenced during score calculation.
 * @returns {{value: number, band: string}} The calculated score object based on the provided answers and scoring configuration.
 */
function matrixScore(scoringConfig, userAnswers, dependentUserAnswers) {
  const dependencyScoringConfig =
    dependentUserAnswers[scoringConfig.scoreDependency][0]

  const dependencyModifiedScores = scoringConfig.answers.map(
    ({ answer, score }) => ({
      answer,
      score: score[dependencyScoringConfig]
    })
  )

  return singleScore(
    { ...scoringConfig, answers: dependencyModifiedScores },
    userAnswers
  )
}

export default matrixScore
