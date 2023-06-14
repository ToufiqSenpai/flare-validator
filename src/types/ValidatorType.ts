import ValidationRule from "../interfaces/ValidationRule";

// export type FlattenObject<T> = T extends object
//   ? {
//       [K in keyof T & string as `${string & K}`]: T[K] extends object ? FlattenObject<T[K]> : T[K];
//     }
//   : T;

// export type FlattenKeys<T> = T extends object ? {
//   [K in keyof T]: T[K] extends object ? FlattenKeys<T[K]> : string
// } : string;

export type RuleValidator<T extends ValidationRule> = { [key: string]: new(...args: string[]) => T }

export type ValidateRulesParam = { [key: string]: string | Array<string | ValidationRule> }

export type WildcardObject = { [key: string]: string }