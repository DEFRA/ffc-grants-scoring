import { ScoreBands } from '../../../config/score-bands.js'
import multiScore from './multi-score.js'
import matrixScore from '~/src/services/scoring/methods/matrix-score.js' // adjust path as needed

/**
 * Question config.
 * @type {import("../../../config/scoring-types.js").Question}
 */
const questionConfig = [
  {
    id: 'matrixScore',
    scoreDependency: 'matrixDependency',
    answers: [
      { answer: 'A', score: { A: 1, B: 2, C: 3, D: 4 } },
      { answer: 'B', score: { A: 2, B: 4, C: 6, D: 8 } }
    ],
    maxScore: 8,
    scoreBand: [
      { name: ScoreBands.WEAK, minValue: 0, maxValue: 2 },
      { name: ScoreBands.MEDIUM, minValue: 3, maxValue: 5 },
      { name: ScoreBands.STRONG, minValue: 6, maxValue: 8 }
    ]
  },
  {
    id: 'matrixDependency',
    isDependency: true
  }
]

describe('matrixScore', () => {
  it.each([
    {
      answer: 'A',
      dependentAnswer: 'A',
      expectedScore: 1
    },
    {
      answer: 'A',
      dependentAnswer: 'B',
      expectedScore: 2
    },
    {
      answer: 'A',
      dependentAnswer: 'C',
      expectedScore: 3
    },
    {
      answer: 'A',
      dependentAnswer: 'D',
      expectedScore: 4
    },
    {
      answer: 'B',
      dependentAnswer: 'A',
      expectedScore: 2
    },
    {
      answer: 'B',
      dependentAnswer: 'B',
      expectedScore: 4
    },
    {
      answer: 'B',
      dependentAnswer: 'C',
      expectedScore: 6
    },
    {
      answer: 'B',
      dependentAnswer: 'D',
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
