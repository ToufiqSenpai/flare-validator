import ValidationRule from "../interfaces/ValidationRule"
import { RuleValidation, ValidatorRules } from "../types/ValidatorType";
import RuleViolation from "./RuleViolation"

class Validator<T> {
  private data: T

  private rules: ValidatorRules

  private messages: Record<string, string>

  private attributes: Record<string, string>

  private ruleValidator: RuleValidation<ValidationRule>

  public constructor(ruleValidator: RuleValidation<ValidationRule>) {
    this.ruleValidator = ruleValidator
  }

  public async validate<T extends object>(data: T, rules: ValidatorRules, message: Record<string, string> = {}, attributes: Record<string, string> = {}): Promise<RuleViolation> {
    
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

  private async validateDataRule(value: any, ruleAttributes: Array<string | object>) {
    for(const rule of ruleAttributes) {
      // Check if rule attribute is custom rule class
      if(typeof rule == 'object' && 'logic' in rule && typeof rule.logic == 'function') {

      } else if(typeof rule == 'string') {
        const [name, args] = rule.split(':')
        let ruleInstance: ValidationRule

        // If a rule is not defined, throw an error.
        if(name in this.ruleValidator) ruleInstance = new this.ruleValidator[name](...args.split(','))
        else throw new ValidatorException(`Rule ${name} is not defined`)


      }
    }
  }

  private setValidationAwareContract(): ValidationRule {

  }

  public static make() {

  }
}

export default Validator