export function cleanEmptyValues(obj: any) {
  for (const key in obj) {
    if (/^\s*$/.test(obj[key]) || !obj[key]) {
      delete obj[key]
    }
  }
  return obj
}

export function capitalizeFirstLetter(string: string) {
  if (!isNaN(+string)) return string
  if (!string) return ''
  return string?.charAt(0).toUpperCase() + string.slice(1) ?? ''
}
