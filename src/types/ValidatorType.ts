import ValidationRule from "../interfaces/ValidationRule";

export type RuleValidator<T extends ValidationRule> = { [key: string]: new(...args: string[]) => T }

export type ValidatorRules = { [key: string]: string | Array<string | ValidationRule> }

export interface ConstructorParam<T> {
  data: T
  rules: Record<string, string>
  messages: Record<string, string>
  attributes: Record<string, string>
  options: {
    constraints: Record<string, new(...args: string[]) => >
  }
}