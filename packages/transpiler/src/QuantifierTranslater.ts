import { BigNumber } from '@cryptoeconomicslab/primitives'
import { PropertyDef, PropertyNode } from '@cryptoeconomicslab/ovm-parser'
import * as utils from './utils'

interface PredicatePreset {
  name: string
  translate: (p: PropertyNode) => PropertyNode
}

interface QuantifierPreset {
  name: string
  translate: (
    quantifier: PropertyNode,
    variable: string
  ) => { hint: string; property: PropertyNode }
}

/**
 * replace inputs of targetNode by calling inputs
 * @param targetNode
 * @param callingInputs
 * @param inputDefs
 */
const replaceInputs = (
  targetNode: PropertyNode,
  callingInputs: string[],
  inputDefs: string[]
): PropertyNode => {
  return {
    type: 'PropertyNode',
    predicate: targetNode.predicate,
    inputs: targetNode.inputs.map(i => {
      if (typeof i == 'string') {
        const index = inputDefs.indexOf(i)
        if (index >= 0) {
          return callingInputs[index]
        }
      } else if (i && i.type == 'PropertyNode') {
        return replaceInputs(i, callingInputs, inputDefs)
      }
      return i
    })
  }
}

/**
 * create preset predicate from property definition
 * @param propertyDefinition
 */
function createPredicatePreset(
  propertyDefinition: PropertyDef
): PredicatePreset {
  return {
    name: propertyDefinition.name,
    translate: (p: PropertyNode) =>
      replaceInputs(
        propertyDefinition.body,
        p.inputs as string[],
        propertyDefinition.inputDefs
      )
  }
}

/**
 * create preset quantifier from property definition
 * @param propertyDefinition
 */
function createQuantifierPreset(
  propertyDefinition: PropertyDef
): QuantifierPreset | null {
  const replaceHint = (
    hint: string,
    substitutions: { [key: string]: string }
  ): string => {
    const fillTemplate = function(
      templateString: string,
      templateVars: string[]
    ) {
      return new Function(
        ...Object.keys(substitutions).concat([
          'return `' + templateString + '`'
        ])
      ).call(null, ...templateVars)
    }
    return fillTemplate(
      hint,
      Object.keys(substitutions).map(k => substitutions[k])
    )
  }
  const getSubstitutions = (
    callingInputs: string[]
  ): { [key: string]: string } => {
    const substitutions: { [key: string]: string } = {}
    // skip variable
    // When we parse predicate as quantifier, the first input is variable.
    propertyDefinition.inputDefs.slice(1).forEach((inputName, index) => {
      substitutions[inputName] = '${' + callingInputs[index] + '}'
    })
    const encodedZero = ovmContext.coder.encode(BigNumber.from(0)).toHexString()
    substitutions['zero'] = encodedZero
    return substitutions
  }
  const quantifierAnnotation = propertyDefinition.annotations.find(
    a => a.body.name == 'quantifier'
  )
  if (!quantifierAnnotation) {
    return null
  }
  const hint = quantifierAnnotation.body.args[0]
  return {
    name: propertyDefinition.name,
    translate: (quantifier: PropertyNode, variable: string) => {
      const callingInputs = quantifier.inputs as string[]
      return {
        hint: replaceHint(hint, getSubstitutions(callingInputs)),
        property: replaceInputs(
          propertyDefinition.body,
          [variable].concat(callingInputs),
          propertyDefinition.inputDefs
        )
      }
    }
  }
}

/**
 * apply preset predicate library and preset quantifier library.
 * @param propertyDefinitions
 * @param importedPredicates
 */
export function applyLibraries(
  propertyDefinitions: PropertyDef[],
  importedPredicates: PropertyDef[]
): PropertyDef[] {
  const inlinePredicates = importedPredicates.filter(
    p => !!p.annotations.find(a => a.body.name == 'library')
  )
  const presetTable = inlinePredicates.reduce<{
    [key: string]: PredicatePreset
  }>((presetTable, importedPredicate) => {
    const preset = createPredicatePreset(importedPredicate)
    presetTable[preset.name] = preset
    return presetTable
  }, {})
  const quantifierPresetTable = inlinePredicates.reduce<{
    [key: string]: QuantifierPreset
  }>((presetTable, importedPredicate) => {
    const preset = createQuantifierPreset(importedPredicate)
    if (preset) {
      presetTable[preset.name] = preset
    }
    return presetTable
  }, {})
  propertyDefinitions.reduce(
    ({ presetTable, quantifierPresetTable }, propertyDefinition) => {
      const translator = createTranslator(presetTable, quantifierPresetTable)
      const translated = translator(propertyDefinition.body)
      propertyDefinition.body = translated
      presetTable[propertyDefinition.name] = createPredicatePreset(
        propertyDefinition
      )
      const quantifierPreset = createQuantifierPreset(propertyDefinition)
      if (quantifierPreset) {
        quantifierPresetTable[quantifierPreset.name] = quantifierPreset
      }
      return { presetTable, quantifierPresetTable }
    },
    { presetTable, quantifierPresetTable }
  )
  return propertyDefinitions
}

function createTranslator(
  presetTable: { [key: string]: PredicatePreset },
  quantifierPresetTable: { [key: string]: QuantifierPreset }
) {
  const translate = (
    p: PropertyNode,
    variableSuffix: number = 0
  ): PropertyNode => {
    if (utils.isAtomicProposition(p.predicate)) {
      const preset = presetTable[p.predicate]
      if (preset) {
        return preset.translate(p)
      }
    } else if (p.predicate == 'ForAllSuchThat') {
      return translateForAllSuchThat(p)
    } else if (p.predicate == 'ThereExistsSuchThat') {
      return translateThereExistsSuchThat(p, (variableSuffix++).toString())
    } else {
      p.inputs = p.inputs.map((i: string | undefined | PropertyNode) => {
        if (typeof i === 'string' || i === undefined) {
          return i
        } else {
          return translate(i, variableSuffix)
        }
      })
    }
    return p
  }
  const translateForAllSuchThat = (p: PropertyNode): PropertyNode => {
    if (p.inputs[0] === undefined || typeof p.inputs[0] === 'string') {
      throw new Error('invalid quantifier')
    }
    const preset = quantifierPresetTable[p.inputs[0].predicate]
    p.inputs[2] = translate(p.inputs[2] as PropertyNode)
    if (preset) {
      const quantifier = p.inputs[0] as PropertyNode
      const variable = p.inputs[1] as string
      const translated = preset.translate(quantifier, variable)
      p.inputs[0] = translated.hint
      const condition = translated.property
      if (condition) {
        p.inputs[2] = {
          type: 'PropertyNode',
          predicate: 'Or',
          inputs: [
            {
              type: 'PropertyNode',
              predicate: 'Not',
              inputs: [translate(condition)]
            },
            p.inputs[2]
          ]
        }
      }
    }
    return p
  }
  const translateThereExistsSuchThat = (
    p: PropertyNode,
    suffix: string
  ): PropertyNode => {
    if (p.inputs[0] === undefined || typeof p.inputs[0] === 'string') {
      return p
    }
    const preset = quantifierPresetTable[p.inputs[0].predicate]
    const originalChildren = (p.inputs.slice(2) as PropertyNode[]).map(
      translate
    )
    if (preset) {
      const quantifier = p.inputs[0] as PropertyNode
      if (p.inputs[1] === undefined) {
        p.inputs[1] = 'v' + suffix
      }
      const variable = p.inputs[1] as string
      const translated = preset.translate(quantifier, variable)
      p.inputs[0] = translated.hint
      if (translated.property) {
        if (originalChildren.length == 1) {
          p.inputs[2] = {
            type: 'PropertyNode',
            predicate: 'And',
            inputs: [translate(translated.property)].concat(originalChildren)
          }
        } else {
          p.inputs[2] = translate(translated.property)
        }
      }
    }
    return p
  }

  return translate
}
