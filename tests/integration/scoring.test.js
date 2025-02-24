import { createServer } from '~/src/api/index.js' // Ensure correct import path

describe('Scoring API - Validation Tests', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize() // Start server in test mode
  })

  afterAll(async () => {
    await server.stop()
  })

  it('should return 400 if the payload contains multiple values for single score method', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/example-grant/score',
      payload: {
        data: {
          main: {
            singleAnswer: ['A', 'B'],
            multiAnswer: ['A', 'B']
          }
        }
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.result).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message:
        'Multiple answers provided for single-answer question: singleAnswer'
    })
  })

  it('should return 400 if the payload does not contain question id(s) found in grant config', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/example-grant/score',
      payload: {
        data: {
          main: {
            singleAnswer: ['A'],
            unknownQuestion: ['A', 'B', 'C']
          }
        }
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.result).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: `Questions with id(s): multiAnswer not found in user's answers.`
    })
  })

  it('should return 400 if the payload contains invalid answer for single score method', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/example-grant/score',
      payload: {
        data: {
          main: {
            singleAnswer: ['NON_EXISTENT_ANSWER'],
            multiAnswer: ['A', 'B', 'D']
          }
        }
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.result).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: `Answer "NON_EXISTENT_ANSWER" not found in question: singleAnswer.`
    })
  })

  it('should return 400 if the payload contains invalid answer for multi score method', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/example-grant/score',
      payload: {
        data: {
          main: {
            singleAnswer: ['A'],
            multiAnswer: ['A', 'B', 'NON_EXISTENT_ANSWER']
          }
        }
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.result).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: `Answer "NON_EXISTENT_ANSWER" not found in question: multiAnswer.`
    })
  })

  it('should return 400 if the are other query params apart from allow partial scoring ones', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/scoring/api/v1/example-grant/score?otherParam=true&allowPartialScoring=true&otherParam2=otherParam2',
      payload: {
        data: {
          main: {
            singleAnswer: ['A'],
            multiAnswer: ['A', 'B']
          }
        }
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.result).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: `Validation failed: [otherParam]: "otherParam" is not allowed | [otherParam2]: "otherParam2" is not allowed`
    })
  })
})
