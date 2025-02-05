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
            payload: Joi.alternatives().try(
              // For DXT request with data.main
              Joi.object({
                data: Joi.object({
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
                }).required()
              }),
              // For already normalized answers format
              Joi.object({
                answers: Joi.array()
                  .items(
                    Joi.object({
                      questionId: Joi.string().required(),
                      answers: Joi.array()
                        .items(
                          Joi.alternatives().try(
                            Joi.string(),
                            Joi.number(),
                            Joi.valid(null)
                          )
                        )
                        .min(1)
                        .required()
                    })
                  )
                  .required()
              })
            )
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
