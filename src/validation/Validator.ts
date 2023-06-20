import { ConstraintValidatorClass, ConstructorParam } from "../types/ValidatorType"
import RuleViolation from "./RuleViolation"
import ConstraintValidatorContext from "./ConstraintValidatorContext"
import Required from "../constraints/Required"
import MinLength from "../constraints/MinLength"
import MaxLength from "../constraints/MaxLength"

class Validator {
  private data: any

  private rules: Record<string, string>

  private messages: Record<string, string>

  private attributes: Record<string, string>

  private constraints: Record<string, ConstraintValidatorClass>

  private parsedData: Record<string, any>

  public constructor({ data, rules, messages = {}, attributes = {}, constraints = {} }: ConstructorParam) {
    this.data = data
    this.rules = rules
    this.messages = messages
    this.attributes = attributes
    this.constraints = constraints
    this.parsedData = this.parseData(data)
  }

  public async validate(): Promise<RuleViolation> {
    const errorMessages: Record<string, string[]> = {}

    for(const dataAttribute in this.parsedData) {
      const replacedAttribute = this.replaceWildcard(dataAttribute)

      if(replacedAttribute in this.rules) {
        const violationMessages = await this.validateValue(dataAttribute, this.parsedData[dataAttribute], this.rules[replacedAttribute].split('|'))
        violationMessages.length > 0 ? errorMessages[dataAttribute] = violationMessages : null
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
  
  private async validateValue(attribute: string, value: any, rules: string[]): Promise<string[]> {
    const messages: string[] = []

    for(const constraint of rules) {
      const [constraintName, args] = this.ruleParser(constraint)

      // Check if rule attribute is custom rule class
      if(constraintName in this.constraints) {
        const constraintInstance = new this.constraints[constraintName](...args)
        constraintInstance.context = new ConstraintValidatorContext(this.data, value, this.getCustomAttribute(attribute))
       
        if(!await constraintInstance.isValid()) {
          const violationMessage = this.messagePlaceholderReplacer(
            this.messages[`${attribute}.${constraintName}`] || constraintInstance.message(),
            this.getCustomAttribute(attribute),
            value,
            args
          ) 

          messages.push(violationMessage)
        }
      } else {
        throw new TypeError(`Constraint ${constraintName} is not registered.`)
      }
    }

    return messages
  }
  
  private ruleParser(rule: string): [string, string[]] {
    const splittedRule = rule.split(':')
    return [splittedRule[0], splittedRule[1]?.split(',') || []]
  }

  /**
   * Replace index attribute to wildcard asterisk. 
   * 
   * Example from "books.0.name" to "books.*.name"
   * 
   * @param {string} attribute 
   * @returns {string}
   */
  private replaceWildcard(attribute: string): string {
    return attribute.replace(/\.\d+\./g, ".*.")
  }

  private getCustomAttribute(rawAttribute: string): string {
    return this.attributes[this.replaceWildcard(rawAttribute)] || rawAttribute
  }

  private messagePlaceholderReplacer(message: string, attribute: string, value: any, ruleArgs: string[]) {
    return message
      .replace(/:attribute/g, attribute)
      .replace(/:value/g, value?.toString() || '')
      .replace(/:arg(\d+)/g, (match, p1) => ruleArgs[parseInt(p1) - 1])
  }

  public static make(data: any, rules: Record<string, string>, messages: Record<string, string> = {}, attributes: Record<string, string> = {}): Validator {
    const validator = new Validator({
      data,
      rules,
      messages,
      attributes,
      constraints: {
        required: Required,
        min_length: MinLength,
        max_length: MaxLength
      }
    })

    return validator
  }
}

export default Validator