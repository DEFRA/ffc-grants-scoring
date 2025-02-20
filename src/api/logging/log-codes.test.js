import { LogCodes } from './log-codes.js'

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
    const messageOptions = { grantType, messages: 'Field is required' }
    expect(LogCodes.SCORING.VALIDATION_ERROR.messageFunc(messageOptions)).toBe(
      `Validation Error for grantType=${grantType} with message(s): Field is required`
    )
  })
})
