export function cleanEmptyValues(obj: any) {
  for (const key in obj) {
    if (/^\s*$/.test(obj[key]) || !obj[key]) {
      delete obj[key]
    }
  }
  return obj
}
