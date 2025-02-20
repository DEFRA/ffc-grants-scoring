import { healthController } from '~/src/api/health/controller.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
const health = {
  plugin: {
    name: 'health',
    register: (server) => {
      server.route({
        method: 'GET',
        path: '/health',
        ...healthController,
        options: {
          tags: ['api'],
          description: 'Health check endpoint',
          notes:
            'Returns a success message to indicate that the service is running'
        }
      })
    }
  }
}

export { health }

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
