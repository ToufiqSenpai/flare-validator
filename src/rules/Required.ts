import RuleValidator from "../interfaces/RuleValidator";
import RuleValidatorContext from "../validation/RuleValidatorContext";

class Required implements RuleValidator {
  context: RuleValidatorContext

  public message(): string {
    return `Attribute ${this.context.getAttribute()} is required.`
  }
  
  public isValid(): boolean | Promise<boolean> {
    return Boolean(this.context.getValue())
  }
}

export default Required