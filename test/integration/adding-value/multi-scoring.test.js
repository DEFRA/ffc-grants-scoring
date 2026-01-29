import { createServer } from '~/src/api/index.js'

describe('Adding Value - Multi Scoring', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  it('should score a multiScore question', async () => {
    const { result, statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            impactType: [
              'projectImpact-A1',
              'projectImpact-A2',
              'projectImpact-A4'
            ]
          }
        }
      }
    })

    expect(statusCode).toBe(200)
    expect(
      result.answers.find((a) => a.questionId === 'impactType').score.value
    ).toBe(21)
    expect(
      result.answers.find((a) => a.questionId === 'impactType').score.band
    ).toBe('Strong')
  })

  it('should return 400 when no answers are given to a multiScore question', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            projectImpactCheckboxesField: null
          }
        }
      }
    })

    expect(statusCode).toBe(400)
  })

  it('should return 400 when duplicate answers given to a multiScore question', async () => {
    const { statusCode } = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/adding-value/score?allowPartialScoring=true',
      payload: {
        data: {
          main: {
            projectImpactCheckboxesField: [
              'projectImpact-A1',
              'projectImpact-A1'
            ]
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
