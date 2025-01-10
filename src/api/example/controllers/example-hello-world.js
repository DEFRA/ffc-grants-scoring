import { statusCodes } from '~/src/api/common/constants/status-codes.js'

/**
 * Example controller
 * Responds
 * @satisfies {Partial<ServerRoute>}
 */
const exampleHelloController = {
  handler: (request, h) => {
    return h.response({ message: 'Hello World' }).code(statusCodes.ok)
  }
}

export { exampleHelloController as exampleHelloWorldController }

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
