/**
 * Pre-handler to normalize incoming request payloads to a unified `answers` format.
 *
 * This function supports two payload formats:
 * 1. **Key-Value Format** (`data.main`): Transforms `{ data: { main: { key: value } } }` into the `answers` array format.
 * 2. **Answers Format** (`answers`): If the payload already has `answers`, it remains unchanged.
 *
 * **Before (Key-Value Format):**
 * ```json
 * {
 *   "data": {
 *     "main": {
 *       "component1Name": "component1Value",
 *       "component2Name": "component2Value"
 *     }
 *   }
 * }
 * ```
 *
 * **After Transformation:**
 * ```json
 * {
 *   "answers": [
 *     { "questionId": "component1Name", "answers": ["component1Value"] },
 *     { "questionId": "component2Name", "answers": ["component2Value"] }
 *   ]
 * }
 * ```
 *
 * **If Payload is Already in `answers` Format:**
 * ```json
 * {
 *   "answers": [
 *     { "questionId": "component1Name", "answers": ["component1Value"] }
 *   ]
 * }
 * ```
 * This format is passed through without changes.
 * @param {object} request - The Hapi request object containing the payload.
 * @param {object} h - The Hapi response toolkit to continue the lifecycle.
 * @returns {object} `h.continue` to proceed to the next lifecycle step.
 */
export const normalizePayload = (request, h) => {
  const { data } = request.payload

  if (data?.main) {
    request.payload.answers = Object.entries(data.main).map(([key, value]) => ({
      questionId: key,
      answers: Array.isArray(value)
        ? value
        : value != null
          ? [value] // Wrap string, number, or boolean in an array
          : [] // Fallback to an empty array if value is null/undefined
    }))
    delete request.payload.data
  }

  return h.continue
}
