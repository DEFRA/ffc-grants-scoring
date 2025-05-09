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
          { name: ScoreBands.MEDIUM, minValue: 1, maxValue: 2 },
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
          { name: ScoreBands.WEAK, minValue: 0, maxValue: 5 },
          { name: ScoreBands.MEDIUM, minValue: 6, maxValue: 9 },
          { name: ScoreBands.STRONG, minValue: 10, maxValue: 12 }
        ],
        maxScore: 12
      }
    ],
    maxScore: 15,
    scoreBand: [
      { name: ScoreBands.WEAK, minValue: 0, maxValue: 5 },
      { name: ScoreBands.MEDIUM, minValue: 6, maxValue: 10 },
      { name: ScoreBands.STRONG, minValue: 11, maxValue: 15 }
    ],
    eligibilityPercentageThreshold: 80
  }

  it('should return a properly formatted result with score, status, and band', () => {
    const rawScores = [
      { questionId: 'q1', score: { value: 2, band: ScoreBands.MEDIUM } },
      { questionId: 'q2', score: { value: 2, band: ScoreBands.WEAK } }
    ]
    const expectedResult = {
      answers: rawScores,
      score: 4,
      status: 'Ineligible',
      scoreBand: ScoreBands.WEAK
    }

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result).toEqual(expectedResult)
  })

  it('should calculate the percentage correctly and return "Eligible" if the score is above the threshold', () => {
    const rawScores = [
      { questionId: 'q1', score: { value: 3, band: ScoreBands.STRONG } },
      { questionId: 'q2', score: { value: 11, band: ScoreBands.STRONG } }
    ]

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result.status).toBe('Eligible')
    expect(result.score).toBe(14)
    expect(result.scoreBand).toBe(ScoreBands.STRONG)
  })

  it('should handle empty rawScores array', () => {
    const rawScores = []

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result.score).toBe(0)
    expect(result.status).toBe('Ineligible')
    expect(result.scoreBand).toBe(ScoreBands.WEAK)
  })

  it('should handle cases where max score is zero', () => {
    // Simulating a scenario where scoringData has no answers with valid scores
    const scoringConfig = {
      questions: [
        { id: 'q1', answers: [{ answer: 'No Score', score: 0 }] },
        { id: 'q2', answers: [{ answer: 'No Score', score: 0 }] }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 0 },
        { name: ScoreBands.MEDIUM, minValue: 0, maxValue: 0 },
        { name: ScoreBands.STRONG, minValue: 0, maxValue: 0 }
      ],
      maxScore: 0,
      eligibilityPercentageThreshold: 80
    }

    const rawScores = [
      { questionId: 'q1', score: { value: 0, band: ScoreBands.WEAK } },
      { questionId: 'q2', score: { value: 0, band: ScoreBands.WEAK } }
    ]

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result.score).toBe(0)
    expect(result.status).toBe('Ineligible')
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
      { questionId: 'q1', score: { value: 50, band: ScoreBands.STRONG } },
      { questionId: 'q2', score: { value: 50, band: ScoreBands.STRONG } }
    ]

    // Config with score bands that don't match the total score
    const configWithGap = {
      ...scoringConfig,
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 5 },
        { name: ScoreBands.MEDIUM, minValue: 6, maxValue: 10 },
        // Gap between 10 and 200
        { name: ScoreBands.STRONG, minValue: 200, maxValue: 300 }
      ]
    }

    expect(() => mapToFinalResult(configWithGap, rawScores)).toThrow(
      'No matching score band found for total score 100. Check configuration for scoreBand gaps.'
    )
    expect(log).toHaveBeenCalled()
  })
})
