import ConstraintValidatorContext from "../src/validation/RuleValidatorContext";
import { person } from "./utils/data";

const constraintValidatorContext = new ConstraintValidatorContext(person, 'John Doe', 'City')

test('getAttribute method', () => {
  expect(constraintValidatorContext.getAttribute()).toEqual('City')
})

test('getValue method', () => {
  expect(constraintValidatorContext.getValue()).toEqual('John Doe')
})

describe('test getData method', () => {
  it('should return data', () => {
    expect(constraintValidatorContext.getData('address.city')).toEqual('Manhattan')
    expect(constraintValidatorContext.getData('books.*.name')).toEqual(['Atomic', 'Kitsune'])
    expect(constraintValidatorContext.getData('books.0.name')).toEqual('Atomic')
  })

  it('should return undefined', () => {
    expect(constraintValidatorContext.getData('address.province')).toBeFalsy()
  })
})