import { createServer } from '~/src/api/index.js'
import { statusCodes } from '~/src/api/common/constants/status-codes.js'

describe('#exampleHelloWorldController', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should provide expected response', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/hello-world'
    })

    expect(result).toEqual({
      message: 'Hello World'
    })
    expect(statusCode).toBe(statusCodes.ok)
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */