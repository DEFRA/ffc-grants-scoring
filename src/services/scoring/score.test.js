import score from './score.js'
import multiScore from './methods/multi-score.js'
import singleScore from './methods/single-score.js'
import { ScoreBands } from '~/src/config/score-bands.js'

describe('score function', () => {
  const mockScoringConfig = {
    questions: [
      {
        id: 'singleAnswer',
        scoreMethod: singleScore,
        category: 'Category 1',
        fundingPriorities: ['Priority A'],
        answers: [
          { answer: 'A', score: 4 },
          { answer: 'B', score: 8 },
          { answer: 'None of the above', score: null }
        ],
        scoreBand: [
          { name: ScoreBands.WEAK, minValue: 0, maxValue: 3 },
          { name: ScoreBands.MEDIUM, minValue: 4, maxValue: 7 },
          { name: ScoreBands.STRONG, minValue: 8, maxValue: 8 }
        ],
        maxScore: 8
      },
      {
        id: 'multiAnswer',
        scoreMethod: multiScore,
        category: 'Category 2',
        fundingPriorities: ['Priority B', 'Priority C'],
        answers: [
          { answer: 'A', score: 4 },
          { answer: 'B', score: 4 },
          { answer: 'C', score: 2 },
          { answer: 'D', score: 2 },
          { answer: 'E', score: 0 },
          { answer: 'None of the above', score: null }
        ],
        scoreBand: [
          { name: ScoreBands.WEAK, minValue: 0, maxValue: 4 },
          { name: ScoreBands.MEDIUM, minValue: 5, maxValue: 8 },
          { name: ScoreBands.STRONG, minValue: 9, maxValue: 12 }
        ],
        maxScore: 12
      }
    ]
  }

  it('returns correct scores for valid singleAnswer question', () => {
    const answers = [{ questionId: 'singleAnswer', answers: ['A'] }]
    const result = score(mockScoringConfig)(answers)
    expect(result).toEqual([
      {
        questionId: 'singleAnswer',
        category: 'Category 1',
        fundingPriorities: ['Priority A'],
        score: { value: 4, band: ScoreBands.MEDIUM }
      }
    ])
  })

  it('returns correct scores for valid multiAnswer question', () => {
    const answers = [{ questionId: 'multiAnswer', answers: ['A', 'B', 'C'] }]
    const result = score(mockScoringConfig)(answers)
    expect(result).toEqual([
      {
        questionId: 'multiAnswer',
        category: 'Category 2',
        fundingPriorities: ['Priority B', 'Priority C'],
        score: { value: 10, band: ScoreBands.STRONG }
      }
    ])
  })

  it('handles None of the above correctly for singleAnswer', () => {
    const answers = [
      { questionId: 'singleAnswer', answers: ['None of the above'] }
    ]
    const result = score(mockScoringConfig)(answers)
    expect(result).toEqual([
      {
        questionId: 'singleAnswer',
        category: 'Category 1',
        fundingPriorities: ['Priority A'],
        score: { value: null, band: ScoreBands.WEAK }
      }
    ])
  })

  it('handles None of the above correctly for multiAnswer', () => {
    const answers = [
      { questionId: 'multiAnswer', answers: ['None of the above'] }
    ]
    const result = score(mockScoringConfig)(answers)
    expect(result).toEqual([
      {
        questionId: 'multiAnswer',
        category: 'Category 2',
        fundingPriorities: ['Priority B', 'Priority C'],
        score: { value: 0, band: ScoreBands.WEAK }
      }
    ])
  })

  it('throws an error if question ID is not found', () => {
    const answers = [{ questionId: 'invalidQuestion', answers: ['A'] }]
    expect(() => score(mockScoringConfig)(answers)).toThrow(
      'Question with id invalidQuestion not found in scoringData.'
    )
  })

  it('handles multiple answers correctly', () => {
    const answers = [
      { questionId: 'singleAnswer', answers: ['B'] },
      { questionId: 'multiAnswer', answers: ['A', 'C'] }
    ]
    const result = score(mockScoringConfig)(answers)
    expect(result).toEqual([
      {
        questionId: 'singleAnswer',
        category: 'Category 1',
        fundingPriorities: ['Priority A'],
        score: { value: 8, band: ScoreBands.STRONG }
      },
      {
        questionId: 'multiAnswer',
        category: 'Category 2',
        fundingPriorities: ['Priority B', 'Priority C'],
        score: { value: 6, band: ScoreBands.MEDIUM }
      }
    ])
  })
})
