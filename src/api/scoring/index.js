import Joi from 'joi'
import { scoringController } from '~/src/api/scoring/controller.js'
import { normalizePayload } from './dxt-normaliser.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
const scoring = {
  plugin: {
    name: 'scoring',
    register: (server) => {
      server.route({
        method: 'POST',
        path: '/scoring/api/v1/{grantType}/score',
        ...scoringController,
        options: {
          pre: [{ method: normalizePayload }],
          validate: {
            payload: Joi.alternatives()
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
                      'object.base':
                        '"data" must be an object when using this format',
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
                        'string.empty': '"questionId" cannot be empty'
                      }),
                      answers: Joi.array()
                        .items(
                          Joi.alternatives()
                            .try(Joi.string(), Joi.number())
                            .messages({
                              'alternatives.types':
                                '"answers" must be a string or number'
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
                    'array.base': 'Request body must be an array of objects',
                    'array.min': 'Array cannot be empty',
                    'any.required':
                      'Request body is required and must be an array'
                  })
              )
              .messages({
                'alternatives.types':
                  'Request body must be either an object with "data.main" or an array of answers'
              })
          }
        }
      })
    }
  }
}

export { scoring }

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
