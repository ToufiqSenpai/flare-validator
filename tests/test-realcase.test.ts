import Validator from "../src/validation/Validator"
import { person } from "./utils/data"

describe('Test register user validation', () => {
  test('failed validation', async () => {
    const data = {
      name: '',
      email: '',
      password: 'fwewwrgggwegwrherherbebhebrber'
    }

    const validatorViolation = await Validator.validate({}, {
      name: 'required',
      email: 'required',
      password: 'required|min_length:6|max_length:20'
    }, {}, {
      name: 'Name',
      email: 'Email',
      password: 'Password'
    })
    
    expect(Object.keys(validatorViolation.getMessageList()).length).toBeGreaterThan(0)
  })

  test('success validation', async () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'example'
    }

    const violation = await Validator.validate(data, {
      name: 'required',
      email: 'required|email',
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
    const violationMessage = (await Validator.validate(person, rule)).getMessageList()

    expect(Object.keys(violationMessage).length).toBeFalsy()
  })

  test('failed validation', async () => {
    const violationMessage = (await Validator.validate({
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

    expect(Object.keys(violationMessage).length).toBeTruthy()
  })
})