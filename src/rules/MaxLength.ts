import RuleValidator from "../interfaces/RuleValidator";
import RuleValidatorContext from "../validation/RuleValidatorContext";

class MaxLength implements RuleValidator {
  public context: RuleValidatorContext

  private maxLength: string

  constructor(maxLength: string) {
    this.maxLength = maxLength
  }

  public message(): string {
    return `Max ${this.context.getAttribute()} character length is ${this.maxLength}`
  }
  
  public isValid(): boolean | Promise<boolean> {
    const value = this.context.getValue()
    return !value !== (value?.length < this.maxLength)
  }
}

export default MaxLength