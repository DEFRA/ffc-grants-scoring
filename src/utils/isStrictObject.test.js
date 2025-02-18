import { isStrictObject } from './isStrictObject.js'

describe('isStrictObject', () => {
  it('returns true for plain objects', () => {
    expect(isStrictObject({ key: 'value' })).toBe(true)
  })

  it('returns false for arrays', () => {
    expect(isStrictObject([])).toBe(false)
    expect(isStrictObject([1, 2, 3])).toBe(false)
  })

  it('returns false for null', () => {
    expect(isStrictObject(null)).toBe(false)
  })

  it('returns false for primitive types', () => {
    expect(isStrictObject(42)).toBe(false)
    expect(isStrictObject('string')).toBe(false)
    expect(isStrictObject(true)).toBe(false)
    expect(isStrictObject(undefined)).toBe(false)
    expect(isStrictObject(Symbol('test'))).toBe(false)
  })

  it('returns false for functions', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isStrictObject(() => {})).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isStrictObject(undefined)).toBe(false)
  })

  it('handles the optional checkIfEmpty flag', () => {
    expect(isStrictObject({}, false)).toBe(true)
    expect(isStrictObject({}, true)).toBe(false)
  })
})
