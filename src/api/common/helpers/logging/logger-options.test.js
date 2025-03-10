import { loggerOptions } from './logger-options.js'
import { getTraceId } from '@defra/hapi-tracing'

jest.mock('@defra/hapi-tracing')

describe('Logger mixin()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return an empty object if no traceId is returned', () => {
    getTraceId.mockReturnValueOnce(null)

    const mixin = loggerOptions.mixin()

    expect(mixin).toEqual({})
  })

  it('should include traceId in the mixin if getTraceId returns a trace ID', () => {
    getTraceId.mockReturnValueOnce('some-trace-id')

    const mixin = loggerOptions.mixin()

    expect(mixin).toEqual({ trace: { id: 'some-trace-id' } })
  })
})
