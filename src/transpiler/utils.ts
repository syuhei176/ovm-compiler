export function isNotAtomicProposition(predicate: string) {
  return (
    predicate == 'ForAllSuchThat' ||
    predicate == 'ThereExistsSuchThat' ||
    predicate == 'Not' ||
    predicate == 'And' ||
    predicate == 'Or'
  )
}

export function isAtomicProposition(predicate: string) {
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

export function isConstantVariable(name: string): boolean {
  return name[0] === '$'
}

export function isReservedWord(name: string): boolean {
  return name == 'self'
}

export function getBindParams(
  name: string
): { parent: string; children: number[] } {
  const nameArr = name.split('.')
  const parent = nameArr[0]
  const children = nameArr.slice(1).map(c => {
    if (c == 'address') {
      return -1
    } else {
      return Number(c)
    }
  })
  return { parent, children }
}
