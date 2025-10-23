import { exampleGrantConfig } from './grants/example-grant-config.js'
import { addingValueGrantConfig } from './grants/adding-value-grant-config.js'

const scoringConfigs = {
  'adding-value': addingValueGrantConfig,
  'example-grant': exampleGrantConfig
}

export const getScoringConfig = (grantType) => {
  return scoringConfigs[grantType] ?? null
}
