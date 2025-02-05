/**
 * Pre-handler to normalize incoming request payloads to a unified `answers` format.
 *
 * This function supports two payload formats:
 * 1. **Key-Value Format** (`data`): Transforms `{ data: { key: value } }` into the `answers` array format.
 * 2. **Answers Format** (`answers`): If the payload already has `answers`, it remains unchanged.
 *
 * **Before (Key-Value Format):**
 * ```json
 * {
 *   "data": {
 *     "component1Name": "component1Value",
 *     "component2Name": "component2Value"
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

  // If data exists, translate it to the "answers" format
  if (data) {
    request.payload.answers = Object.entries(data).map(([key, value]) => ({
      questionId: key,
      answers: value
    }))
    delete request.payload.data // Remove the original data property
  }

  return h.continue
}
