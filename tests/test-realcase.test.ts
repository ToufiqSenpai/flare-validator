import Validator from "../src/validation/Validator"
import { person } from "./utils/data"

describe('Test register user validation', () => {
  test('failed validation', async () => {
    const data = {
      name: '',
      email: '',
      password: 'fwewwrgggwegwrherherbebhebrber'
    }
    const validator = Validator.getValidator()

    const validatorViolation = await validator.validate(data, {
      name: 'required',
      email: 'required',
      password: 'required|min_length:6|max_length:20'
    }, {}, {
      name: 'Name',
      email: 'Email',
      password: 'Password'
    })
    console.log(validatorViolation.getMessageList())
    
    expect(Object.keys(validatorViolation.getMessageList()).length).toBeGreaterThan(0)
  })

  test('success validation', async () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'example'
    }
    const validator = Validator.getValidator()
    const violation = await validator.validate(data, {
      name: 'required',
      email: 'required',
      password: 'required|min_length:6|max_length:20'
    }, {}, {
      name: 'Name',
      email: 'Email',
      password: 'Password'
    })
    
    expect(Object.keys(violation.getMessageList()).length).toBeFalsy()
  })
})

describe('test person validation', () => {
  const rule =  {
    firstName: 'required|min_length:1|max_length:155',
    lastName: 'required|min_length:1|max_length:155',
    'address.city': 'required|min_length:1|max_length:155',
    'address.country': 'required|min_length:1|max_length:155',
    'books.*.name': 'required|min_length:1|max_length:155',
    'books.*.author': 'required|min_length:1|max_length:155'
  }

  test('success validation', async () => {
    const validator = Validator.getValidator()
    const violationMessage = (await validator.validate(person, rule)).getMessageList()

    expect(Object.keys(violationMessage).length).toBeFalsy()
  })

  test('failed validation', async () => {
    const validator = Validator.getValidator()
    const violationMessage = (await validator.validate({
      firstName: '',
      lastName: '',
      address: {
        city: '',
        country: ''
      },
      books: [
        {
          name: '',
          author: ''
        },
        {
          name: '',
          author: ''
        }
      ]
    }, rule, {
      'required': 'Attribute :attribute harus diisi'
    }, {
      firstName: 'First Name',
      lastName: 'Last Name',
      'address.city': 'City',
      'address.country': 'Country',
      'books.*.name': 'Book Name',
      'books.*.author': 'Book Author'
    })).getMessageList()
    console.log(violationMessage)

    expect(Object.keys(violationMessage).length).toBeTruthy()
  })
})