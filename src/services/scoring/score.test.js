import score from './score.js'
import multiScore from './methods/multi-score.js'
import singleScore from './methods/single-score.js'
import { ScoreBands } from '~/src/config/score-bands.js'

describe('score function', () => {
  const questions = {
    singleAnswer: {
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
    multiAnswer: {
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
  }

  const mockScoringConfig = (...pageId) => {
    const scoringConfig = { questions: [] }
    pageId.forEach((page) => {
      scoringConfig.questions.push(questions[page])
    })
    return scoringConfig
  }

  it('should error when user answers does not include a required question', () => {
    const answers = { 'not singleAnswer': ['A'] }
    const mockConfig = mockScoringConfig('singleAnswer')

    expect(() => score(mockConfig, false)(answers)).toThrow(
      `Questions with id(s): singleAnswer not found in user's answers.`
    )
  })

  it('should not error when user answers do not include required questions and allowPartialScoring is enabled', () => {
    const answers = { singleAnswer: ['A'] }
    const mockConfig = mockScoringConfig('singleAnswer', 'multiAnswer')

    expect(() => score(mockConfig, true)(answers)).not.toThrow()
  })

  it('should ignore questions that are not in the scoring data', () => {
    const answers = {
      singleAnswer: ['A'],
      noScoringQuestion: ['B']
    }
    const mockConfig = mockScoringConfig('singleAnswer')

    const result = score(mockConfig)(answers)
    expect(result).toHaveLength(1)
  })

  it('returns correct scores for valid singleAnswer question', () => {
    const answers = { singleAnswer: ['A'] }
    const mockConfig = mockScoringConfig('singleAnswer')
    const result = score(mockConfig)(answers)
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
    const answers = { multiAnswer: ['A', 'B', 'C'] }
    const mockConfig = mockScoringConfig('multiAnswer')
    const result = score(mockConfig)(answers)
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
    const answers = { singleAnswer: ['None of the above'] }
    const mockConfig = mockScoringConfig('singleAnswer')
    const result = score(mockConfig)(answers)
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
    const answers = { multiAnswer: ['None of the above'] }
    const mockConfig = mockScoringConfig('multiAnswer')
    const result = score(mockConfig)(answers)
    expect(result).toEqual([
      {
        questionId: 'multiAnswer',
        category: 'Category 2',
        fundingPriorities: ['Priority B', 'Priority C'],
        score: { value: 0, band: ScoreBands.WEAK }
      }
    ])
  })

  it('handles multiple answers correctly', () => {
    const answers = {
      singleAnswer: ['B'],
      multiAnswer: ['A', 'C']
    }
    const mockConfig = mockScoringConfig('singleAnswer', 'multiAnswer')
    const result = score(mockConfig)(answers)
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

  it('handles a single non-array answer gracefully', () => {
    const answers = { singleAnswer: 'A' }
    const mockConfig = mockScoringConfig('singleAnswer')
    const result = score(mockConfig)(answers) // Ensure it's wrapped in an array
    expect(result).toEqual([
      {
        questionId: 'singleAnswer',
        category: 'Category 1',
        fundingPriorities: ['Priority A'],
        score: { value: 4, band: ScoreBands.MEDIUM }
      }
    ])
  })
})
