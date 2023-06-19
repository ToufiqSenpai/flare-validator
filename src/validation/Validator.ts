import { ConstraintValidatorClass, ConstructorParam } from "../types/ValidatorType"
import BaseConstraint from "../interfaces/ConstraintValidator"
import RuleViolation from "./RuleViolation"
import ConstraintValidatorContext from "./ConstraintValidatorContext"
import ValidatorException from "../exceptions/ValidatorException"
import getObjectByPath from "../utils/getObjectByPath"
import MessageReplacer from "../interfaces/MessageReplacer"

class Validator<T> {
  private data: Record<string, any>

  private rules: Record<string, string>

  private messages: Record<string, string>

  private attributes: Record<string, string>

  private constraintValidators: Record<string, ConstraintValidatorClass> = {}

  private messageReplacer: Record<string, MessageReplacer> = {}

  private errorMessages: Record<string, string[]> = {}

  public constructor({ data, rules, messages = {}, attributes = {}, options = {} }: ConstructorParam<T>) {
    this.data = this.parseData(data)
    this.rules = rules
    this.messages = messages
    this.attributes = attributes
    
    options.constraints ? this.constraintValidators = options.constraints : null
  }

  public async validate(): Promise<RuleViolation> {
    for(const dataAttribute in this.data) {
      const replacedAttribute = dataAttribute.replace(/\.\d+\./g, ".*.")
      
      if(replacedAttribute in this.rules) {
        this.errorMessages[dataAttribute] = await this.validateValue(this.data[dataAttribute], dataAttribute, this.rules[replacedAttribute].split('|'))
      }
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
  
  private async validateValue(value: any, rawAttribute: string, rules: string[]): Promise<string[]> {
    const messages: string[] = []

    for(const constraint of rules) {
      const [constraintName, args = ''] = constraint.split(':')

      // Check if rule attribute is custom rule class
      if(constraintName in this.constraintValidators) {
        const constraintInstance = new this.constraintValidators[constraintName](...args.split(','))
      
        !await constraintInstance.isValid(new ConstraintValidatorContext(this.data, value, rawAttribute, this.attributes[rawAttribute])) && messages.push(constraintInstance.message)
      } else {
        throw new TypeError(`Constraint ${constraintName} is not registered.`)
      }
    }

    return messages
  }

  private getCustomAttribute(rawAttribute: string): string {
    return 
  }

  public static make() {

  }
}

export default Validator