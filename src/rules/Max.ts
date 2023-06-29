import RuleValidator from "../interfaces/RuleValidator";
import RuleValidatorContext from "../validation/RuleValidatorContext";

class Max implements RuleValidator {
  public context: RuleValidatorContext

  private max: string

  constructor(max: string) {
    this.max = max
  }

  public message(): string {
    return `Max :attribute value is :arg1`
  }
  
  public isValid(): boolean | Promise<boolean> {
    return this.context.getValue() >= this.max
  }
}

export default Max