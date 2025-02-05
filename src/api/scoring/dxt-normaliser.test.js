import { normalizePayload } from './dxt-normaliser.js' // Adjust the import based on your file structure

describe('normalizePayload', () => {
  // Mock Hapi response toolkit for testing
  const h = {
    continue: 'continue'
  }

  it('should transform Key-Value format (data) into answers format', () => {
    const request = {
      payload: {
        data: {
          main: {
            component1Name: ['component1Value'],
            component2Name: ['component2Value']
          }
        }
      }
    }

    const result = normalizePayload(request, h)

    // Check if the transformation took place
    expect(request.payload.answers).toEqual([
      { questionId: 'component1Name', answers: ['component1Value'] },
      { questionId: 'component2Name', answers: ['component2Value'] }
    ])

    // Ensure original data property is deleted
    expect(request.payload.data).toBeUndefined()

    // Check that the function proceeds with the lifecycle
    expect(result).toBe(h.continue)
  })

  it('should handle string values inside data.main', () => {
    const request = {
      payload: {
        data: {
          main: {
            component1Name: 'component1Value'
          }
        }
      }
    }
    const response = normalizePayload(request, h)
    expect(request.payload.answers).toEqual([
      { questionId: 'component1Name', answers: 'component1Value' }
    ])
    expect(response).toBe(h.continue)
  })

  it('should handle number values inside data.main', () => {
    const request = {
      payload: {
        data: {
          main: {
            component1Name: 42
          }
        }
      }
    }
    const response = normalizePayload(request, h)
    expect(request.payload.answers).toEqual([
      { questionId: 'component1Name', answers: 42 }
    ])
    expect(response).toBe(h.continue)
  })

  it('should handle string array values inside data.main', () => {
    const request = {
      payload: {
        data: {
          main: {
            component1Name: ['value1', 'value2']
          }
        }
      }
    }
    const response = normalizePayload(request, h)
    expect(request.payload.answers).toEqual([
      { questionId: 'component1Name', answers: ['value1', 'value2'] }
    ])
    expect(response).toBe(h.continue)
  })

  it('should handle number array values inside data.main', () => {
    const request = {
      payload: {
        data: {
          main: {
            component1Name: [1, 2, 3]
          }
        }
      }
    }
    const response = normalizePayload(request, h)
    expect(request.payload.answers).toEqual([
      { questionId: 'component1Name', answers: [1, 2, 3] }
    ])
    expect(response).toBe(h.continue)
  })

  it('should handle null values inside data.main', () => {
    const request = {
      payload: {
        data: {
          main: {
            component1Name: null
          }
        }
      }
    }
    const response = normalizePayload(request, h)
    expect(request.payload.answers).toEqual([
      { questionId: 'component1Name', answers: null }
    ])
    expect(response).toBe(h.continue)
  })

  it('should leave answers format unchanged if it is already in answers format', () => {
    const request = {
      payload: {
        answers: [
          { questionId: 'component1Name', answers: ['component1Value'] }
        ]
      }
    }

    const result = normalizePayload(request, h)

    // Check that answers remain unchanged
    expect(request.payload.answers).toEqual([
      { questionId: 'component1Name', answers: ['component1Value'] }
    ])

    // Ensure no modification to the answers
    expect(request.payload.data).toBeUndefined()

    // Check that the function proceeds with the lifecycle
    expect(result).toBe(h.continue)
  })

  it('should not fail if no data or answers property is present', () => {
    const request = {
      payload: {}
    }

    const result = normalizePayload(request, h)

    // Ensure no changes to the payload
    expect(request.payload.answers).toBeUndefined()
    expect(request.payload.data).toBeUndefined()

    // Check that the function proceeds with the lifecycle
    expect(result).toBe(h.continue)
  })

  it('should prioritize data over existing answers', () => {
    const request = {
      payload: {
        data: {
          main: {
            component1Name: ['component1Value']
          }
        },
        answers: [
          { questionId: 'component2Name', answers: ['component2Value'] }
        ]
      }
    }

    const result = normalizePayload(request, h)

    // Check that data is transformed and answers are removed
    expect(request.payload.answers).toEqual([
      { questionId: 'component1Name', answers: ['component1Value'] }
    ])

    expect(request.payload.data).toBeUndefined()

    // Check that the function proceeds with the lifecycle
    expect(result).toBe(h.continue)
  })

  it('should ignore payloads without data.main', () => {
    const request = {
      payload: {
        data: {
          other: { component1Name: 'value1' }
        }
      }
    }
    const result = normalizePayload(request, h)
    expect(request.payload).toEqual({
      data: {
        other: { component1Name: 'value1' }
      }
    })

    // Check that the function proceeds with the lifecycle
    expect(result).toBe(h.continue)
  })
})
