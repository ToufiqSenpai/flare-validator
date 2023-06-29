import ConstraintValidator from "../interfaces/RuleValidator";

export type RuleValidatorClass = new(...args: string[]) => ConstraintValidator

// export interface ConstructorParam {
//   data: any
//   rules: Record<string, string>
//   messages?: Record<string, string>
//   attributes?: Record<string, string>
//   constraints?:Record<string, ConstraintValidatorClass>
// }

export interface ParsedRule {
  ruleName: string
  args: string[]
}