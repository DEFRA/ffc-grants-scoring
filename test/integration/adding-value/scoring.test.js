import { createServer } from '~/src/api/index.js'

describe('Adding Value - Scoring', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  it('should score a valid full combination of questions and answers', async () => {
    const { result, statusCode } = await server.inject({
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

    expect(statusCode).toBe(200)
    expect(result.score.value).toBe(67.45)
    expect(result.score.band).toBe('Strong')
    expect(result.answers).toHaveLength(7)
    expect(
      result.answers.find((a) => a.questionId === 'processedProduceType').score
        .value
    ).toBe(24)
    expect(
      result.answers.find((a) => a.questionId === 'processedProduceType').score
        .band
    ).toBe('Strong')
    expect(
      result.answers.find((a) => a.questionId === 'valueAdditionMethod').score
        .value
    ).toBe(0)
    expect(
      result.answers.find((a) => a.questionId === 'valueAdditionMethod').score
        .band
    ).toBe('Strong')
    expect(
      result.answers.find((a) => a.questionId === 'impactType').score.value
    ).toBe(7.5)
    expect(
      result.answers.find((a) => a.questionId === 'impactType').score.band
    ).toBe('Average')
    expect(
      result.answers.find((a) => a.questionId === 'manualLabourEquivalence')
        .score.value
    ).toBe(1.65)
    expect(
      result.answers.find((a) => a.questionId === 'manualLabourEquivalence')
        .score.band
    ).toBe('Average')
    expect(
      result.answers.find((a) => a.questionId === 'futureCustomerTypes').score
        .value
    ).toBe(2)
    expect(
      result.answers.find((a) => a.questionId === 'futureCustomerTypes').score
        .band
    ).toBe('Weak')
    expect(
      result.answers.find((a) => a.questionId === 'collaboration').score.value
    ).toBe(0)
    expect(
      result.answers.find((a) => a.questionId === 'collaboration').score.band
    ).toBe('Weak')
    expect(
      result.answers.find((a) => a.questionId === 'environmentalImpactTypes')
        .score.value
    ).toBe(12.3)
    expect(
      result.answers.find((a) => a.questionId === 'environmentalImpactTypes')
        .score.band
    ).toBe('Strong')
  })

  it('should receive expected headers', async () => {
    const { statusCode, headers } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            isProvidingServicesToOtherFarmers: 'true'
          }
        }
      }
    })

    expect(statusCode).toBe(200)
    expect(headers['content-type']).toBe('application/json; charset=utf-8')
    expect(headers['cache-control']).toBe('no-cache')
  })

  it('should return 400 when input does not conform to expected JSON format', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        invalid: 'invalid'
      }
    })

    expect(statusCode).toBe(400)
  })

  it('should return 400 when all scoring questions are not supplied', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score',
      payload: {
        data: {
          main: {
            futureCustomerTypes: 'futureCustomers-A3'
          }
        }
      }
    })

    expect(statusCode).toBe(400)
  })

  it('should return 400 when answers do not match the scoring config', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            manualLabourEquivalence: 'invalid'
          }
        }
      }
    })

    expect(statusCode).toBe(400)
  })

  it('should return 400 when invalid grant type given in URL', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/invalid-grant/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            futureCustomerTypes: 'futureCustomers-A3'
          }
        }
      }
    })

    expect(statusCode).toBe(400)
  })

  it('should return 400 when invalid query string parameter is given', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?invalid=true',
      payload: {
        data: {
          main: {
            futureCustomerTypes: 'futureCustomers-A3'
          }
        }
      }
    })

    expect(statusCode).toBe(400)
  })

  it('should return 400 when lone question is sent and allowPartialScoring parameter is false', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=false',
      payload: {
        data: {
          main: {
            futureCustomerTypes: 'futureCustomers-A3'
          }
        }
      }
    })

    expect(statusCode).toBe(400)
  })

  it('should not return an isScoreOnly question in the response', async () => {
    const { result, statusCode } = await server.inject({
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

    expect(statusCode).toBe(200)
    expect(result.answers).toHaveLength(7)
    expect(
      result.answers.find(
        (a) => a.questionId === 'isProvidingServicesToOtherFarmers'
      )
    ).toBeUndefined()
    expect(
      result.answers.find((a) => a.questionId === 'isBuildingFruitStorage')
    ).toBeUndefined()
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
