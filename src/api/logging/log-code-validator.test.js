import { validateLogCode } from './log-code-validator.js'

describe('validateLogCode', () => {
  it('should not throw an error for a valid log code', () => {
    const validLogCode = {
      level: 'info',
      messageFunc: () => 'Test message'
    }

    expect(() => validateLogCode(validLogCode)).not.toThrow()
  })

  it('should throw an error if logCode is not an object', () => {
    expect(() => validateLogCode(null)).toThrow(
      'logCode must be a non-empty object'
    )
    expect(() => validateLogCode(undefined)).toThrow(
      'logCode must be a non-empty object'
    )
    expect(() => validateLogCode('string')).toThrow(
      'logCode must be a non-empty object'
    )
    expect(() => validateLogCode({})).toThrow(
      'logCode must be a non-empty object'
    )
  })

  it('should throw an error if elements are missing', () => {
    expect(() =>
      validateLogCode({
        messageFunc: () => 'Test message'
      })
    ).toThrow('Invalid log level')

    expect(() =>
      validateLogCode({
        level: 'info'
      })
    ).toThrow('logCode.messageFunc must be a function')
  })

  it('should throw an error if logCode.level is not a valid value', () => {
    const invalidLogCode = {
      level: 'invalid',
      messageFunc: () => 'Test message'
    }

    expect(() => validateLogCode(invalidLogCode)).toThrow('Invalid log level')
  })

  it('should throw an error if logCode.messageFunc is not a function', () => {
    const invalidLogCode = {
      level: 'info',
      messageFunc: 'not-a-function'
    }

    expect(() => validateLogCode(invalidLogCode)).toThrow(
      'logCode.messageFunc must be a function'
    )
  })
})
