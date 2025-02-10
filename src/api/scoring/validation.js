import Joi from 'joi'

export const scoringPayloadSchema = Joi.alternatives()
  .try(
    // DXT request with data.main
    Joi.object({
      meta: Joi.any(),
      data: Joi.object({
        files: Joi.object(),
        repeaters: Joi.object(),
        main: Joi.object()
          .pattern(
            Joi.string(),
            Joi.alternatives().try(
              Joi.string(),
              Joi.number(),
              Joi.array().items(Joi.string(), Joi.number()),
              Joi.valid(null)
            )
          )
          .required()
          .messages({
            'object.base': '"main" must be an object',
            'any.required': '"main" field is missing inside "data"'
          })
      })
        .required()
        .messages({
          'object.base': '"data" must be an object when using this format',
          'any.required':
            'Expected an object with "data", but received something else'
        })
    }),

    // Already normalized answers format (array)
    Joi.array()
      .items(
        Joi.object({
          questionId: Joi.string().required().messages({
            'string.base': '"questionId" must be a string',
            'string.empty': '"questionId" cannot be empty',
            'any.required': '"questionId" is required'
          }),
          answers: Joi.array()
            .items(
              Joi.alternatives().try(Joi.string(), Joi.number()).messages({
                'alternatives.types': '"answers" must be a string or number'
              })
            )
            .min(1)
            .required()
            .messages({
              'array.base': '"answers" must be an array',
              'array.min': '"answers" cannot be an empty array"',
              'any.required': '"answers" is required'
            })
        })
      )
      .required()
      .min(1)
      .messages({
        'array.min': 'Array cannot be empty'
      })
  )
  .messages({
    'alternatives.types':
      'Request body must be either an object with "data.main" or an array of answers'
  })
