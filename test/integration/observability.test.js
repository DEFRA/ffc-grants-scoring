import { createServer } from '~/src/api/index.js'

describe('Observability', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  it('should return success application health', async () => {
    const { result, statusCode, headers } = await server.inject({
      method: 'GET',
      url: '/health'
    })

    expect(statusCode).toBe(200)
    expect(headers['content-type']).toBe('application/json; charset=utf-8')
    expect(headers['cache-control']).toBe('no-cache')
    expect(result).toEqual({ message: 'success' })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
