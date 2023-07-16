import RuleValidator from "../interfaces/RuleValidator";
import RuleValidatorContext from "../validation/RuleValidatorContext";

class In implements RuleValidator {
  public context: RuleValidatorContext

  private args: string[]

  public constructor(...args: string[]) {
    this.args = args
  }

  public message(): string {
    return `Value must be ${this.args.join(',')}.`
  }

  public isValid(): boolean | Promise<boolean> {
    return this.args.includes(this.context.getValue())
  }
}

export default In