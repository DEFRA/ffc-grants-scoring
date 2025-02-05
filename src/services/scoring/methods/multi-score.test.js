import { ScoreBands } from '../../../config/score-bands.js'
import multiScore from './multi-score.js' // adjust path as needed

/**
 * Question config.
 * @type {import("../../../config/scoring-types.js").Question}
 */
const questionConfig = {
  id: 'multiAnswer',
  answers: [
    { answer: 'A', score: 4 },
    { answer: 'B', score: 4 },
    { answer: 'C', score: 2 },
    { answer: 'D', score: 2 },
    { answer: 'E', score: 0 },
    { answer: 'None of the above', score: null }
  ],
  maxScore: 12,
  scoreBand: [
    { name: ScoreBands.WEAK, minValue: 0, maxValue: 4 },
    { name: ScoreBands.MEDIUM, minValue: 5, maxValue: 8 },
    { name: ScoreBands.STRONG, minValue: 9, maxValue: 12 }
  ]
}

describe('multiScore', () => {
  it('should return Strong for max score', () => {
    const result = multiScore(questionConfig, ['A', 'B', 'C', 'D'])
    expect(result.value).toBe(12) // Sum of 4 + 4 + 2 + 2
    expect(result.band).toBe(ScoreBands.STRONG) // Falls between 9 and 12
  })

  it('should return Medium for mid-range score', () => {
    const result = multiScore(questionConfig, ['A', 'C']) // 4 + 2 = 6
    expect(result.value).toBe(6) // Sum of 4 + 2
    expect(result.band).toBe(ScoreBands.MEDIUM) // Falls between 5 and 8
  })

  it('should return Weak for low score', () => {
    const result = multiScore(questionConfig, ['E']) // Score is 0
    expect(result.value).toBe(0)
    expect(result.band).toBe(ScoreBands.WEAK) // Falls between 0 and 4
  })

  it('should return Strong for high score', () => {
    const result = multiScore(questionConfig, ['A', 'B', 'C']) // 4 + 4 + 2 = 10
    expect(result.value).toBe(10)
    expect(result.band).toBe(ScoreBands.STRONG) // Falls between 9 and 12
  })

  it('should return null score for "None of the above" answer', () => {
    const result = multiScore(questionConfig, ['None of the above']) // Score is null
    expect(result.value).toBe(0) // No score should be given
    expect(result.band).toBe(ScoreBands.WEAK) // Falls within Weak by default
  })

  it('should throw an error when answer is not found', () => {
    expect(() => {
      multiScore(questionConfig, ['F']) // Invalid answer
    }).toThrow('Answer "F" not found in question: multiAnswer.')
  })

  it('should throw an error when answer is not provided', () => {
    expect(() => {
      multiScore(questionConfig, []) // No answer provided
    }).toThrow('Answers not provided for question: multiAnswer.')
  })
})
