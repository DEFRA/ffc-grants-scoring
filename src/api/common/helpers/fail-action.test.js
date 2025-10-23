import { failAction } from '~/src/api/common/helpers/fail-action.js'
import { mockLogger } from '~/src/api/common/helpers/logging/logger.js'

jest.mock('~/src/api/common/helpers/logging/logger.js', () => {
  const mockLogger = { warn: jest.fn() }
  return { __esModule: true, createLogger: () => mockLogger, mockLogger }
})

describe('#fail-action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockRequest = {}
  const mockToolkit = {}

  test('throws Error instance and logs it', () => {
    const mockError = new Error('Something terrible has happened!')

    expect(() => failAction(mockRequest, mockToolkit, mockError)).toThrow(
      'Something terrible has happened!'
    )

    expect(mockLogger.warn).toHaveBeenCalledWith(
      mockError,
      'Something terrible has happened!'
    )
  })

  test('wraps string into Error and throws', () => {
    const stringError = 'String based error'

    expect(() => failAction(mockRequest, mockToolkit, stringError)).toThrow(
      'String based error'
    )

    const [loggedErr, loggedMsg] = mockLogger.warn.mock.calls[0]
    expect(loggedErr).toBeInstanceOf(Error)
    expect(loggedErr.message).toBe('String based error')
    expect(loggedMsg).toBe('String based error')
  })

  test('uses "Unknown error" for empty string', () => {
    expect(() => failAction(mockRequest, mockToolkit, '')).toThrow(
      'Unknown error'
    )

    const [loggedErr, loggedMsg] = mockLogger.warn.mock.calls[0]
    expect(loggedErr).toBeInstanceOf(Error)
    expect(loggedErr.message).toBe('Unknown error')
    expect(loggedMsg).toBe('Unknown error')
  })

  test('uses "Unknown error" for non-error, non-string value', () => {
    expect(() => failAction(mockRequest, mockToolkit, { code: 500 })).toThrow(
      'Unknown error'
    )

    const [loggedErr, loggedMsg] = mockLogger.warn.mock.calls[0]
    expect(loggedErr).toBeInstanceOf(Error)
    expect(loggedErr.message).toBe('Unknown error')
    expect(loggedMsg).toBe('Unknown error')
  })
})
