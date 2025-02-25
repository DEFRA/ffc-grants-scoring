import * as schema from './validation.js'
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
            params: schema.paramsSchema,
            query: schema.scoringQueryParamsSchema,
            payload: schema.scoringPayloadSchema,
            failAction: scoringFailAction
          },
          tags: ['api'],
          description: 'Evaluate grant eligibility based on scoring criteria',
          notes:
            'Provide answers in the request body to receive a score and eligibility status. To test Partial Scoring, use the `allowPartialScoring` query parameter, and remove one of the answers from the request body.',
          response: {
            status: {
              200: schema.scoringResponseSchema,
              400: schema.errorResponseSchema
            }
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
