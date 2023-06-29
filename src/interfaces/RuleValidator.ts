import RuleValidatorContext from "../validation/RuleValidatorContext"

interface RuleValidator {
  context: RuleValidatorContext
  message(): string
  isValid(): boolean | Promise<boolean>
}

export default RuleValidator