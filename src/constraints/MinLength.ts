import ConstraintValidator from "../interfaces/ConstraintValidator";
import ConstraintValidatorContext from "../validation/ConstraintValidatorContext";

class MinLength implements ConstraintValidator {
  public context: ConstraintValidatorContext

  private minLength: string

  constructor(minLength: string) {
    this.minLength = minLength
  }

  public message(): string {
    return `Min :attribute character length is :arg1`
  }
  
  public isValid(): boolean | Promise<boolean> {
    return this.context.getValue().length >= this.minLength
  }
}

export default MinLength