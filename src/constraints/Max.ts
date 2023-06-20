import ConstraintValidator from "../interfaces/ConstraintValidator";
import ConstraintValidatorContext from "../validation/ConstraintValidatorContext";

class Max implements ConstraintValidator {
  public context: ConstraintValidatorContext

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