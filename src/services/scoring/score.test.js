import score from './score.js'
import multiScore from './methods/multi-score.js'
import singleScore from './methods/single-score.js'
import matrixScore from './methods/matrix-score.js'
import { ScoreBands } from '~/src/config/score-bands.js'

describe('score function', () => {
  const questions = {
    singleAnswer: {
      id: 'singleAnswer',
      scoreMethod: singleScore,
      category: 'Category 1',
      changeLink: '/change-single-answer',
      fundingPriorities: ['Priority A'],
      answers: [
        { answer: 'A', score: 4 },
        { answer: 'B', score: 8 },
        { answer: 'None of the above', score: null }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 3 },
        { name: ScoreBands.AVERAGE, minValue: 4, maxValue: 7 },
        { name: ScoreBands.STRONG, minValue: 8, maxValue: 8 }
      ],
      maxScore: 8
    },
    multiAnswer: {
      id: 'multiAnswer',
      scoreMethod: multiScore,
      changeLink: '/change-multi-answer',
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
        { name: ScoreBands.AVERAGE, minValue: 5, maxValue: 8 },
        { name: ScoreBands.STRONG, minValue: 9, maxValue: 12 }
      ],
      maxScore: 12
    },
    matrixAnswer: {
      id: 'matrixAnswer',
      scoreMethod: matrixScore,
      changeLink: '/change-matrix-answer',
      scoreDependency: 'matrixDependency',
      category: 'Category 2',
      fundingPriorities: ['Priority B', 'Priority C'],
      answers: [
        {
          answer: 'matrixScoreA',
          score: {
            matrixDependencyA: 1,
            matrixDependencyB: 2,
            matrixDependencyC: 3,
            matrixDependencyD: 4
          }
        },
        {
          answer: 'matrixScoreB',
          score: {
            matrixDependencyA: 2,
            matrixDependencyB: 4,
            matrixDependencyC: 6,
            matrixDependencyD: 8
          }
        }
      ],
      maxScore: 8,
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 2 },
        { name: ScoreBands.AVERAGE, minValue: 3, maxValue: 5 },
        { name: ScoreBands.STRONG, minValue: 6, maxValue: 8 }
      ]
    },
    matrixDependency: {
      id: 'matrixDependency',
      isDependency: true,
      changeLink: '/change-matrix-dependency'
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
        changeLink: '/change-single-answer',
        fundingPriorities: ['Priority A'],
        score: { value: 4, band: ScoreBands.AVERAGE }
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
        changeLink: '/change-multi-answer',
        fundingPriorities: ['Priority B', 'Priority C'],
        score: { value: 10, band: ScoreBands.STRONG }
      }
    ])
  })

  it('returns correct scores for valid matrixScoring question', () => {
    const answers = {
      matrixAnswer: ['matrixScoreA'],
      matrixDependency: 'matrixDependencyA'
    }
    const mockConfig = mockScoringConfig('matrixAnswer', 'matrixDependency')
    const result = score(mockConfig)(answers)
    expect(result).toHaveLength(2)
    expect(result).toEqual([
      {
        questionId: 'matrixAnswer',
        category: 'Category 2',
        changeLink: '/change-matrix-answer',
        fundingPriorities: ['Priority B', 'Priority C'],
        score: { value: 1, band: ScoreBands.WEAK }
      },
      {
        questionId: 'matrixDependency',
        changeLink: '/change-matrix-dependency',
        score: { value: 0, band: ScoreBands.WEAK }
      }
    ])
  })

  it.each([
    {
      answer: 'matrixScoreA',
      dependentAnswer: 'matrixDependencyA',
      expectedScore: 1,
      expectedBand: ScoreBands.WEAK
    },
    {
      answer: 'matrixScoreA',
      dependentAnswer: 'matrixDependencyB',
      expectedScore: 2,
      expectedBand: ScoreBands.WEAK
    },
    {
      answer: 'matrixScoreA',
      dependentAnswer: 'matrixDependencyC',
      expectedScore: 3,
      expectedBand: ScoreBands.AVERAGE
    },
    {
      answer: 'matrixScoreA',
      dependentAnswer: 'matrixDependencyD',
      expectedScore: 4,
      expectedBand: ScoreBands.AVERAGE
    },
    {
      answer: 'matrixScoreB',
      dependentAnswer: 'matrixDependencyA',
      expectedScore: 2,
      expectedBand: ScoreBands.WEAK
    },
    {
      answer: 'matrixScoreB',
      dependentAnswer: 'matrixDependencyB',
      expectedScore: 4,
      expectedBand: ScoreBands.AVERAGE
    },
    {
      answer: 'matrixScoreB',
      dependentAnswer: 'matrixDependencyC',
      expectedScore: 6,
      expectedBand: ScoreBands.STRONG
    },
    {
      answer: 'matrixScoreB',
      dependentAnswer: 'matrixDependencyD',
      expectedScore: 8,
      expectedBand: ScoreBands.STRONG
    }
  ])(
    `should return correct matrix score for both questions using answers $answer and $dependentAnswer`,
    ({ answer, dependentAnswer, expectedScore, expectedBand }) => {
      const answers = {
        matrixAnswer: [answer],
        matrixDependency: dependentAnswer
      }
      const mockConfig = mockScoringConfig('matrixAnswer', 'matrixDependency')
      const result = score(mockConfig)(answers)
      expect(result).toHaveLength(2)

      const matrixAnswerIndex = result.findIndex(
        (answer) => answer.questionId === 'matrixAnswer'
      )

      expect(result[matrixAnswerIndex]).toEqual({
        questionId: 'matrixAnswer',
        category: 'Category 2',
        fundingPriorities: ['Priority B', 'Priority C'],
        score: { value: expectedScore, band: expectedBand }
      })

      expect(result[matrixAnswerIndex ^ 1]).toEqual({
        questionId: 'matrixDependency',
        score: { value: 0, band: expectedBand }
      })
    }
  )

  it('throws error when matrix scoring question is missing dependency', () => {
    const answers = { matrixAnswer: ['A'] }
    const mockConfig = mockScoringConfig('matrixAnswer')
    expect(() => score(mockConfig)(answers)).toThrow()
  })

  it('handles None of the above correctly for singleAnswer', () => {
    const answers = { singleAnswer: ['None of the above'] }
    const mockConfig = mockScoringConfig('singleAnswer')
    const result = score(mockConfig)(answers)
    expect(result).toEqual([
      {
        questionId: 'singleAnswer',
        changeLink: '/change-single-answer',
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
        changeLink: '/change-multi-answer',
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
        changeLink: '/change-single-answer',
        fundingPriorities: ['Priority A'],
        score: { value: 8, band: ScoreBands.STRONG }
      },
      {
        questionId: 'multiAnswer',
        category: 'Category 2',
        changeLink: '/change-multi-answer',
        fundingPriorities: ['Priority B', 'Priority C'],
        score: { value: 6, band: ScoreBands.AVERAGE }
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
        changeLink: '/change-single-answer',
        fundingPriorities: ['Priority A'],
        score: { value: 4, band: ScoreBands.AVERAGE }
      }
    ])
  })
})
