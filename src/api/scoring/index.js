import { scoringPayloadSchema } from './validation.js'
import { scoringController } from '~/src/api/scoring/controller.js'
import { normalizePayload } from './dxt-normaliser.js'
import { log, LogCodes } from '../logging/log.js'
import { statusCodes } from '../common/constants/status-codes.js'

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
            failAction: (request, h, err) => {
              if (err.isJoi) {
                const messages = err.details.map((detail) => {
                  // Check if context.details exists
                  if (
                    detail.context.details &&
                    Array.isArray(detail.context.details)
                  ) {
                    // Process context.details if it exists
                    return `${detail.context.details.map((d) => `[${d.path.join('.')}]: ${d.message}`).join(', ')}`
                  }

                  // Process basic context if no details array exists
                  return `[${detail.path.join('.')}]: ${detail.message}`
                })

                const message = `Validation failed: ${messages.join(' | ')}`

                log(LogCodes.SCORING.VALIDATION_ERROR, {
                  grantType: request.params.grantType,
                  message
                })
                return h
                  .response({
                    statusCode: statusCodes.badRequest,
                    error: 'Bad Request',
                    message
                  })
                  .code(statusCodes.badRequest)
                  .takeover()
              }
              throw err // Re-throw the error to return it as a response
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
