export function reorderImmutable<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = list.slice()
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}
