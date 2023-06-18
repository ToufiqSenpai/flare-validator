import MessageReplacer from "../interfaces/MessageReplacer";
import ConstraintValidator from "../interfaces/ConstraintValidator";

export type ConstraintValidatorClass = new(...args: string[]) => ConstraintValidator

export type MessageReplacerValidator = new() => MessageReplacer

export interface ConstructorParam<T> {
  data: T
  rules: Record<string, string>
  messages?: Record<string, string>
  attributes?: Record<string, string>
  options?: {
    constraints?: Record<string, ConstraintValidatorClass>
    replacers?: Record<string, MessageReplacerValidator>
  }
}