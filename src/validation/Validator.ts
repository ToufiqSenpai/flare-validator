import { RuleValidatorClass, RulesProp, ValidatorMap } from "../types/ValidatorType"
import RuleViolation from "./RuleViolation"
import Required from "../rules/Required"
import MinLength from "../rules/MinLength"
import MaxLength from "../rules/MaxLength"
import Min from "../rules/Min"
import Max from "../rules/Max"
import Email from "../rules/Email"
import In from "../rules/In"
import RuleValidatorContext from "./RuleValidatorContext"

class Validator {
  private data: any

  private validators: Map<string, ValidatorMap[]> = new Map()

  private messages: Record<string, string>

  private attributes: Record<string, string>

  /**
   * The validator for validation
   */
  // private validators: Record<string, RuleValidatorClass>

  private constructor(
    data: any,
    rules: Record<string, RulesProp>,
    messages: Record<string, string>,
    attributes: Record<string, string>,
    validators: Record<string, RuleValidatorClass>
  ) {
    this.data = data
    this.messages = messages
    this.attributes = attributes

    for (const ruleKey in rules) {
      let arrayRule = rules[ruleKey]
      const parsedValidators: ValidatorMap[] = []

      if (typeof arrayRule == 'string') {
        arrayRule = arrayRule.split('|')
      }

      for (const rule of arrayRule) {
        if (typeof rule == 'string') {
          const [name, args = ''] = rule.split(':')
          const splittedArgs = args.split(',')

          if (!(name in validators)) throw new TypeError(`Rule ${name} is not registered.`)

          parsedValidators.push({ name, args: splittedArgs, instance: new validators[name](...splittedArgs) })
        } else {
          parsedValidators.push({ name: rule.constructor.name, args: [], instance: rule })
        }
      }

      this.validators.set(ruleKey, parsedValidators)
    }
  }

  /**
   * 
   * 
   */
  public async validate() {
    const messages: Record<string, string[]> = {}
    const parsedData = this.parseData(this.data)

    for (const validatorKey of this.validators.keys()) {
      let dataAttributes: string[]

      if(validatorKey.match(/\.\*\./)) {
        dataAttributes = Object.keys(parsedData).filter(key => this.createWildcardRegex(validatorKey).test(key))
      } else {
        dataAttributes = [validatorKey]
      }

      for(const dataAttribute of dataAttributes) {
        const violationMessages: string[] = []
        const value = parsedData[dataAttribute] // Value to be validated

        for (const ruleValidator of this.validators.get(validatorKey)) {
          ruleValidator.instance.context = new RuleValidatorContext(
            this.data,
            value,
            this.getCustomAttribute(dataAttribute)
          )

          if (!await ruleValidator.instance.isValid()) {
            violationMessages.push(this.getCustomMessage(
              ruleValidator.name, 
              dataAttribute, 
              value, 
              ruleValidator.args
            ) ?? ruleValidator.instance.message())
          }
        }

        if (violationMessages.length > 0) {
          messages[dataAttribute] = violationMessages
        }
      }
    }

    return new RuleViolation(messages)
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

  private getCustomAttribute(rawAttribute: string): string {
    return this.attributes[this.replaceIndexToWildcard(rawAttribute)] || rawAttribute
  }

  /**
   * 
   * @param {string} name of the rule
   * @param {string} attribute of the parsed data
   * @param args of rule
   * @returns {string | null} string if custom message is found, else null.
   */
  private getCustomMessage(name: string, attribute: string, value: any, args: string[]): string | null {
    const messagePath = `${this.replaceIndexToWildcard(attribute)}.${name}`
    const messageKeys = Object.keys(this.messages)
    let resultMessage: string

    if (messageKeys.includes(messagePath)) {
      resultMessage = this.messages[messagePath]
    } else if (!messageKeys.includes(messagePath) && messageKeys.includes(name)) {
      resultMessage = this.messages[name]
    } else {
      return null
    }

    return resultMessage
      .replace(/:attribute/g, this.getCustomAttribute(attribute))
      .replace(/:value/g, value?.toString() || '')
      .replace(/:arg(\d+)/g, (_, p1) => args[parseInt(p1) - 1])
  }

  private createWildcardRegex(attribute: string): RegExp {
    return new RegExp(
      attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\\\*/g, '\\d+') + '$'
    )
  }

  public static async validate(
    data: any, 
    rules: Record<string, RulesProp>, 
    messages: Record<string, string> = {},
    attributes: Record<string, string> = {},
    customValidators: Record<string, RuleValidatorClass> = {}
  ): Promise<RuleViolation> {
    const nativeValidators = {
      required: Required,
      min_length: MinLength,
      max_length: MaxLength,
      min: Min,
      max: Max,
      email: Email,
      in: In
    }

    const validator = new Validator(data, rules, messages, attributes, { ...nativeValidators, ...customValidators })
    return await validator.validate()
  }
}

export default Validator