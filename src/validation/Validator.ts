import ValidationRule from "../interfaces/ValidationRule"
import { RuleValidator, ValidateRulesParam, WildcardObject } from "../types/ValidatorType";
import RuleViolation from "./RuleViolation"

class Validator {
  private ruleValidator: RuleValidator<ValidationRule>

  public constructor(ruleValidator: RuleValidator<ValidationRule>) {
    this.ruleValidator = ruleValidator
  }

  public async validate<T extends object>(data: T, rules: ValidateRulesParam, message: Record<string, string> = {}, attributes: Record<string, string> = {}): Promise<RuleViolation> {
    
    for(const ruleKey in rules) {

    }
  }

  private flattenObject<T>(obj: T, prefix = ''): { [key: string]: any } {
    const flattened: { [key: string]: any } = {};
  
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const nestedKeys = this.flattenObject(obj[key], `${prefix}${key}.`);
          Object.assign(flattened, nestedKeys);
        } else {
          flattened[`${prefix}${key}`] = obj[key];
        }
      }
    }
  
    return flattened;
  }

  private validateDataRule(value: any, ruleAttributes: string | string[]) {
    if(!Array.isArray(ruleAttributes)) ruleAttributes.split('|')

    for(const rule of ruleAttributes) {
      // const [ruleName, ruleParam] = rule.split(':').splice(1, 1, rule.split(':')[1].split(','))
    }
  }
}

export default Validator