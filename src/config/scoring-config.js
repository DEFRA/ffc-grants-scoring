import { exampleGrantConfig } from './example-grant/example-grant-config.js'
import { addingValueGrantConfig } from './adding-value-grant/adding-value-grant-config.js'

const scoringConfigs = {
  'adding-value': addingValueGrantConfig,
  'example-grant': exampleGrantConfig
}

export const getScoringConfig = (grantType) => {
  return scoringConfigs[grantType] || null
}
