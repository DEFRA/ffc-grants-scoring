import { statusCodes } from '../common/constants/status-codes.js'
import { LogCodes } from '../logging/log-codes.js'
import { log } from '../logging/log.js'

export const scoringFailAction = (request, h, err) => {
  if (err.isJoi) {
    const messages = err.details.map((detail) => {
      // Check if context.details exists
      if (detail.context.details && Array.isArray(detail.context.details)) {
        // Process context.details if it exists
        const formattedDetails = detail.context.details
          .map((d) => {
            return '[' + d.path.join('.') + ']: ' + d.message
          })
          .join(', ')
        return formattedDetails
      } else {
        // Process basic context if no details array exists
        return `[${detail.path.join('.')}]: ${detail.message}`
      }
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
