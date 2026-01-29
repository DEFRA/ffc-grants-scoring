import { createServer } from '~/src/api/index.js'

describe('Adding Value - Matrix Scoring', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  it('should score a matrixScore question', async () => {
    const { result, statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            processedProduceType: 'produceProcessed-A5',
            valueAdditionMethod: 'howAddingValue-A1'
          }
        }
      }
    })

    expect(statusCode).toBe(200)
    expect(
      result.answers.find((a) => a.questionId === 'processedProduceType').score
        .value
    ).toBe(15)
    expect(
      result.answers.find((a) => a.questionId === 'processedProduceType').score
        .band
    ).toBe('Average')
  })

  it('should return a zero score for the scoreDependency question and the same score band as the dependee', async () => {
    const { result, statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            processedProduceType: 'produceProcessed-A5',
            valueAdditionMethod: 'howAddingValue-A1'
          }
        }
      }
    })

    expect(statusCode).toBe(200)
    expect(
      result.answers.find((a) => a.questionId === 'valueAdditionMethod').score
        .value
    ).toBe(0)
    expect(
      result.answers.find((a) => a.questionId === 'valueAdditionMethod').score
        .band
    ).toBe('Average')
  })

  it('should return 400 when matrixScore question is sent without dependency', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            processedProduceType: 'produceProcessed-A3'
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
