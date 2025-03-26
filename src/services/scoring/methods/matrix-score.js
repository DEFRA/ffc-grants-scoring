import singleScore from '~/src/services/scoring/methods/single-score.js'

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
