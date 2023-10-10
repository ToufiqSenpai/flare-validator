import RuleValidator from "../interfaces/RuleValidator";
import RuleValidatorContext from "../validation/RuleValidatorContext";

class Min implements RuleValidator {
  public context: RuleValidatorContext

  private min: number

  constructor(min: string) {
    this.min = Number.parseInt(min)
  }

  public message(): string {
    return `Min ${this.context.getAttribute()} value is ${this.min}`
  }
  
  public isValid(): boolean | Promise<boolean> {
    const value = this.context.getValue()
    return typeof value == 'number' && value >= this.min
  }
}

export default Min