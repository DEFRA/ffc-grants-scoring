import mapToFinalResult from './map-to-final-result.js'
import singleScore from '../../../services/scoring/methods/single-score.js'
import multiScore from '../../../services/scoring/methods/multi-score.js'
import { ScoreBands } from '../../../config/score-bands.js'
import { log } from '~/src/api/logging/log.js'

// Mock the log function
jest.mock('~/src/api/logging/log.js', () => ({
  log: jest.fn(),
  LogCodes: {
    SCORING: {
      MATRIX_SCORE: {
        GENERAL_ERROR: { level: 'error', messageFunc: jest.fn() }
      }
    }
  }
}))

describe('mapToFinalResult', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const scoringConfig = {
    questions: [
      {
        id: 'q1',
        scoreMethod: singleScore,
        answers: [
          { answer: 'Protected cropping', score: 3 },
          { answer: 'Fruit', score: 2 },
          { answer: 'Field-scale crops', score: 1 }
        ],
        scoreBand: [
          { name: ScoreBands.WEAK, minValue: 0, maxValue: 1 },
          { name: ScoreBands.AVERAGE, minValue: 1, maxValue: 2 },
          { name: ScoreBands.STRONG, minValue: 3, maxValue: 3 }
        ],
        maxScore: 3
      },
      {
        id: 'q2',
        scoreMethod: multiScore,
        answers: [
          { answer: 'answer 1', score: 2 },
          { answer: 'answer 2', score: 4 },
          { answer: 'answer 3', score: 6 }
        ],
        scoreBand: [
          { name: ScoreBands.WEAK, minValue: 0, maxValue: 2 },
          { name: ScoreBands.AVERAGE, minValue: 3, maxValue: 6 },
          { name: ScoreBands.STRONG, minValue: 7, maxValue: 12 }
        ],
        isScoreOnly: true,
        maxScore: 12
      }
    ],
    maxScore: 15,
    scoreBand: [
      { name: ScoreBands.WEAK, startPercentage: 0, lessThanPercentage: 20 },
      { name: ScoreBands.AVERAGE, startPercentage: 20, lessThanPercentage: 50 },
      {
        name: ScoreBands.STRONG,
        startPercentage: 50,
        lessThanPercentage: Infinity
      }
    ]
  }

  it('should return a properly formatted result with score, status, and band', () => {
    const rawScores = [
      { questionId: 'q1', score: { value: 2, band: ScoreBands.AVERAGE } },
      { questionId: 'q2', score: { value: 2, band: ScoreBands.WEAK } }
    ]
    const expectedResult = {
      answers: [rawScores[0]],
      score: {
        value: 4,
        band: ScoreBands.AVERAGE
      }
    }

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result).toEqual(expectedResult)
  })

  it('should calculate the percentage correctly and return STRONG if score falls within STRONG band', () => {
    const rawScores = [
      { questionId: 'q1', score: { value: 3, band: ScoreBands.STRONG } },
      { questionId: 'q2', score: { value: 12, band: ScoreBands.STRONG } }
    ]

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result.score).toEqual({ value: 15, band: ScoreBands.STRONG })
  })

  it('should handle empty rawScores array', () => {
    const rawScores = []

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result.score).toEqual({ value: 0, band: ScoreBands.WEAK })
  })

  it('should handle cases where max score is zero', () => {
    // Simulating a scenario where scoringData has no answers with valid scores
    const scoringConfig = {
      questions: [
        { id: 'q1', answers: [{ answer: 'No Score', score: 0 }] },
        { id: 'q2', answers: [{ answer: 'No Score', score: 0 }] }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, startPercentage: 0, lessThanPercentage: 1 },
        {
          name: ScoreBands.AVERAGE,
          startPercentage: 1,
          lessThanPercentage: 50
        },
        {
          name: ScoreBands.STRONG,
          startPercentage: 50,
          lessThanPercentage: Infinity
        }
      ],
      maxScore: 0
    }

    const rawScores = [
      { questionId: 'q1', score: { value: 0, band: ScoreBands.WEAK } },
      { questionId: 'q2', score: { value: 0, band: ScoreBands.WEAK } }
    ]

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result.score).toEqual({ band: 'Weak', value: 0 })
  })

  it('should throw an error if rawScores is not an array', () => {
    expect(() => mapToFinalResult(scoringConfig, null)).toThrow(
      'rawScores must be an array'
    )
    expect(() => mapToFinalResult(scoringConfig, {})).toThrow(
      'rawScores must be an array'
    )
    expect(() => mapToFinalResult(scoringConfig, 'invalid')).toThrow(
      'rawScores must be an array'
    )
  })

  it('should throw an error when no matching score band is found', () => {
    // Create a score that doesn't match any score bands
    const rawScores = [
      { questionId: 'q1', score: { value: 3, band: ScoreBands.STRONG } },
      { questionId: 'q2', score: { value: 4, band: ScoreBands.STRONG } }
    ]

    // Config with score bands that don't match the total score
    const configWithGap = {
      ...scoringConfig,
      scoreBand: [
        { name: ScoreBands.WEAK, startPercentage: 0, lessThanPercentage: 5 },
        {
          name: ScoreBands.AVERAGE,
          startPercentage: 6,
          lessThanPercentage: 10
        },
        // Gap between 10 and 50%
        {
          name: ScoreBands.STRONG,
          startPercentage: 50,
          lessThanPercentage: 100
        }
      ]
    }

    expect(() => mapToFinalResult(configWithGap, rawScores)).toThrow(
      'No matching score band found for total score 7. Check configuration for scoreBand gaps.'
    )
    expect(log).toHaveBeenCalled()
  })

  describe('scoring config total bands range tests', () => {
    it('should match the WEAK band when score percentage is 19.99%', () => {
      const rawScores = [
        { questionId: 'q1', score: { value: 10, band: ScoreBands.WEAK } },
        { questionId: 'q2', score: { value: 9.99, band: ScoreBands.WEAK } }
      ]

      const adjustedConfig = {
        ...scoringConfig,
        questions: [
          { id: 'q1', answers: [], maxScore: 60 },
          { id: 'q2', answers: [], maxScore: 40 }
        ],
        maxScore: 100
      }

      const result = mapToFinalResult(adjustedConfig, rawScores)

      expect(result.score).toEqual({
        value: 19.99,
        band: ScoreBands.WEAK
      })
    })

    it('should match the AVERAGE band at 49.99% with simple values', () => {
      const rawScores = [
        { questionId: 'q1', score: { value: 30, band: ScoreBands.AVERAGE } },
        { questionId: 'q2', score: { value: 19.99, band: ScoreBands.AVERAGE } }
      ]

      const adjustedConfig = {
        ...scoringConfig,
        questions: [
          { id: 'q1', answers: [], maxScore: 60 },
          { id: 'q2', answers: [], maxScore: 40 }
        ],
        maxScore: 100
      }

      const result = mapToFinalResult(adjustedConfig, rawScores)

      expect(result.score).toEqual({
        value: 49.99,
        band: ScoreBands.AVERAGE
      })
    })

    it('should match the STRONG band at 99.99% with simple values', () => {
      const rawScores = [
        { questionId: 'q1', score: { value: 60, band: ScoreBands.AVERAGE } },
        { questionId: 'q2', score: { value: 39.99, band: ScoreBands.AVERAGE } }
      ]

      const adjustedConfig = {
        ...scoringConfig,
        questions: [
          { id: 'q1', answers: [], maxScore: 60 },
          { id: 'q2', answers: [], maxScore: 40 }
        ],
        maxScore: 100
      }

      const result = mapToFinalResult(adjustedConfig, rawScores)

      expect(result.score).toEqual({
        value: 99.99,
        band: ScoreBands.STRONG
      })
    })
  })
})
