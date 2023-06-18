import ConstraintValidator from "../../interfaces/ConstraintValidator";
import ConstraintValidatorContext from "../../validation/ConstraintValidatorContext";

class Required implements ConstraintValidator {
  public message: string;
  
  public isValid(context: ConstraintValidatorContext): boolean | Promise<boolean> {
    return Boolean(context.getValue())
  }
}

export default Required