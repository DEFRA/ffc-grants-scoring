import { handler as scoring } from '~/src/api/scoring/handler.js'

/**
 * The scoring service
 * @satisfies {Partial<ServerRoute>}
 */
const scoringController = {
  handler: scoring
}

export { scoringController }

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
