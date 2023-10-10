import RuleValidator from "../interfaces/RuleValidator";
import RuleValidatorContext from "../validation/RuleValidatorContext";

class MinLength implements RuleValidator {
  public context: RuleValidatorContext

  private minLength: string

  constructor(minLength: string) {
    this.minLength = minLength
  }

  public message(): string {
    return `Min ${this.context.getAttribute()} character length is ${this.minLength}`
  }
  
  public isValid(): boolean | Promise<boolean> {
    const value = this.context.getValue()
    return !value !== (value?.length > this.minLength)
  }
}

export default MinLength