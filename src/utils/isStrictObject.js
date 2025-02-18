export const isStrictObject = (value, checkIfEmpty = false) => {
  const isObject = Object.prototype.toString.call(value) === '[object Object]'

  if (!isObject) return false
  if (checkIfEmpty) if (!Object.keys(value).length) return false

  return true
}
