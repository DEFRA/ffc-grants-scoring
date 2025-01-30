import { log } from './log.js'

let mockInfoLogger
let mockErrorLogger
let mockDebugLogger
let mockCreateLogger

jest.mock('../common/helpers/logging/logger.js', () => {
  mockInfoLogger = jest.fn()
  mockErrorLogger = jest.fn()
  mockDebugLogger = jest.fn()
  mockCreateLogger = jest.fn(() => ({
    info: mockInfoLogger,
    error: mockErrorLogger,
    debug: mockDebugLogger
  }))

  return {
    createLogger: mockCreateLogger
  }
})

describe('Logger Functionality', () => {
  const mockLogCodeInfo = {
    level: 'info',
    event: 'mock-info-event'
  }
  const mockLogCodeError = {
    level: 'error',
    event: 'mock-error-event'
  }
  const mockLogCodeDebug = {
    level: 'debug',
    event: 'mock-debug-event'
  }

  const mockParams = {
    param1: 'mock-param1',
    param2: 'mock-param2'
  }

  beforeEach(() => {
    jest.clearAllMocks() // Reset mocks before each test
  })

  describe('Valid Logging Scenarios', () => {
    it('Should call the info logger with the correct parameters', () => {
      log(mockLogCodeInfo, mockParams)

      expect(mockInfoLogger).toHaveBeenCalledWith({
        event: mockLogCodeInfo.event,
        ...mockParams
      })
      expect(mockErrorLogger).not.toHaveBeenCalled()
      expect(mockDebugLogger).not.toHaveBeenCalled()
    })

    it('Should call the error logger with the correct parameters', () => {
      log(mockLogCodeError, mockParams)

      expect(mockErrorLogger).toHaveBeenCalledWith({
        event: mockLogCodeError.event,
        ...mockParams
      })
      expect(mockInfoLogger).not.toHaveBeenCalled()
      expect(mockDebugLogger).not.toHaveBeenCalled()
    })

    it('Should call the debug logger with the correct parameters', () => {
      log(mockLogCodeDebug, mockParams)

      expect(mockDebugLogger).toHaveBeenCalledWith({
        event: mockLogCodeDebug.event,
        ...mockParams
      })
      expect(mockInfoLogger).not.toHaveBeenCalled()
      expect(mockErrorLogger).not.toHaveBeenCalled()
    })

    it('Should handle logging with an empty context object', () => {
      log(mockLogCodeInfo, {})
      expect(mockInfoLogger).toHaveBeenCalledWith({
        event: mockLogCodeInfo.event
      })
    })

    it('Should correctly handle deeply nested parameters', () => {
      const nestedParams = {
        param1: {
          subParam1: 'sub-value1',
          subParam2: 'sub-value2'
        },
        param2: 'value2'
      }

      log(mockLogCodeInfo, nestedParams)

      expect(mockInfoLogger).toHaveBeenCalledWith({
        event: mockLogCodeInfo.event,
        ...nestedParams
      })
    })

    it('Should log multiple parameters correctly for debug level', () => {
      const additionalParam = 'additional-param'
      log(mockLogCodeDebug, { ...mockParams, additionalParam })

      expect(mockDebugLogger).toHaveBeenCalledWith({
        event: mockLogCodeDebug.event,
        ...mockParams,
        additionalParam
      })
    })

    it('Should handle logging with functions in the context object', () => {
      const functionParam = () => 0
      log(mockLogCodeInfo, { param1: functionParam })

      expect(mockInfoLogger).toHaveBeenCalledWith({
        event: mockLogCodeInfo.event,
        param1: functionParam
      })
    })

    it('Should call the logger for a minimal valid logCode object', () => {
      const minimalLogCode = { level: 'info', event: 'minimal-event' }
      log(minimalLogCode)

      expect(mockInfoLogger).toHaveBeenCalledWith({
        event: minimalLogCode.event
      })
      expect(mockErrorLogger).not.toHaveBeenCalled()
      expect(mockDebugLogger).not.toHaveBeenCalled()
    })
  })

  describe('Validation Errors', () => {
    it('Should throw if logCode is null', () => {
      expect(() => log()).toThrow(
        'Invalid log configuration: Missing or invalid logCode'
      )
    })

    it('Should throw if logCode event is null', () => {
      expect(() =>
        log(
          {
            level: 'info',
            event: null
          },
          mockParams
        )
      ).toThrow('Invalid log configuration: Missing or invalid event')
    })

    it('Should throw if logCode level is invalid', () => {
      expect(() =>
        log(
          {
            level: 'not-a-level',
            event: 'mock-event'
          },
          mockParams
        )
      ).toThrow('Invalid log configuration: Invalid logCode level')
    })

    it('Should throw an error for unsupported log levels', () => {
      const mockInvalidLogCode = {
        level: 'invalid',
        event: 'mock-invalid-event'
      }

      expect(() => log(mockInvalidLogCode, mockParams)).toThrow()
      expect(mockInfoLogger).not.toHaveBeenCalled()
      expect(mockErrorLogger).not.toHaveBeenCalled()
      expect(mockDebugLogger).not.toHaveBeenCalled()
    })

    it('Should throw an error if logCode is not an object', () => {
      expect(() => log('string logCode', mockParams)).toThrow(
        'Invalid log configuration: Missing or invalid logCode'
      )

      expect(() => log(123, mockParams)).toThrow(
        'Invalid log configuration: Missing or invalid logCode'
      )

      expect(() => log([], mockParams)).toThrow(
        'Invalid log configuration: Missing or invalid logCode'
      )
    })

    it('Should throw an error if logCode is an empty object', () => {
      expect(() => log({}, mockParams)).toThrow(
        'Invalid log configuration: Missing or invalid logCode'
      )
    })

    it('Should throw an error if context is an array', () => {
      expect(() => log(mockLogCodeInfo, ['array-param'])).toThrow(
        'Invalid log configuration: Missing or invalid context'
      )
    })

    it('Should handle logging with incorrect context types', () => {
      expect(() => log(mockLogCodeInfo, 'string param')).toThrow(
        'Invalid log configuration: Missing or invalid context'
      )

      expect(() => log(mockLogCodeInfo, 123)).toThrow(
        'Invalid log configuration: Missing or invalid context'
      )
    })
  })

  describe('Edge Cases', () => {
    it('Should handle undefined parameters', () => {
      log(mockLogCodeInfo)

      expect(mockInfoLogger).toHaveBeenCalledWith({
        event: mockLogCodeInfo.event
      })
      expect(mockErrorLogger).not.toHaveBeenCalled()
      expect(mockDebugLogger).not.toHaveBeenCalled()
    })
  })
})
