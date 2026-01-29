import { createServer } from '~/src/api/index.js'

describe('Documentation', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  it('should retrieve Swagger documentation', async () => {
    const { statusCode } = await server.inject({
      method: 'GET',
      url: '/scoring/api/v1/documentation'
    })

    expect(statusCode).toBe(200)
  })

  it('should retrieve OpenAPI JSON schema', async () => {
    const { statusCode } = await server.inject({
      method: 'GET',
      url: '/scoring/api/v1/swagger.json'
    })

    expect(statusCode).toBe(200)
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
