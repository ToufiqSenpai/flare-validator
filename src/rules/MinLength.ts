import RuleValidator from "../interfaces/RuleValidator";
import RuleValidatorContext from "../validation/RuleValidatorContext";

class MinLength implements RuleValidator {
  public context: RuleValidatorContext

  private minLength: string

  constructor(minLength: string) {
    this.minLength = minLength
  }

  public message(): string {
    return `Min :attribute character length is :arg1`
  }
  
  public isValid(): boolean | Promise<boolean> {
    return this.context.getValue()?.length >= this.minLength
  }
}

export default MinLength