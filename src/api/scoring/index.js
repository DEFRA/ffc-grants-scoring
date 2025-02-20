import { scoringPayloadSchema, scoringQueryParamsSchema } from './validation.js'
import { scoringController } from '~/src/api/scoring/controller.js'
import { scoringFailAction } from './fail-action.js'

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
            query: scoringQueryParamsSchema,
            payload: scoringPayloadSchema,
            failAction: scoringFailAction
          },
          tags: ['api'],
          description: 'Evaluate grant eligibility based on scoring criteria',
          notes:
            'Provide answers in the request body to receive a score and eligibility status'
        }
      })
    }
  }
}

export { scoring }

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
