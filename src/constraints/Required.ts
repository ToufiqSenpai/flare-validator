import ConstraintValidator from "../interfaces/ConstraintValidator";
import ConstraintValidatorContext from "../validation/ConstraintValidatorContext";

class Required implements ConstraintValidator {
  context: ConstraintValidatorContext

  public message(): string {
    return `Attribute ${this.context.getAttribute()} is required.`
  }
  
  public isValid(): boolean | Promise<boolean> {
    return Boolean(this.context.getValue())
  }
}

export default Required