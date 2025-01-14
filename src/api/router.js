import { health } from '~/src/api/health/index.js'
import { scoring } from '~/src/api/scoring/index.js'

/**
 * @satisfies { import('@hapi/hapi').ServerRegisterPluginObject<*> }
 */
const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Scoring service route
      await server.register([scoring])
    }
  }
}

export { router }
