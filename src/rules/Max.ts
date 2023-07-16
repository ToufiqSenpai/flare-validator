import RuleValidator from "../interfaces/RuleValidator";
import RuleValidatorContext from "../validation/RuleValidatorContext";

class Max implements RuleValidator {
  public context: RuleValidatorContext

  private max: number

  constructor(max: string) {
    this.max = Number.parseInt(max)
  }

  public message(): string {
    return `Max :attribute value is :arg1`
  }
  
  public isValid(): boolean | Promise<boolean> {
    const value = this.context.getValue()
    return typeof value == 'number' && value <= this.max
  }
}

export default Max