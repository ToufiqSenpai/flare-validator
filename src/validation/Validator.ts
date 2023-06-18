import { ConstraintValidatorClass, ConstructorParam } from "../types/ValidatorType"
import BaseConstraint from "../interfaces/ConstraintValidator"
import RuleViolation from "./RuleViolation"
import ConstraintValidatorContext from "./ConstraintValidatorContext"
import ValidatorException from "../exceptions/ValidatorException"

class Validator<T> {
  private data: T

  private rules: Record<string, string>

  private messages: Record<string, string>

  private attributes: Record<string, string>

  private constraintsValidator: Record<string, ConstraintValidatorClass> = {}

  public constructor({ data, rules, messages, attributes, options }: ConstructorParam<T>) {
    this.data = data
    this.rules = rules
    this.messages = messages
    this.attributes = attributes
    this.constraintsValidator = options.constraints
  }

  public async validate(): Promise<RuleViolation> {
    
  }

  private parseData(obj: any | any[], prefix = ""): Record<string, any> {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : ''
      if (typeof obj[k] === 'object') Object.assign(acc, this.parseData(obj[k], pre + k))
      else acc[pre + k] = obj[k]
      return acc
    }, {})
  }
  
  private async validateValue(value: any, rules: string[]): Promise<string[]> {
    const messages: string[] = []

    for(const constraint of rules) {
      const [constraintName, args = ''] = constraint.split(':')

      // Check if rule attribute is custom rule class
      if(constraintName in this.constraintsValidator) {
        const constraintInstance = new this.constraintsValidator[constraintName](...args.split(','))
      
        if(!await constraintInstance.isValid(new ConstraintValidatorContext(value, ''))) messages.push(constraintInstance.message)
      } else {
        throw new TypeError(`Constraint ${constraintName} is not registered.`)
      }
    }

    return messages
  }

  public static make() {

  }
}

export default Validator