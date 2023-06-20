import ConstraintValidatorContext from "../validation/ConstraintValidatorContext"

interface ConstraintValidator {
  context: ConstraintValidatorContext
  message(): string
  isValid(): boolean | Promise<boolean>
}

export default ConstraintValidator