import { scoringPayloadSchema } from './validation.js'

describe('Scoring Payload Validation', () => {
  describe('valid', () => {
    it('should validate a correct payload with data.main', () => {
      const validPayload = {
        data: {
          main: {
            someKey: 'someValue'
          }
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
