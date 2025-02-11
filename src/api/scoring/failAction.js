import { statusCodes } from '../common/constants/status-codes.js'
import { LogCodes } from '../logging/log-codes.js'
import { log } from '../logging/log.js'

export const scoringFailAction = (request, h, err) => {
  if (err.isJoi) {
    const messages = err.details.map((detail) => {
      let formattedMessage
      // Check if context.details exists
      if (detail.context.details && Array.isArray(detail.context.details)) {
        formattedMessage = detail.context.details
          .map((d) => `[${d.path.join('.')}] : ${d.message}`)
          .join(', ')
        // Process context.details if it exists
        return `${detail.context.details.map((d) => `[${d.path.join('.')}]: ${d.message}`).join(', ')}`
      } else {
        // Process basic context if no details array exists
        formattedMessage = `[${detail.path.join('.')}] : ${detail.message}`
      }

      // Process basic context if no details array exists
      return formattedMessage
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
