import { jest, describe, it, expect, afterEach } from '@jest/globals'
import { handler } from './handler.js'
import { getScoringConfig } from '../../config/scoring-config.js'
import mapToFinalResult from './mapper/map-to-final-result.js'
import score from '../../../src/services/scoring/score.js'

jest.mock('../../config/scoring-config.js')
jest.mock('./mapper/map-to-final-result.js', () => ({
  __esModule: true,
  default: jest.fn()
}))
jest.mock('../../../src/services/scoring/score.js', () => ({
  __esModule: true,
  default: jest.fn()
}))

describe('Handler Function', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockH = {
    response: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis()
  }

  const mockScoringConfig = {
    questions: [],
    scoreBand: [],
    maxScore: 10,
    eligibilityPercentageThreshold: 50
  }

  const mockAnswers = [
    { questionId: 'singleAnswer', answers: ['A'] },
    { questionId: 'multiAnswer', answers: ['B', 'C'] }
  ]

  const mockRequest = (grantType = 'example-grant', answers = mockAnswers) => ({
    payload: answers,
    params: { grantType }
  })

  const mockRawScores = [
    { questionId: 'singleAnswer', score: { value: 4, band: 'Medium' } },
    { questionId: 'multiAnswer', score: { value: 6, band: 'Medium' } }
  ]

  const mockFinalResult = { eligibility: 'eligible', score: 8 }

  it('should return 400 for invalid grant type', async () => {
    getScoringConfig.mockReturnValue(null)

    await handler(mockRequest('invalid-grant'), mockH)

    expect(mockH.response).toHaveBeenCalledWith({ error: 'Invalid grant type' })
    expect(mockH.code).toHaveBeenCalledWith(400)
  })

  it('should process valid grant type and return final result', async () => {
    getScoringConfig.mockReturnValue(mockScoringConfig)
    score.mockReturnValue(jest.fn().mockReturnValue(mockRawScores))
    mapToFinalResult.mockReturnValue(mockFinalResult)

    await handler(mockRequest('example-grant'), mockH)

    expect(getScoringConfig).toHaveBeenCalledWith('example-grant')
    expect(score).toHaveBeenCalledWith(mockScoringConfig)
    expect(score(mockScoringConfig)).toHaveBeenCalledWith(mockAnswers)
    expect(mapToFinalResult).toHaveBeenCalledWith(
      mockScoringConfig,
      mockRawScores
    )
    expect(mockH.response).toHaveBeenCalledWith(mockFinalResult)
    expect(mockH.code).toHaveBeenCalledWith(200)
  })

  it('should return 400 with an error response when the `score` function throws an error', async () => {
    const errorMessage = {
      error: 'Bad Request',
      message: 'The score function threw an error.',
      statusCode: 400
    }

    score.mockImplementation(() => {
      throw new Error(errorMessage.message)
    })
    getScoringConfig.mockReturnValue(mockScoringConfig)

    await handler(mockRequest('example-grant'), mockH)

    expect(mockH.response).toHaveBeenCalledWith(errorMessage)
    expect(mockH.code).toHaveBeenCalledWith(400)
  })

  it('should return a 400 with an error response when the `mapToFinalResult` function throws an error', async () => {
    const errorMessage = {
      error: 'Bad Request',
      message: 'mapToFinalResult threw an error.',
      statusCode: 400
    }

    mapToFinalResult.mockImplementation(() => {
      throw new Error(errorMessage.message)
    })
    score.mockReturnValue(jest.fn().mockReturnValue(mockRawScores))
    getScoringConfig.mockReturnValue(mockScoringConfig)

    await handler(mockRequest('example-grant'), mockH)

    expect(mockH.response).toHaveBeenCalledWith(errorMessage)
    expect(mockH.code).toHaveBeenCalledWith(400)
  })
})
