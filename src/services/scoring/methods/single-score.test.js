import { ScoreBands } from '~/src/config/scoring-config.js'
import singleScore from './single-score.js' // adjust path as needed

/**
 * Question config.
 * @type {import("../../../config/scoring-types.js").Question}
 */
const questionConfig = {
  id: 'singleAnswer',
  answers: [
    { answer: 'A', score: 4 },
    { answer: 'B', score: 8 },
    { answer: 'None of the above', score: null }
  ],
  maxScore: 8,
  scoreBand: [
    { name: ScoreBands.WEAK, minValue: 0, maxValue: 3 },
    { name: ScoreBands.MEDIUM, minValue: 4, maxValue: 7 },
    { name: ScoreBands.STRONG, minValue: 8, maxValue: 8 }
  ]
}

describe('singleScore', () => {
  it('should return Strong for max score', () => {
    const result = singleScore(questionConfig, ['B'])
    expect(result.value).toBe(8)
    expect(result.band).toBe(ScoreBands.STRONG)
  })

  it('should return Medium for mid-range score', () => {
    const result = singleScore(questionConfig, ['A'])
    expect(result.value).toBe(4)
    expect(result.band).toBe(ScoreBands.MEDIUM)
  })

  it('should return Weak for null answer', () => {
    const result = singleScore(questionConfig, ['None of the above'])
    expect(result.value).toBeNull()
    expect(result.band).toBe(ScoreBands.WEAK)
  })

  it('should throw an error if more than one answer is provided', () => {
    const answers = ['A', 'B'] // Multiple answers

    expect(() => singleScore(questionConfig, answers)).toThrow(
      `Multiple answers provided for single-answer question: ${questionConfig.id}`
    )
  })

  it('should throw an error when answer is not found', () => {
    expect(() => {
      singleScore(questionConfig, ['C'])
    }).toThrow('Answer "C" not found in question scores.')
  })
})
