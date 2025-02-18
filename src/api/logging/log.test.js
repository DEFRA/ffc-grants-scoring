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
  const messageOptions = { mock: 'mock' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Valid Logging Scenarios', () => {
    it('Should call a named logger with the correct interpolated message', () => {
      const mockLogCode = {
        level: 'info',
        messageFunc: (messageOptions) => `Mock info log. ${messageOptions.mock}`
      }

      log(mockLogCode, messageOptions)

      expect(mockInfoLogger).toHaveBeenCalledWith('Mock info log. mock')
      expect(mockErrorLogger).not.toHaveBeenCalled()
      expect(mockDebugLogger).not.toHaveBeenCalled()
    })

    it('Should call a named logger with multiple interpolated values', () => {
      const mockLogCode = {
        level: 'info',
        messageFunc: () =>
          `interpolated-string ${messageOptions.mock} with two values ${messageOptions.mockAnother}`
      }
      const messageOptions = { mock: 'mockOne', mockAnother: 'mockTwo' }

      log(mockLogCode, messageOptions)

      expect(mockInfoLogger).toHaveBeenCalledWith(
        'interpolated-string mockOne with two values mockTwo'
      )
    })

    it('Should call a named logger with nested interpolated values', () => {
      const mockLogCode = {
        level: 'info',
        messageFunc: () => {
          return `interpolated-string ${messageOptions.mock.subMockOne}, and ${messageOptions.mock.subMockTwo}, and ${messageOptions.mockAnother}`
        }
      }
      const messageOptions = {
        mock: { subMockOne: 'mockOne', subMockTwo: 'mockTwo' },
        mockAnother: 'mockThree'
      }

      log(mockLogCode, messageOptions)

      expect(mockInfoLogger).toHaveBeenCalledWith(
        'interpolated-string mockOne, and mockTwo, and mockThree'
      )
    })

    it('Should call a named logger with the correct non-interpolated message', () => {
      const mockLogCode = {
        level: 'info',
        messageFunc: () => 'Mock info log'
      }

      log(mockLogCode)

      expect(mockInfoLogger).toHaveBeenCalledWith('Mock info log')
    })
  })

  describe('Validation Errors', () => {
    it('Should throw if logCode level is invalid', () => {
      expect(() =>
        log(
          {
            level: 'not-valid',
            messageFunc: () => 'Mock log.'
          },
          messageOptions
        )
      ).toThrow('"level" must be one of [info, error, debug]')
    })

    it('Should throw an error if logCode is not an object', () => {
      expect(() => log(undefined, messageOptions)).toThrow(
        'logCode must be a non-empty object'
      )
    })

    it('Should throw an error if logCode is an empty object', () => {
      expect(() => log({}, messageOptions)).toThrow(
        'logCode must be a non-empty object'
      )
    })

    it('Should throw an error if messageFunc is not an function', () => {
      expect(() =>
        log(
          {
            level: 'info',
            messageFunc: 'not-a-function'
          },
          messageOptions
        )
      ).toThrow('"messageFunc" must be of type function')
    })
  })

  describe('Validation Interpolation Errors', () => {
    it('Should throw if messageOptions are passed with a non-interpolated string', () => {
      const logCode = {
        level: 'info',
        messageFunc: () => 'not-interpolated'
      }

      expect(() => log(logCode, messageOptions)).toThrow(
        'If you have message options you must have an interpolated string'
      )
    })

    it('Should throw if a string with interpolation values is passed with no message options', () => {
      const logCode = {
        level: 'info',
        messageFunc: () => `interpolated-string ${messageOptions.mock}`
      }

      expect(() => log(logCode)).toThrow(
        'If you have interpolated string values you must have message options'
      )
    })

    it('Should throw if interpolation values do not match messageOptions', () => {
      const logCode = {
        level: 'info',
        messageFunc: () =>
          `interpolated-string ${messageOptions.mock} with two values ${messageOptions.mockAnother}`
      }
      const messageOptions = { mock: 'mockOne', mockAnotherThird: 'mockTwo' }

      expect(() => log(logCode, messageOptions)).toThrow(
        'String interpolation values must match messageOptions'
      )
    })
  })
})
