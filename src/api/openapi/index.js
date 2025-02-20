// istanbul ignore file
import HapiSwagger from 'hapi-swagger'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const openApi = {
  plugin: {
    name: 'openapi',
    register: async (server) => {
      await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: {
            info: {
              title: 'Scoring API Documentation'
            }
          }
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
