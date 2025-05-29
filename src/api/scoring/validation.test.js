import {
  scoringPayloadSchema,
  scoringResponseSchema,
  scoringQueryParamsSchema
} from './validation.js'

describe('Scoring query params validation', () => {
  it('should default to false if query is not provided', () => {
    const request = {}
    const result = scoringQueryParamsSchema.validate(request)
    expect(result.value.allowPartialScoring).toBe(false)
  })

  it('should allow partial scoring if query is true', () => {
    const query = { allowPartialScoring: true }
    const result = scoringQueryParamsSchema.validate(query)
    expect(result.value.allowPartialScoring).toBe(true)
  })
})

describe('Scoring Response Validation', () => {
  describe('valid', () => {
    it('should validate a correct response', () => {
      const validResponse = {
        answers: [
          {
            questionId: 'processedProduceType',
            changeLink: '/produce-processed',
            category: 'Produce processed',
            fundingPriorities: [
              'Create and expand processing capacity to provide more English-grown food for consumers to buy'
            ],
            score: {
              value: 24,
              band: 'Strong'
            }
          }
        ],
        score: 24,
        status: 'Eligible',
        scoreBand: 'Strong'
      }

      const { error } = scoringResponseSchema.validate(validResponse)
      expect(error).toBeUndefined()
    })
  })

  describe('errors', () => {
    it('should fail if "score.value" is a string', () => {
      const invalidResponse = {
        answers: [
          {
            questionId: 'q1',
            changeLink: '/link',
            category: 'Category',
            fundingPriorities: ['priority'],
            score: {
              value: 'high', // invalid
              band: 'Strong'
            }
          }
        ],
        score: 12,
        status: 'Eligible',
        scoreBand: 'Strong'
      }

      const { error } = scoringResponseSchema.validate(invalidResponse)
      expect(error).toBeDefined()
      expect(error.details[0].message).toMatch(
        '"answers[0].score.value" must be a number'
      )
    })

    it('should fail if "funding-priorities" is not an array', () => {
      const invalidResponse = {
        answers: [
          {
            questionId: 'q1',
            changeLink: '/change/q1',
            category: 'cat1',
            fundingPriorities: 'fp1', // ❌ Should be an array
            score: {
              value: 10,
              band: 'high'
            }
          }
        ],
        score: 50,
        status: 'complete',
        scoreBand: 'high'
      }

      const { error } = scoringResponseSchema.validate(invalidResponse)
      expect(error).toBeDefined()
      expect(error.details[0].message).toMatch(
        /"funding-priorities" must be an array/
      )
    })
  })
})

describe('Scoring Payload Validation', () => {
  describe('valid', () => {
    it('should validate a correct payload with data.main', () => {
      const validPayload = { data: { main: { someKey: 'someValue' } } }
      const { error } = scoringPayloadSchema.validate(validPayload)
      expect(error).toBeUndefined()
    })

    it('should validate when "main" contains a number', () => {
      const validPayload = { data: { main: { someKey: 123 } } }
      const { error } = scoringPayloadSchema.validate(validPayload)
      expect(error).toBeUndefined()
    })

    it('should validate when "main" contains an array of valid types', () => {
      const validPayload = { data: { main: { someKey: ['string', 456] } } }
      const { error } = scoringPayloadSchema.validate(validPayload)
      expect(error).toBeUndefined()
    })

    it('should allow meta to be any object', () => {
      const validPayload = {
        meta: { extra: 'info' },
        data: {
          main: { someKey: 'someValue' }
        }
      }
      const { error } = scoringPayloadSchema.validate(validPayload)
      expect(error).toBeUndefined()
    })
  })

  describe('errors', () => {
    describe('main', () => {
      it('should return error for missing "main" in object format', () => {
        const invalidPayload = {
          data: {}
        }

        const { error } = scoringPayloadSchema.validate(invalidPayload)

        expect(error).toBeDefined()
        expect(error.details[0].message).toBe(
          '"main" field is missing inside "data"'
        )
      })

      it('should return error for invalid "main" format', () => {
        const invalidPayload = {
          data: {
            main: 'invalid-string'
          }
        }

        const { error } = scoringPayloadSchema.validate(invalidPayload)

        expect(error).toBeDefined()
        expect(error.details[0].message).toBe('"main" must be an object')
      })

      it('should return error if "main" is null', () => {
        const invalidPayload = { data: { main: null } }

        const { error } = scoringPayloadSchema.validate(invalidPayload)

        expect(error).toBeDefined()
        expect(error.details[0].message).toBe('"main" must be an object')
      })

      it('should return error if a key inside "main" is null', () => {
        const invalidPayload = { data: { main: { someKey: null } } }

        const { error } = scoringPayloadSchema.validate(invalidPayload)

        expect(error).toBeDefined()
        expect(error.details[0].message).toMatch(
          /must be one of \[string, number, boolean, array]/
        )
      })

      it('should return an error if an empty array is passed as a value', () => {
        const invalidPayload = { data: { main: { someKey: [] } } }
        const { error } = scoringPayloadSchema.validate(invalidPayload)

        expect(error).toBeDefined()
        expect(error.details[0].message).toMatch(
          /"data.main.someKey" must contain at least 1 items/
        )
      })

      it('should return error if an array inside "main" contains null', () => {
        const invalidPayload = {
          data: { main: { someKey: ['valid', null, 123] } }
        }

        const { error } = scoringPayloadSchema.validate(invalidPayload)

        expect(error).toBeDefined()
        expect(error.details[0].message).toMatch(
          /"data.main.someKey\[1]" does not match any of the allowed types/
        )
      })

      it('should return an error if "main" contains an invalid type (e.g., object)', () => {
        const invalidPayload = {
          data: { main: { someKey: { nested: 'invalid' } } }
        }
        const { error } = scoringPayloadSchema.validate(invalidPayload)
        expect(error).toBeDefined()
        expect(error.details[0].message).toMatch(
          /must be one of \[string, number, boolean, array]/
        )
      })

      it('should return an error if an array inside "main" contains duplicate values', () => {
        const invalidPayload = {
          data: { main: { someKey: ['duplicate', 'duplicate', 123] } }
        }

        const { error } = scoringPayloadSchema.validate(invalidPayload)

        expect(error).toBeDefined()
        expect(error.details[0].message).toMatch(
          /"data.main.someKey\[1]" contains a duplicate value/
        )
      })
    })

    describe('root level', () => {
      it('should return error for invalid "data" type (not an object)', () => {
        const invalidPayload = {
          data: 'string-instead-of-object' // Invalid type for "data"
        }

        const { error } = scoringPayloadSchema.validate(invalidPayload)

        expect(error).toBeDefined()
        expect(error.details[0].message).toBe(
          '"data" must be an object when using this format'
        )
      })

      it('should return error for missing "data" field', () => {
        const invalidPayload = {} // Missing "data" field

        const { error } = scoringPayloadSchema.validate(invalidPayload)

        expect(error).toBeDefined()
        expect(error.details[0].message).toBe(
          'Expected an object with "data", but received something else'
        )
      })
    })
  })
})
