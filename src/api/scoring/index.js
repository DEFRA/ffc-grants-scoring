import Joi from 'joi'
import { scoringController } from '~/src/api/scoring/controller.js'

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
          validate: {
            payload: Joi.object({
              answers: Joi.array()
                .items(
                  Joi.object({
                    questionId: Joi.string().required(),
                    answers: Joi.array().items(Joi.string()).required()
                  })
                )
                .required()
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
