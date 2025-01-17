import { jest, describe, it, expect } from '@jest/globals'
import { handler } from './handler.js'
import { scoringConfig } from '../../../src/config/scoring-config.js'
import mapToFinalResult from '../../../src/services/scoring/scoring-mapper.js'
import score from '../../../src/services/scoring/score.js'

jest.mock('../../../src/services/scoring/scoring-mapper.js', () => ({
  __esModule: true, // Ensures Jest treats it as an ES module
  default: jest.fn() // Mocking the named export `mapToFinalResult`
}))

jest.mock('../../../src/services/scoring/score.js', () => ({
  __esModule: true, // Ensures Jest treats it as an ES module
  default: jest.fn() // Mocking the default export `score`
}))

describe('Handler Function', () => {
  const code = jest.fn()
  const h = {
    response: jest.fn(() => ({
      code
    }))
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a 200 response with the final result when scoring is successful', async () => {
    const answers = [
      { questionId: 'singleAnswer', answers: ['A'] },
      { questionId: 'multiAnswer', answers: ['B', 'C'] }
    ]
    const request = { payload: { answers } }
    const rawScores = [
      { questionId: 'singleAnswer', score: { value: 4, band: 'Medium' } },
      { questionId: 'multiAnswer', score: { value: 6, band: 'Medium' } }
    ]
    const finalResult = { eligibility: 'Eligible', totalScore: 10 }

    const mockScoreWithConfig = jest.fn().mockReturnValue(rawScores)
    score.mockReturnValue(mockScoreWithConfig)
    mapToFinalResult.mockReturnValue(finalResult)

    await handler(request, h)

    expect(score).toHaveBeenCalledWith(scoringConfig)
    expect(mockScoreWithConfig).toHaveBeenCalledWith(answers)
    expect(mapToFinalResult).toHaveBeenCalledWith(scoringConfig, rawScores)
    expect(h.response).toHaveBeenCalledWith(finalResult)
    expect(code).toHaveBeenCalledWith(200)
  })

  it('should return a 400 response with the error message when scoring fails', async () => {
    const answers = [{ questionId: 'invalidQuestion', answers: ['A'] }]
    const request = { payload: { answers } }
    const errorMessage =
      'Question with id invalidQuestion not found in scoringData.'

    const mockScoreWithConfig = jest.fn().mockImplementation(() => {
      throw new Error(errorMessage)
    })
    score.mockReturnValue(mockScoreWithConfig)

    await handler(request, h)

    expect(score).toHaveBeenCalledWith(scoringConfig)
    expect(score(scoringConfig)).toHaveBeenCalledWith(answers)
    expect(mapToFinalResult).not.toHaveBeenCalled()
    expect(h.response).toHaveBeenCalledWith(errorMessage)
    expect(code).toHaveBeenCalledWith(400)
  })

  it('should return a 400 response with the error message when mapping fails', async () => {
    const answers = [
      { questionId: 'singleAnswer', answers: ['A'] },
      { questionId: 'multiAnswer', answers: ['B', 'C'] }
    ]
    const rawScores = [
      { questionId: 'singleAnswer', score: { value: 4, band: 'Medium' } },
      { questionId: 'multiAnswer', score: { value: 6, band: 'Medium' } }
    ]
    const request = { payload: { answers } }
    const errorMessage = 'Mapping error occurred.'
    const code = jest.fn()
    const h = {
      response: jest.fn(() => ({
        code
      }))
    }

    // Mock the implementations
    const mockScoreWithConfig = jest.fn().mockReturnValue(rawScores)
    score.mockReturnValue(mockScoreWithConfig)
    mapToFinalResult.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    // Call the handler
    await handler(request, h)

    // Assertions
    expect(score).toHaveBeenCalledWith(scoringConfig)
    expect(mockScoreWithConfig).toHaveBeenCalledWith(answers)
    expect(mapToFinalResult).toHaveBeenCalledWith(scoringConfig, rawScores)
    expect(h.response).toHaveBeenCalledWith(errorMessage)
    expect(code).toHaveBeenCalledWith(400)
  })
})
