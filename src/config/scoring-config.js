import { exampleGrantConfig } from './example-grant/example-grant-config.js'

const scoringConfigs = {
  'example-grant': exampleGrantConfig
}

export const getScoringConfig = (grantType) => {
  return scoringConfigs[grantType] || null
}
