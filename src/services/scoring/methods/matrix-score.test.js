import { ScoreBands } from '../../../config/score-bands.js'
import matrixScore from './matrix-score.js' // adjust path as needed
import { log } from '~/src/api/logging/log.js'

// Mock the log function to prevent actual logging during tests
jest.mock('~/src/api/logging/log.js', () => ({
  log: jest.fn(),
  LogCodes: {
    SCORING: {
      MATRIX_SCORE: {
        MISSING_DEPENDENCY: { level: 'error', messageFunc: jest.fn() },
        EMPTY_DEPENDENCY: { level: 'error', messageFunc: jest.fn() },
        INVALID_USER_ANSWERS: { level: 'error', messageFunc: jest.fn() },
        ANSWER_NOT_FOUND: { level: 'error', messageFunc: jest.fn() },
        NO_SCORE_FOR_DEPENDENCY: { level: 'error', messageFunc: jest.fn() },
        GENERAL_ERROR: { level: 'error', messageFunc: jest.fn() }
      }
    }
  }
}))

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
      { name: ScoreBands.AVERAGE, minValue: 3, maxValue: 5 },
      { name: ScoreBands.STRONG, minValue: 6, maxValue: 8 }
    ]
  },
  {
    id: 'dependentQuestion',
    isDependency: true,
    maxScore: 8,
    scoreBand: [
      { name: ScoreBands.WEAK, minValue: 0, maxValue: 2 },
      { name: ScoreBands.AVERAGE, minValue: 3, maxValue: 5 },
      { name: ScoreBands.STRONG, minValue: 6, maxValue: 8 }
    ]
  }
]

describe('matrixScore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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
        matrixDependency: dependentAnswer
      })
      expect(result.value).toBe(expectedScore)
    }
  )

  it('should throw error when dependency answer is missing', () => {
    expect(() => {
      matrixScore(questionConfig[0], ['matrixScoreA'], {})
    }).toThrow('Dependency answer for matrixDependency is missing')
    expect(log).toHaveBeenCalled()
  })

  it('should throw error when dependency answer is null', () => {
    expect(() => {
      matrixScore(questionConfig[0], ['matrixScoreA'], {
        matrixDependency: null
      })
    }).toThrow('Dependency answer for matrixDependency is missing')
    expect(log).toHaveBeenCalled()
  })

  it('should throw error when dependency answer is empty string', () => {
    expect(() => {
      matrixScore(questionConfig[0], ['matrixScoreA'], {
        matrixDependency: ''
      })
    }).toThrow('Processed dependency answer for matrixDependency is empty')
    expect(log).toHaveBeenCalled()
  })

  it('should throw error when user answers array is empty', () => {
    expect(() => {
      matrixScore(questionConfig[0], [], {
        matrixDependency: 'dependentQuestionA'
      })
    }).toThrow('User answers array is empty or invalid')
    expect(log).toHaveBeenCalled()
  })

  it('should throw error when user answers array is not an array', () => {
    expect(() => {
      matrixScore(questionConfig[0], 'not-an-array', {
        matrixDependency: 'dependentQuestionA'
      })
    }).toThrow('User answers array is empty or invalid')
    expect(log).toHaveBeenCalled()
  })

  it('should throw error when user answer is not found in question', () => {
    expect(() => {
      matrixScore(questionConfig[0], ['nonExistentAnswer'], {
        matrixDependency: 'dependentQuestionA'
      })
    }).toThrow('Answer "nonExistentAnswer" not found in question')
    expect(log).toHaveBeenCalled()
  })

  it('should throw error when score is not found for dependency answer', () => {
    expect(() => {
      matrixScore(questionConfig[0], ['matrixScoreA'], {
        matrixDependency: 'nonExistentDependencyAnswer'
      })
    }).toThrow(
      'No score found for dependency answer "nonExistentDependencyAnswer"'
    )
    expect(log).toHaveBeenCalled()
  })

  it('should throw error when no matching score band is found', () => {
    // Create a config with a score that doesn't match any band
    const modifiedConfig = {
      ...questionConfig[0],
      answers: [
        {
          answer: 'matrixScoreA',
          score: {
            dependentQuestionA: 10 // This score doesn't fit in any band
          }
        }
      ]
    }

    expect(() => {
      matrixScore(modifiedConfig, ['matrixScoreA'], {
        matrixDependency: 'dependentQuestionA'
      })
    }).toThrow(
      'No matching score band found for value 10 in question: matrixScore'
    )
    expect(log).toHaveBeenCalled()
  })

  it('should throw error when dependency answer is an array', () => {
    expect(() => {
      matrixScore(questionConfig[0], ['matrixScoreA'], {
        matrixDependency: ['dependentQuestionA', 'shouldBeIgnored']
      })
    }).toThrow('Multiple dependency answers not supported for matrixDependency')
    expect(log).toHaveBeenCalled()
  })

  it('should handle string dependency answers correctly', () => {
    const result = matrixScore(questionConfig[0], ['matrixScoreA'], {
      matrixDependency: 'dependentQuestionA'
    })
    expect(result.value).toBe(1)
    expect(result.band).toBe('Weak')
  })
})
