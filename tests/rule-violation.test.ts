import RuleViolation from "../src/validation/RuleViolation";

const ruleViolation = new RuleViolation({
  firstName: [
    'Attribute First Name is required.'
  ],
  lastName: [
    'Attribute Last Name is required.'
  ],
  'address.city': [
    'Attribute City is required.'
  ],
  'address.country': [
    'Attribute Country is required.'
  ],
  'books.0.name': [
    'Attribute books.0.name is required.'
  ],
  'books.1.name': [
    'Attribute books.1.name is required.'
  ]
})

test('getMessages method', () => {
  const messages = ruleViolation.getMessages()
  expect(messages.firstName).toEqual('Attribute First Name is required.')
})

describe('test isValid method', () => { 
  it('should return false', () => {
    expect(ruleViolation.isValid()).toBeFalsy()
  })
})