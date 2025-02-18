import { jest, describe, it, expect, afterEach } from '@jest/globals'
import { handler } from './handler.js'
import { getScoringConfig } from '../../config/scoring-config.js'
import mapToFinalResult from './mapper/map-to-final-result.js'
import score from '../../../src/services/scoring/score.js'
import { log, LogCodes } from '../logging/log.js'

jest.mock('../../config/scoring-config.js')
jest.mock('./mapper/map-to-final-result.js', () => ({
  __esModule: true,
  default: jest.fn()
}))
jest.mock('../../../src/services/scoring/score.js', () => ({
  __esModule: true,
  default: jest.fn()
}))
jest.mock('../logging/log.js')

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
    payload: { data: { main: answers } },
    params: { grantType },
    query: { allowPartialScoring: false }
  })

  const mockRawScores = [
    { questionId: 'singleAnswer', score: { value: 4, band: 'Medium' } },
    { questionId: 'multiAnswer', score: { value: 6, band: 'Medium' } }
  ]

  const mockFinalResult = {
    score: 8,
    scoreBand: 'Medium',
    status: 'eligible'
  }

  it('should return 400 for invalid grant type', async () => {
    getScoringConfig.mockReturnValue(null)

    await handler(mockRequest('invalid-grant'), mockH)

    // expect(log).toHaveBeenCalledWith(
    //   LogCodes.SCORING.REQUEST_RECEIVED,
    //   expect.objectContaining({
    //     message: `Request received for grantType=invalid-grant`
    //   })
    // )

    // expect(log).toHaveBeenCalledWith(
    //   LogCodes.SCORING.CONFIG_MISSING,
    //   expect.objectContaining({
    //     message: `Scoring config missing for grantType=invalid-grant`
    //   })
    // )

    expect(mockH.response).toHaveBeenCalledWith({ error: 'Invalid grant type' })
    expect(mockH.code).toHaveBeenCalledWith(400)
  })

  it.each([
    { test: true, expected: true },
    { test: false, expected: false }
  ])(
    `with queryParam of $test it should pass { allowPartialScoring: $expected } to the score function`,
    async ({ test, expected }) => {
      getScoringConfig.mockReturnValue(mockScoringConfig)
      score.mockImplementation(() => (_answers) => mockRawScores)
      mapToFinalResult.mockReturnValue(mockFinalResult)

      const request = mockRequest('example-grant')
      request.query = { allowPartialScoring: test }
      await handler(request, mockH)

      expect(score).toHaveBeenCalledWith(mockScoringConfig, expected)
    }
  )

  it('should process valid grant type and return final result', async () => {
    getScoringConfig.mockReturnValue(mockScoringConfig)
    score.mockImplementation(() => (_answers, _partial) => mockRawScores)
    mapToFinalResult.mockReturnValue(mockFinalResult)

    await handler(mockRequest('example-grant'), mockH)

    expect(log).toHaveBeenCalledWith(LogCodes.SCORING.REQUEST_RECEIVED, {
      grantType: 'example-grant'
    })

    // expect(log).toHaveBeenCalledWith(
    //   LogCodes.SCORING.CONFIG_FOUND,
    //   expect.objectContaining({
    //     message: `Scoring config found for grantType=example-grant`
    //   })
    // )

    expect(getScoringConfig).toHaveBeenCalledWith('example-grant')
    expect(score).toHaveBeenCalledWith(mockScoringConfig, false)
    expect(score(mockScoringConfig)).toBeInstanceOf(Function)
    expect(score(mockScoringConfig)(mockAnswers)).toEqual(mockRawScores)

    expect(mapToFinalResult).toHaveBeenCalledWith(
      mockScoringConfig,
      mockRawScores
    )

    expect(log).toHaveBeenCalledWith(LogCodes.SCORING.FINAL_RESULT, {
      finalResult: { score: 8, scoreBand: 'Medium', status: 'eligible' },
      grantType: 'example-grant'
    })

    expect(mockH.response).toHaveBeenCalledWith(mockFinalResult)
    expect(mockH.code).toHaveBeenCalledWith(200)
  })

  it('should return 400 with an error response when the `score` function throws an error', async () => {
    const errorMessage = 'The score function threw an error.'

    score.mockImplementation(() => {
      throw new Error(errorMessage)
    })
    getScoringConfig.mockReturnValue(mockScoringConfig)

    await handler(mockRequest('example-grant'), mockH)

    expect(log).toHaveBeenCalledWith(LogCodes.SCORING.REQUEST_RECEIVED, {
      grantType: 'example-grant'
    })

    expect(log).toHaveBeenCalledWith(LogCodes.SCORING.CONFIG_FOUND, {
      grantType: 'example-grant'
    })

    expect(log).toHaveBeenCalledWith(LogCodes.SCORING.CONVERSION_ERROR, {
      grantType: 'example-grant',
      error: 'The score function threw an error.'
    })

    expect(mockH.response).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'Bad Request',
      message: errorMessage
    })
    expect(mockH.code).toHaveBeenCalledWith(400)
  })

  it('should return a 400 with an error response when the `mapToFinalResult` function throws an error', async () => {
    const errorMessage = 'mapToFinalResult threw an error.'

    mapToFinalResult.mockImplementation(() => {
      throw new Error(errorMessage)
    })
    score.mockReturnValue(() => mockRawScores)
    getScoringConfig.mockReturnValue(mockScoringConfig)

    await handler(mockRequest('example-grant'), mockH)

    expect(log).toHaveBeenCalledWith(LogCodes.SCORING.REQUEST_RECEIVED, {
      grantType: 'example-grant'
    })

    expect(log).toHaveBeenCalledWith(LogCodes.SCORING.CONFIG_FOUND, {
      grantType: 'example-grant'
    })

    expect(log).toHaveBeenCalledWith(LogCodes.SCORING.CONVERSION_ERROR, {
      grantType: 'example-grant',
      error: 'mapToFinalResult threw an error.'
    })

    expect(mockH.response).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'Bad Request',
      message: errorMessage
    })
    expect(mockH.code).toHaveBeenCalledWith(400)
  })
})
