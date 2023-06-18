import ConstraintValidatorContext from "../validation/ConstraintValidatorContext"

interface ConstraintValidator {
  message: string
  isValid(context: ConstraintValidatorContext): boolean | Promise<boolean>
}

export default ConstraintValidator