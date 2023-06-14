import { RuleValidator } from "../types/ValidatorType";
import ValidationRule from "./ValidationRule";

interface ValidatorAwareRule {
  validator: RuleValidator<ValidationRule>
  setValidator(validators: RuleValidator<ValidationRule>): void
}

export default ValidatorAwareRule