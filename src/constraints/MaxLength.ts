import ConstraintValidator from "../interfaces/ConstraintValidator";
import ConstraintValidatorContext from "../validation/ConstraintValidatorContext";

class MaxLength implements ConstraintValidator {
  public context: ConstraintValidatorContext

  private maxLength: string

  constructor(maxLength: string) {
    this.maxLength = maxLength
  }

  public message(): string {
    return `Max :attribute character length is :arg1`
  }
  
  public isValid(): boolean | Promise<boolean> {
    return this.context.getValue().length <= this.maxLength
  }
}

export default MaxLength