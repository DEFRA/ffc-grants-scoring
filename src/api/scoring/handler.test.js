import { jest, describe, it, expect, afterEach } from '@jest/globals'
import { handler } from './handler.js'
import { getScoringConfig } from '../../config/scoring-config.js'
import mapToFinalResult from '../../../src/services/scoring/scoring-mapper.js'
import score from '../../../src/services/scoring/score.js'

jest.mock('../../config/scoring-config.js')
jest.mock('../../../src/services/scoring/scoring-mapper.js', () => ({
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
    payload: { answers },
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

  it('should return 400 response with the error message when scoring fails', async () => {
    const errorMessage =
      'Question with id invalidQuestion not found in scoringData.'
    score.mockImplementation(() => {
      throw new Error(errorMessage)
    })
    getScoringConfig.mockReturnValue(mockScoringConfig)

    await handler(mockRequest('example-grant'), mockH)

    expect(mockH.response).toHaveBeenCalledWith(errorMessage)
    expect(mockH.code).toHaveBeenCalledWith(400)
  })

  it('should return a 400 response with the error message when mapping fails', async () => {
    const errorMessage = 'Mapping error occurred.'
    mapToFinalResult.mockImplementation(() => {
      throw new Error(errorMessage)
    })
    score.mockReturnValue(jest.fn().mockReturnValue(mockRawScores))
    getScoringConfig.mockReturnValue(mockScoringConfig)

    await handler(mockRequest('example-grant'), mockH)

    expect(mockH.response).toHaveBeenCalledWith(errorMessage)
    expect(mockH.code).toHaveBeenCalledWith(400)
  })
})
