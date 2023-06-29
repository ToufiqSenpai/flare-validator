import RuleValidator from "../interfaces/RuleValidator";
import RuleValidatorContext from "../validation/RuleValidatorContext";

class Min implements RuleValidator {
  public context: RuleValidatorContext

  private min: string

  constructor(min: string) {
    this.min = min
  }

  public message(): string {
    return `Min :attribute value is :arg1`
  }
  
  public isValid(): boolean | Promise<boolean> {
    return this.context.getValue() >= this.min
  }
}

export default Min