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
  const mockLogCode = {
    level: 'info',
    messageFunc: (messageOptions) => `Mock log. ${messageOptions.mock}`
  }
  const messageOptions = { mock: 'mock' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should call the info logger with the correct interpolated message', () => {
    log(mockLogCode, messageOptions)

    expect(mockInfoLogger).toHaveBeenCalledWith('Mock log. mock')
    expect(mockErrorLogger).not.toHaveBeenCalled()
    expect(mockDebugLogger).not.toHaveBeenCalled()
  })

  it('Should call the error logger with the correct interpolated message', () => {
    mockLogCode.level = 'error'
    log(mockLogCode, messageOptions)
    expect(mockErrorLogger).toHaveBeenCalledWith('Mock log. mock')
  })

  it('Should call the debug logger with the correct interpolated message', () => {
    mockLogCode.level = 'debug'
    log(mockLogCode, messageOptions)
    expect(mockDebugLogger).toHaveBeenCalledWith('Mock log. mock')
  })

  it('Should call the debug logger with multiple interpolated values', () => {
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
