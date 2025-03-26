import { ScoreBands } from '../../../config/score-bands.js'
import matrixScore from './matrix-score.js' // adjust path as needed

/**
 * Question config.
 * @type {import("~/src/config/scoring-types.js").Question[]} questionConfig
 */
const questionConfig = [
  {
    id: 'matrixScore',
    scoreDependency: 'matrixDependency',
    answers: [
      {
        answer: 'matrixScoreA',
        score: {
          dependentQuestionA: 1,
          dependentQuestionB: 2,
          dependentQuestionC: 3,
          dependentQuestionD: 4
        }
      },
      {
        answer: 'matrixScoreB',
        score: {
          dependentQuestionA: 2,
          dependentQuestionB: 4,
          dependentQuestionC: 6,
          dependentQuestionD: 8
        }
      }
    ],
    maxScore: 8,
    scoreBand: [
      { name: ScoreBands.WEAK, minValue: 0, maxValue: 2 },
      { name: ScoreBands.MEDIUM, minValue: 3, maxValue: 5 },
      { name: ScoreBands.STRONG, minValue: 6, maxValue: 8 }
    ]
  },
  {
    id: 'dependentQuestion',
    isDependency: true
  }
]

describe('matrixScore', () => {
  it.each([
    {
      answer: 'matrixScoreA',
      dependentAnswer: 'dependentQuestionA',
      expectedScore: 1
    },
    {
      answer: 'matrixScoreA',
      dependentAnswer: 'dependentQuestionB',
      expectedScore: 2
    },
    {
      answer: 'matrixScoreA',
      dependentAnswer: 'dependentQuestionC',
      expectedScore: 3
    },
    {
      answer: 'matrixScoreA',
      dependentAnswer: 'dependentQuestionD',
      expectedScore: 4
    },
    {
      answer: 'matrixScoreB',
      dependentAnswer: 'dependentQuestionA',
      expectedScore: 2
    },
    {
      answer: 'matrixScoreB',
      dependentAnswer: 'dependentQuestionB',
      expectedScore: 4
    },
    {
      answer: 'matrixScoreB',
      dependentAnswer: 'dependentQuestionC',
      expectedScore: 6
    },
    {
      answer: 'matrixScoreB',
      dependentAnswer: 'dependentQuestionD',
      expectedScore: 8
    }
  ])(
    `should return correct matrix score result using answers $answer and $dependentAnswer`,
    ({ answer, dependentAnswer, expectedScore }) => {
      const result = matrixScore(questionConfig[0], [answer], {
        matrixDependency: [dependentAnswer]
      })
      expect(result.value).toBe(expectedScore)
    }
  )
})
