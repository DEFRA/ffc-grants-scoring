/**
 * This test requires us to mock the dependencies before importing the module under test
 */

// Setup mocks (removing unused variables)
jest.mock('@elastic/ecs-pino-format', () => ({
  ecsFormat: jest.fn(() => ({ mocked: 'ecs-config' }))
}))

jest.mock('@defra/hapi-tracing', () => ({
  getTraceId: jest.fn()
}))

jest.mock('~/src/config/index.js', () => ({
  config: {
    get: jest.fn((key) => {
      if (key === 'log') {
        return {
          enabled: true,
          redact: ['password'],
          level: 'info',
          format: 'ecs'
        }
      }
      if (key === 'serviceName') return 'test-service'
      if (key === 'serviceVersion') return '1.0.0'
      return null
    })
  }
}))

describe('loggerOptions', () => {
  // We specifically avoid importing the module before the tests
  // because it imports and uses the config on module load
  let loggerOptions

  beforeEach(() => {
    jest.clearAllMocks()

    // Import the module inside the tests, after all mocks are set up
    // Use dynamic import instead of require
    return import('./logger-options.js').then((module) => {
      loggerOptions = module.loggerOptions
      return loggerOptions // Return a value to fulfill promise/always-return rule
    })
  })

  it('should have the expected properties', () => {
    expect(loggerOptions).toHaveProperty('enabled')
    expect(loggerOptions).toHaveProperty('ignorePaths')
    expect(loggerOptions).toHaveProperty('redact')
    expect(loggerOptions).toHaveProperty('level')
    expect(loggerOptions).toHaveProperty('mixin')
    expect(loggerOptions).toHaveProperty('nesting')

    // Check that mixin is a function
    expect(typeof loggerOptions.mixin).toBe('function')

    // Check that calling mixin returns an object
    const result = loggerOptions.mixin()
    expect(typeof result).toBe('object')
  })
})
