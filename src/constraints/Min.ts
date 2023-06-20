import ConstraintValidator from "../interfaces/ConstraintValidator";
import ConstraintValidatorContext from "../validation/ConstraintValidatorContext";

class Min implements ConstraintValidator {
  public context: ConstraintValidatorContext

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