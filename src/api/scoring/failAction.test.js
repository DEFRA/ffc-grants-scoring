import { scoringFailAction } from './failAction.js'
import { statusCodes } from '../common/constants/status-codes.js'
import { log } from '../logging/log.js'

// Mock the logger to avoid actual logging during tests
jest.mock('../logging/log.js', () => ({
  log: jest.fn(),
  LogCodes: {
    SCORING: {
      VALIDATION_ERROR: 'SCORING_VALIDATION_ERROR'
    }
  }
}))

describe('scoringFailAction', () => {
  let h

  beforeEach(() => {
    // Mock Hapi's response toolkit
    h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
      takeover: jest.fn().mockReturnThis()
    }
  })

  test('should return bad request response when Joi validation fails', () => {
    const err = {
      isJoi: true,
      details: [
        {
          message: '"field1" is required',
          path: ['field1'],
          context: {}
        }
      ]
    }

    const request = { params: { grantType: 'testGrant' } }

    // Call the scoringFailAction with mock request and error
    const response = scoringFailAction(request, h, err)

    expect(h.response).toHaveBeenCalledWith({
      statusCode: statusCodes.badRequest,
      error: 'Bad Request',
      message: 'Validation failed: [field1] : "field1" is required'
    })
    expect(response).toBe(h)
    expect(h.code).toHaveBeenCalledWith(statusCodes.badRequest)
    expect(h.takeover).toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith(
      {
        event: 'scoring_validation_error',
        level: 'error'
      },
      {
        grantType: 'testGrant',
        message: 'Validation failed: [field1] : "field1" is required'
      }
    )
  })

  test('should return bad request response with multiple validation errors', () => {
    const err = {
      isJoi: true,
      details: [
        {
          message: '"field1" is required',
          path: ['field1'],
          context: {}
        },
        {
          message: '"field2" must be a number',
          path: ['field2'],
          context: {}
        }
      ]
    }

    const request = { params: { grantType: 'testGrant' } }

    // Call the scoringFailAction with mock request and error
    const response = scoringFailAction(request, h, err)

    expect(h.response).toHaveBeenCalledWith({
      statusCode: statusCodes.badRequest,
      error: 'Bad Request',
      message:
        'Validation failed: [field1] : "field1" is required | [field2] : "field2" must be a number'
    })
    expect(response).toBe(h)
    expect(h.code).toHaveBeenCalledWith(statusCodes.badRequest)
    expect(h.takeover).toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith(
      {
        event: 'scoring_validation_error',
        level: 'error'
      },
      {
        grantType: 'testGrant',
        message:
          'Validation failed: [field1] : "field1" is required | [field2] : "field2" must be a number'
      }
    )
  })

  test('should return bad request response when there is no context.details', () => {
    const err = {
      isJoi: true,
      details: [
        {
          message: '"field1" is required',
          path: ['field1'],
          context: {}
        }
      ]
    }

    const request = { params: { grantType: 'testGrant' } }

    // Call the scoringFailAction with mock request and error
    const response = scoringFailAction(request, h, err)

    expect(h.response).toHaveBeenCalledWith({
      statusCode: statusCodes.badRequest,
      error: 'Bad Request',
      message: 'Validation failed: [field1] : "field1" is required'
    })
    expect(response).toBe(h)
    expect(h.code).toHaveBeenCalledWith(statusCodes.badRequest)
    expect(h.takeover).toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith(
      {
        event: 'scoring_validation_error',
        level: 'error'
      },
      {
        grantType: 'testGrant',
        message: 'Validation failed: [field1] : "field1" is required'
      }
    )
  })

  test('should re-throw error if not Joi validation error', () => {
    const err = new Error('Some unexpected error')
    const request = { params: { grantType: 'testGrant' } }

    // Call the scoringFailAction with mock request and error
    expect(() => scoringFailAction(request, h, err)).toThrow(
      'Some unexpected error'
    )
  })
})
