import { RuleValidatorClass, ParsedRule } from "../types/ValidatorType"
import RuleViolation from "./RuleViolation"
import Required from "../rules/Required"
import MinLength from "../rules/MinLength"
import MaxLength from "../rules/MaxLength"
import Min from "../rules/Min"
import Max from "../rules/Max"
import Email from "../rules/Email"
import In from "../rules/In"
import RuleValidator from "../interfaces/RuleValidator"
import RuleValidatorContext from "./RuleValidatorContext"

class Validator {
  /**
   * The constraints for validation
   */
  private ruleValidators: Record<string, RuleValidatorClass>

  public constructor(ruleValidators: Record<string, RuleValidatorClass> = {}) {
    this.ruleValidators = ruleValidators
  }

  public addRule(rules: Record<string, RuleValidatorClass>): void {
    for(const ruleKey in rules) {
      this.ruleValidators[ruleKey] = rules[ruleKey]
    }
  }

  /**
   * 
   * @param data Data to validate
   * @param rules Rules for validating
   * @param messages Custom message violation
   * @param attributes Custom attribute
   * @returns 
   */
  public async validate(data: any, rules: Record<string, string | Array<string | RuleValidator>>, messages: Record<string, string> = {}, attributes: Record<string, string> = {}): Promise<RuleViolation> {
    const errorMessages: Record<string, string[]> = {}
    const parsedData = this.parseData(data)

    for(const ruleKey in rules) {
      const dataAttributes: string[] = Object.keys(parsedData).filter(key => {
        return this.wildcardRegex(ruleKey).test(key)
      })
      const ruleValidators: { instance: RuleValidator, args: string[] }[] = []

      if(Array.isArray(rules[ruleKey])) {
        (rules[ruleKey] as Array<string | RuleValidator>).forEach(rule => {
          if(typeof rule == 'string') {
            ruleValidators.push()
          } else {
            ruleValidators.push(rule)
          }
        })
      } else {
        const splitRules = (rules[ruleKey] as string).split('|')
        splitRules.forEach(rule => {
          ruleValidators.push(this.getRule(rule))
        })
      }

      for(const dataAttribute of dataAttributes) {
        const ruleMessages: string[] = []

        ruleValidators.forEach(rule => {
          rule.context = new RuleValidatorContext(
            parsedData, 
            parsedData[dataAttribute], 
            this.getCustomAttribute(
              dataAttribute,
              attributes
            )
          )

          if(!rule.isValid()) {
            ruleMessages.push(this.messagePlaceholderReplacer(rule.message()))
          }
        })
      }
    }

    // for (const ruleAttribute in rules) {
    //   let dataAttributes: string[] // Data attribute that must be validated

    //   if (ruleAttribute.match(/\.\*\./g)) {
    //     dataAttributes = Object.keys(parsedData).filter(key => this.wildcardRegex(ruleAttribute).test(key))
    //   } else {
    //     dataAttributes = [ruleAttribute]
    //   }

    //   for (const dataAttribute of dataAttributes) {
    //     if (dataAttribute in errorMessages) break

    //     const violationMessages: string[] = []

    //     for (const { ruleName, args } of parsedRules[ruleAttribute]) {
    //       if (!(ruleName in this.ruleValidators)) throw new TypeError(`Rule ${ruleName} is not registered.`)

    //       const ruleInstance = new this.ruleValidators[ruleName](...args)
    //       ruleInstance.context = new ConstraintValidatorContext(data, parsedData[dataAttribute], this.getCustomAttribute(dataAttribute, attributes))

    //       if (!await ruleInstance.isValid()) {
    //         // firstName.required
    //         const customMessagePath = `${this.replaceIndexToWildcard(dataAttribute)}.${ruleName}` 
    //         const customMessageKeys = Object.keys(messages)
    //         let violationMessage: string

    //         if(customMessageKeys.includes(customMessagePath)) {
    //           violationMessage = messages[customMessagePath]
    //         } else if(!customMessageKeys.includes(customMessagePath) && customMessageKeys.includes(ruleName)) {
    //           violationMessage = messages[ruleName]
    //         } else {
    //           violationMessage = ruleInstance.message()
    //         }

    //         violationMessages.push(this.messagePlaceholderReplacer(
    //           violationMessage,
    //           this.getCustomAttribute(dataAttribute, attributes),
    //           parsedData[dataAttribute],
    //           args
    //         ))
    //       }
    //     }

    //     if (violationMessages.length > 0) errorMessages[dataAttribute] = violationMessages
    //   }
    // }

    // return new RuleViolation(errorMessages)
  }

  private ValueValidator = class {
    private isValid: boolean
    private message: string
    private args: string[]

    public constructor(value: any, rule: RuleValidator) {
      
    }


  }

  private parseData(obj: any | any[], prefix = ""): Record<string, any> {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : ''

      if (typeof obj[k] === 'object') Object.assign(acc, this.parseData(obj[k], pre + k))
      else acc[pre + k] = obj[k]

      return acc
    }, {})
  }

  /**
   * Get registered RuleValidator by delimited string
   * 
   * @param {string} rule
   * @returns {RuleValidator}
   */
  private getRule(rule: string): RuleValidator {
    const [name, args = ''] = rule.split('|')

    if(!(name in this.ruleValidators)) 
      throw new TypeError(`Rule ${name} is not registered.`)

    return new this.ruleValidators[name](...args.split(','))
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
        required: Required, 
        email: Email,
        in: In
      })
    }

    return this.validatorInstance
  }
}

export default Validator