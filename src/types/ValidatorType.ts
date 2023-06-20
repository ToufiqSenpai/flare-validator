import ConstraintValidator from "../interfaces/ConstraintValidator";

export type ConstraintValidatorClass = new(...args: string[]) => ConstraintValidator

export interface ConstructorParam {
  data: any
  rules: Record<string, string>
  messages?: Record<string, string>
  attributes?: Record<string, string>
  constraints?:Record<string, ConstraintValidatorClass>
}