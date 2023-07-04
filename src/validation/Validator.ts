import { RuleValidatorClass, ParsedRule } from "../types/ValidatorType"
import RuleViolation from "./RuleViolation"
import ConstraintValidatorContext from "./RuleValidatorContext"
import Required from "../rules/Required"
import MinLength from "../rules/MinLength"
import MaxLength from "../rules/MaxLength"
import Min from "../rules/Min"
import Max from "../rules/Max"

class Validator {
  /**
   * The constraints for validation
   */
  private ruleValidators: Record<string, RuleValidatorClass>

  public constructor(ruleValidators: Record<string, RuleValidatorClass> = {}) {
    this.ruleValidators = ruleValidators
  }

  /**
   * 
   * @param data Data to validate
   * @param rules Rules for validating
   * @param messages Custom message violation
   * @param attributes Custom attribute
   * @returns 
   */
  public async validate(data: any, rules: Record<string, string>, messages: Record<string, string> = {}, attributes: Record<string, string> = {}): Promise<RuleViolation> {
    const errorMessages: Record<string, string[]> = {}
    const parsedData = this.parseData(data)
    const parsedRules = this.parseRule(rules)

    for (const ruleAttribute in rules) {
      let dataAttributes: string[] // Data attribute that must be validated

      if (ruleAttribute.match(/\.\*\./g)) {
        dataAttributes = Object.keys(parsedData).filter(key => this.wildcardRegex(ruleAttribute).test(key))
      } else {
        dataAttributes = [ruleAttribute]
      }

      for (const dataAttribute of dataAttributes) {
        if (dataAttribute in errorMessages) break

        const violationMessages: string[] = []

        for (const { ruleName, args } of parsedRules[ruleAttribute]) {
          if (!(ruleName in this.ruleValidators)) throw new TypeError(`Rule ${ruleName} is not registered.`)

          const ruleInstance = new this.ruleValidators[ruleName](...args)
          ruleInstance.context = new ConstraintValidatorContext(data, parsedData[dataAttribute], this.getCustomAttribute(dataAttribute, attributes))

          if (!await ruleInstance.isValid()) {
            // firstName.required
            const customMessagePath = `${this.replaceIndexToWildcard(dataAttribute)}.${ruleName}` 
            const customMessageKeys = Object.keys(messages)
            let violationMessage: string

            if(customMessageKeys.includes(customMessagePath)) {
              violationMessage = messages[customMessagePath]
            } else if(!customMessageKeys.includes(customMessagePath) && customMessageKeys.includes(ruleName)) {
              violationMessage = messages[ruleName]
            } else {
              violationMessage = ruleInstance.message()
            }

            violationMessages.push(this.messagePlaceholderReplacer(
              violationMessage,
              this.getCustomAttribute(dataAttribute, attributes),
              parsedData[dataAttribute],
              args
            ))
          }
        }

        if (violationMessages.length > 0) errorMessages[dataAttribute] = violationMessages
      }
    }

    return new RuleViolation(errorMessages)
  }

  private parseData(obj: any | any[], prefix = ""): Record<string, any> {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : ''

      if (typeof obj[k] === 'object') Object.assign(acc, this.parseData(obj[k], pre + k))
      else acc[pre + k] = obj[k]

      return acc
    }, {})
  }

  private parseRule(ruleData: Record<string, string>): Record<string, ParsedRule[]> {
    const parsedRule: Record<string, ParsedRule[]> = {}

    for (const ruleProperty in ruleData) {
      const rules: ParsedRule[] = [] // Parse "range:5,10"

      for (const rule of ruleData[ruleProperty].split('|')) {
        const [ruleName, args] = rule.split(':')

        rules.push({ ruleName, args: args?.split(',') || [] })
      }

      parsedRule[ruleProperty] = rules
    }

    return parsedRule
  }

  /**
   * Replace number or index attribute to wildcard asterisk. 
   * 
   * Example from "books.0.name" to "books.*.name"
   * 
   * @param {string} attribute 
   * @returns {string}
   */
  private replaceIndexToWildcard(attribute: string): string {
    return attribute.replace(/\.\d+\./g, ".*.")
  }

  private getCustomAttribute(rawAttribute: string, customAttribute: Record<string, string>): string {
    return customAttribute[this.replaceIndexToWildcard(rawAttribute)] || rawAttribute
  }

  private messagePlaceholderReplacer(message: string, attribute: string, value: any, ruleArgs: string[]) {
    return message
      .replace(/:attribute/g, attribute)
      .replace(/:value/g, value?.toString() || '')
      .replace(/:arg(\d+)/g, (match, p1) => ruleArgs[parseInt(p1) - 1])
  }

  private wildcardRegex(attribute: string): RegExp {
    return new RegExp(
      attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\\\*/g, '\\d+') + '$'
    )
  }

  private static validatorInstance: Validator

  public static getValidator(): Validator {
    if (!this.validatorInstance) {
      this.validatorInstance = new Validator({
        min: Min,
        max: Max,
        min_length: MinLength,
        max_length: MaxLength,
        required: Required
      })
    }

    return this.validatorInstance
  }
}

export default Validator