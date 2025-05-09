import { LogCodes, validateLogCodes } from './log-codes.js'

describe('LogCodes', () => {
  const grantType = 'testGrant'

  it('SCORING.REQUEST_RECEIVED generates correct message', () => {
    const messageOptions = { grantType }
    expect(LogCodes.SCORING.REQUEST_RECEIVED.messageFunc(messageOptions)).toBe(
      `Request received for grantType=${grantType}`
    )
  })

  it('SCORING.CONFIG_MISSING generates correct message', () => {
    const messageOptions = { grantType }
    expect(LogCodes.SCORING.CONFIG_MISSING.messageFunc(messageOptions)).toBe(
      `Scoring config missing for grantType=${grantType}`
    )
  })

  it('SCORING.CONFIG_FOUND generates correct message', () => {
    const messageOptions = { grantType }
    expect(LogCodes.SCORING.CONFIG_FOUND.messageFunc(messageOptions)).toBe(
      `Scoring config found for grantType=${grantType}`
    )
  })

  it('SCORING.FINAL_RESULT generates correct message', () => {
    const messageOptions = {
      grantType,
      finalResult: {
        score: 85,
        scoreBand: 'A',
        status: 'Eligible'
      }
    }
    expect(LogCodes.SCORING.FINAL_RESULT.messageFunc(messageOptions)).toBe(
      `Scoring final result for grantType=${grantType}. Score=85. Band=A. Eligibility=Eligible`
    )
  })

  it('SCORING.CONVERSION_ERROR generates correct message', () => {
    const messageOptions = { grantType, error: 'Invalid format' }
    expect(LogCodes.SCORING.CONVERSION_ERROR.messageFunc(messageOptions)).toBe(
      `Scoring conversion error for grantType=${grantType}. Error: Invalid format`
    )
  })

  it('SCORING.VALIDATION_ERROR generates correct message', () => {
    const messageOptions = { grantType, message: 'Field is required' }
    expect(LogCodes.SCORING.VALIDATION_ERROR.messageFunc(messageOptions)).toBe(
      `Validation Error for grantType=${grantType} with message(s): Field is required`
    )
  })

  it('SCORING.CONFIG_ERROR generates correct message', () => {
    const messageOptions = { grantType, error: 'Invalid config structure' }
    expect(LogCodes.SCORING.CONFIG_ERROR.messageFunc(messageOptions)).toBe(
      `Config error for grantType=${grantType}: Invalid config structure`
    )
  })

  it('SCORING.MATRIX_SCORE.MISSING_DEPENDENCY generates correct message', () => {
    const messageOptions = {
      dependency: 'testDependency',
      questionId: 'testQuestion'
    }
    expect(
      LogCodes.SCORING.MATRIX_SCORE.MISSING_DEPENDENCY.messageFunc(
        messageOptions
      )
    ).toBe(
      `Matrix scoring error: Dependency answer for testDependency is missing for question testQuestion`
    )
  })

  it('SCORING.MATRIX_SCORE.EMPTY_DEPENDENCY generates correct message', () => {
    const messageOptions = {
      dependency: 'testDependency',
      questionId: 'testQuestion'
    }
    expect(
      LogCodes.SCORING.MATRIX_SCORE.EMPTY_DEPENDENCY.messageFunc(messageOptions)
    ).toBe(
      `Matrix scoring error: Processed dependency answer for testDependency is empty for question testQuestion`
    )
  })

  it('SCORING.MATRIX_SCORE.INVALID_USER_ANSWERS generates correct message', () => {
    const messageOptions = { questionId: 'testQuestion' }
    expect(
      LogCodes.SCORING.MATRIX_SCORE.INVALID_USER_ANSWERS.messageFunc(
        messageOptions
      )
    ).toBe(
      `Matrix scoring error: User answers array is empty or invalid for question: testQuestion`
    )
  })

  it('SCORING.MATRIX_SCORE.ANSWER_NOT_FOUND generates correct message', () => {
    const messageOptions = { answer: 'testAnswer', questionId: 'testQuestion' }
    expect(
      LogCodes.SCORING.MATRIX_SCORE.ANSWER_NOT_FOUND.messageFunc(messageOptions)
    ).toBe(
      `Matrix scoring error: Answer "testAnswer" not found in question: testQuestion`
    )
  })

  it('SCORING.MATRIX_SCORE.NO_SCORE_FOR_DEPENDENCY generates correct message', () => {
    const messageOptions = {
      dependency: 'testDependency',
      questionId: 'testQuestion'
    }
    expect(
      LogCodes.SCORING.MATRIX_SCORE.NO_SCORE_FOR_DEPENDENCY.messageFunc(
        messageOptions
      )
    ).toBe(
      `Matrix scoring error: No score found for dependency answer "testDependency" in question: testQuestion`
    )
  })

  it('SCORING.MATRIX_SCORE.GENERAL_ERROR generates correct message', () => {
    const messageOptions = { error: 'Test error', questionId: 'testQuestion' }
    expect(
      LogCodes.SCORING.MATRIX_SCORE.GENERAL_ERROR.messageFunc(messageOptions)
    ).toBe(`Matrix scoring error: Test error in question: testQuestion`)
  })

  describe('validateLogCodes', () => {
    it('should validate all log codes without error for valid log codes', () => {
      expect(() => validateLogCodes(LogCodes)).not.toThrow()
    })

    it('should throw an error if a log code is missing "level"', () => {
      const invalidLogCodes = {
        SCORING: {
          INVALID_LOG: {
            messageFunc: () => 'This is an invalid log'
          }
        }
      }

      expect(() => validateLogCodes(invalidLogCodes)).toThrow(
        `Invalid log code definition for "INVALID_LOG": Missing "level" or "messageFunc"`
      )
    })

    it('should throw an error if a log code is missing "messageFunc"', () => {
      const invalidLogCodes = {
        SCORING: {
          INVALID_LOG: {
            level: 'error'
          }
        }
      }

      expect(() => validateLogCodes(invalidLogCodes)).toThrow(
        'Invalid log code definition for "INVALID_LOG": Missing "level" or "messageFunc"'
      )
    })

    it('should throw an error if logCode level is invalid', () => {
      const invalidLogCodeLevel = {
        SCORING: {
          INVALID_LOG: {
            level: 'invalidLogLevel',
            messageFunc: () => 'This is a message func'
          }
        }
      }
      expect(() => validateLogCodes(invalidLogCodeLevel)).toThrow(
        'Invalid log level'
      )
    })

    it('should throw an error if logCode is not an object', () => {
      const logCodeNotAnObject = {
        SCORING: {
          INVALID_LOG: null
        }
      }
      expect(() => validateLogCodes(logCodeNotAnObject)).toThrow(
        'logCode must be a non-empty object'
      )
    })

    it('should throw an error if messageFunc is not a function', () => {
      const logCodeNotAnObject = {
        SCORING: {
          INVALID_LOG: {
            level: 'info',
            messageFunc: 'not-a-function'
          }
        }
      }
      expect(() => validateLogCodes(logCodeNotAnObject)).toThrow(
        'logCode.messageFunc must be a function'
      )
    })

    it('should recursively validate nested log code structures', () => {
      const nestedLogCodes = {
        SCORING: {
          NESTED: {
            DEEPLY: {
              INVALID_LOG: {
                level: 'invalidLogLevel',
                messageFunc: () => 'This is a message func'
              }
            }
          }
        }
      }
      expect(() => validateLogCodes(nestedLogCodes)).toThrow(
        'Invalid log level'
      )
    })
  })
})
