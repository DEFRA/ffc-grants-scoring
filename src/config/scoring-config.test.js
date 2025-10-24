import { getScoringConfig } from '~/src/config/scoring-config.js'
import { addingValueGrantConfig } from '~/src/config/grants/adding-value-grant-config.js'
import { exampleGrantConfig } from '~/src/config/grants/example-grant-config.js'

describe('#scoring-config', () => {
  test('returns addingValueGrantConfig for grant type "adding-value"', () => {
    const cfg = getScoringConfig('adding-value')
    expect(cfg).toBe(addingValueGrantConfig)
  })

  test('returns exampleGrantConfig for grant type "example-grant"', () => {
    const cfg = getScoringConfig('example-grant')
    expect(cfg).toBe(exampleGrantConfig)
  })

  test('returns null for unknown grant type', () => {
    const cfg = getScoringConfig('does-not-exist')
    expect(cfg).toBeNull()
  })

  test('returns null when grant type is undefined', () => {
    const cfg = getScoringConfig(undefined)
    expect(cfg).toBeNull()
  })
})
