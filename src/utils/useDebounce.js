export function useDebounce(callback, wait = 300) {
  let t = null
  return function (...args) {
    clearTimeout(t)
    t = setTimeout(() => callback(...args), wait)
  }
}