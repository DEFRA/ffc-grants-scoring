import { exampleHelloWorldController } from '~/src/api/example/controllers/index.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
const example = {
  plugin: {
    name: 'example',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/hello-world',
          ...exampleHelloWorldController
        }
      ])
    }
  }
}

export { example }

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
