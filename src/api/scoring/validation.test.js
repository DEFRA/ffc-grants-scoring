import { scoringPayloadSchema, scoringQueryParamsSchema } from './validation.js'

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
