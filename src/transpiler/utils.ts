export function isNotAtomicProposition(predicate: any) {
  return (
    predicate == 'ForAllSuchThat' ||
    predicate == 'ThereExistsSuchThat' ||
    predicate == 'Not' ||
    predicate == 'And' ||
    predicate == 'Or'
  )
}

export function isAtomicProposition(predicate: any) {
  return !isNotAtomicProposition(predicate)
}

export function isComparisonPredicate(predicate: any) {
  return (
    predicate == 'assert' || predicate == 'gte' || predicate == 'checkAmount'
  )
}

export function toCapitalCase(name: string) {
  return name[0].toUpperCase() + name.substr(1)
}

export function isUpperCase(name: string): boolean {
  return name == name.toUpperCase()
}
