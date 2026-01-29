import { createServer } from '~/src/api/index.js'

describe('Adding Value - Single Scoring', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  it('should score a singleScore question', async () => {
    const { result, statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            manualLabourEquivalence: 'manualLabourAmount-A2'
          }
        }
      }
    })

    expect(statusCode).toBe(200)
    expect(
      result.answers.find((a) => a.questionId === 'manualLabourEquivalence')
        .score.value
    ).toBe(3.35)
    expect(
      result.answers.find((a) => a.questionId === 'manualLabourEquivalence')
        .score.band
    ).toBe('Average')
  })

  it('should return 400 when multiple answers are given to a singleScore question', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score',
      payload: {
        data: {
          main: {
            isProvidingServicesToOtherFarmers: 'true',
            isBuildingFruitStorage: 'false',
            processedProduceType: 'produceProcessed-A1',
            valueAdditionMethod: 'howAddingValue-A1',
            impactType: ['projectImpact-A1', 'projectImpact-A2'],
            manualLabourEquivalence: [
              'manualLabourAmount-A1',
              'manualLabourAmount-A2'
            ],
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

    expect(statusCode).toBe(400)
  })

  it('should return 400 when no answer is given to a singleScore question', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring',
      payload: {
        data: {
          main: {
            manualLabourEquivalence: null
          }
        }
      }
    })

    expect(statusCode).toBe(400)
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
