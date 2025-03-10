import { getScoringConfig } from './scoring-config.js'

const exampleGrantConfigMock = { mockKey: 'exampleGrantConfigMock' }
const addingValueGrantConfigMock = { mockKey: 'addingValueGrantConfigMock' }

jest.mock('./grants/example-grant-config.js', () => ({
  exampleGrantConfig: exampleGrantConfigMock
}))

jest.mock('./grants/adding-value-grant-config.js', () => ({
  addingValueGrantConfig: addingValueGrantConfigMock
}))

describe('getScoringConfig', () => {
  test('should return the mocked config for "example-grant"', () => {
    expect(JSON.stringify(getScoringConfig('example-grant'))).toBe(
      JSON.stringify(exampleGrantConfigMock)
    )
  })

  test('should return the mocked config for "adding-value"', () => {
    expect(JSON.stringify(getScoringConfig('adding-value'))).toBe(
      JSON.stringify(addingValueGrantConfigMock)
    )
  })

  test('should return null for an unknown variables', () => {
    expect(getScoringConfig('unknown-grant')).toBeNull()
    expect(getScoringConfig('')).toBeNull()
    expect(getScoringConfig(undefined)).toBeNull()
    expect(getScoringConfig(null)).toBeNull()
  })
})
