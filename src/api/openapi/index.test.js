import Hapi from '@hapi/hapi'
import { openApi } from './index.js' // Adjust the path as necessary
import HapiSwagger from 'hapi-swagger'

describe('openApi plugin', () => {
  let server

  beforeEach(async () => {
    server = Hapi.server()
    await server.register(openApi.plugin)
  })

  afterEach(async () => {
    await server.stop()
  })

  it('exports openApi plugin object', () => {
    expect(openApi).toHaveProperty('plugin')
    expect(openApi.plugin).toHaveProperty('name', 'openapi')
    expect(openApi.plugin).toHaveProperty('register')
  })

  it('registers the HapiSwagger plugin with correct options', () => {
    const hapiSwaggerPlugin = server.registrations[HapiSwagger.plugin.name]
    expect(hapiSwaggerPlugin).toBeDefined()

    const options = hapiSwaggerPlugin.options
    expect(options.info.title).toBe('Scoring API Documentation')
  })
})
