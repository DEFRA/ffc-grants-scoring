import Joi from 'joi'

export const scoringPayloadSchema = Joi.object({
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
          Joi.array().items(Joi.string(), Joi.number())
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
})
