import RuleValidator from "../interfaces/RuleValidator";
import ConstraintValidator from "../interfaces/RuleValidator";

export type RuleValidatorClass = new(...args: string[]) => ConstraintValidator

// export interface ConstructorParam {
//   data: any
//   rules: Record<string, string>
//   messages?: Record<string, string>
//   attributes?: Record<string, string>
//   constraints?:Record<string, ConstraintValidatorClass>
// }

export type RulesProp = string | Array<string | RuleValidator>

export interface GetRule {
  instance: RuleValidator
  args: string[]
}

export interface ValidatorConstructorParam {
  data: any
  rules: RulesProp
  messages: Record<string, string>
  attributes: Record<string, string>
  ruleValidators: RuleValidatorClass
}

export interface ValidatorMap {
  name: string
  args: string[]
  instance: RuleValidator
}