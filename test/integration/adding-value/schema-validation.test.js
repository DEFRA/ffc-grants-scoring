import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { createServer } from '~/src/api/index.js'

describe('Adding Value - Schema Validation', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  it('response should validate against own schema', async () => {
    const scoringResponse = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            isProvidingServicesToOtherFarmers: 'false',
            isBuildingFruitStorage: 'true',
            valueAdditionMethod: 'howAddingValue-A1',
            impactType: ['projectImpact-A1', 'projectImpact-A2'],
            manualLabourEquivalence: 'manualLabourAmount-A1',
            futureCustomerTypes: ['futureCustomers-A1', 'futureCustomers-A2'],
            collaboration: 'false',
            environmentalImpactTypes: [
              'environmentalImpact-A1',
              'environmentalImpact-A2'
            ]
          }
        }
      }
    })

    expect(scoringResponse.statusCode).toBe(200)

    const openApiResponse = await server.inject({
      method: 'GET',
      url: '/scoring/api/v1/swagger.json'
    })

    expect(openApiResponse.statusCode).toBe(200)

    const openApiSpec = openApiResponse.result
    const ajv = new Ajv({ allErrors: true, strict: false })
    addFormats(ajv)

    for (const schemaName in openApiSpec.components.schemas) {
      const schemaObject = openApiSpec.components.schemas[schemaName]
      const schemaId = `#/components/schemas/${schemaName}`
      if (!ajv.getSchema(schemaId)) {
        ajv.addSchema(schemaObject, schemaId)
      }
    }

    const schemaToValidate = openApiSpec.components.schemas['scoring-response']
    const validate = ajv.compile(schemaToValidate)
    const isValid = validate(scoringResponse.result)

    expect(isValid).toBe(true)
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
