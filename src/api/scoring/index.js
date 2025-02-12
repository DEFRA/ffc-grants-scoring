import { scoringPayloadSchema } from './validation.js'
import { scoringController } from '~/src/api/scoring/controller.js'
import { normalizePayload } from './dxt-normaliser.js'
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
          pre: [{ method: normalizePayload }],
          validate: {
            payload: scoringPayloadSchema,
            failAction: scoringFailAction
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
