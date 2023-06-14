import ValidationRule from "../interfaces/ValidationRule";

export type RuleValidation<T extends ValidationRule> = { [key: string]: new(...args: string[]) => T }

export type ValidatorRules = { [key: string]: string | Array<string | ValidationRule> }

export type WildcardObject = { [key: string]: string }

export interface ValidatorOptions {
  rules: 
}