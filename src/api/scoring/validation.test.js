import { scoringPayloadSchema } from './validation.js'

describe('Scoring Payload Validation', () => {
  describe('DXT', () => {
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

  describe('Standard', () => {
    describe('valid', () => {
      it('should validate correct array format', () => {
        const validPayload = [{ questionId: 'q1', answers: ['answer1'] }]

        const { error } = scoringPayloadSchema.validate(validPayload)

        expect(error).toBeUndefined()
      })
    })

    describe('errors', () => {
      describe('questionId', () => {
        it('should return error for missing "questionId" in array format', () => {
          const invalidPayload = [{ answers: ['answer1'] }]

          const { error } = scoringPayloadSchema.validate(invalidPayload)

          expect(error).toBeDefined()
          expect(error.details[0].message).toBe('"questionId" is required')
        })

        it('should return error for "questionId" not being a string', () => {
          const invalidPayload = [
            { questionId: 123, answers: ['answer1'] } // Invalid type for "questionId"
          ]

          const { error } = scoringPayloadSchema.validate(invalidPayload)

          expect(error).toBeDefined()
          expect(error.details[0].message).toBe('"questionId" must be a string')
        })

        it('should return error for "questionId" being an empty string', () => {
          const invalidPayload = [
            { questionId: '', answers: ['answer1'] } // "questionId" is an empty string
          ]

          const { error } = scoringPayloadSchema.validate(invalidPayload)

          expect(error).toBeDefined()
          expect(error.details[0].message).toBe('"questionId" cannot be empty')
        })
      })

      describe('answers', () => {
        it('should return error for missing "answers" in array format', () => {
          const invalidPayload = [{ questionId: 'q1' }]

          const { error } = scoringPayloadSchema.validate(invalidPayload)

          expect(error).toBeDefined()
          expect(error.details[0].message).toBe('"answers" is required')
        })

        it('should return error for empty "answers" array in array format', () => {
          const invalidPayload = [{ questionId: 'q1', answers: [] }]

          const { error } = scoringPayloadSchema.validate(invalidPayload)

          expect(error).toBeDefined()
          expect(error.details[0].message).toBe(
            '"answers" cannot be an empty array"'
          )
        })

        it('should return error for invalid type in "answers" array', () => {
          const invalidPayload = [{ questionId: 'q1', answers: [{}, []] }]

          const { error } = scoringPayloadSchema.validate(invalidPayload)

          expect(error).toBeDefined()
          expect(error.details[0].message).toBe(
            '"answers" must be a string or number'
          )
        })

        it('should return error for "answers" not being an array', () => {
          const invalidPayload = [
            { questionId: 'q1', answers: 'not-an-array' } // Invalid type for "answers"
          ]

          const { error } = scoringPayloadSchema.validate(invalidPayload)

          expect(error).toBeDefined()
          expect(error.details[0].message).toBe('"answers" must be an array')
        })
      })

      describe('root level', () => {
        it('should return error for empty array format', () => {
          const invalidPayload = []

          const { error } = scoringPayloadSchema.validate(invalidPayload)

          expect(error).toBeDefined()
          expect(error.details[0].message).toBe('Array cannot be empty')
        })
      })
    })
  })

  describe('Error - Both', () => {
    it('should return error for invalid root-level structure', () => {
      const invalidPayload = 'invalid-payload'

      const { error } = scoringPayloadSchema.validate(invalidPayload)

      expect(error).toBeDefined()
      expect(error.details[0].message).toBe(
        'Request body must be either an object with "data.main" or an array of answers'
      )
    })
  })
})
