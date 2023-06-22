import Validator from "../src/validation/Validator"

describe('Test register user validation', () => {
  test('failed validation', async () => {
    const data = {
      name: '',
      email: '',
      password: 'fwewwrgggwegwrherherbebhebrber'
    }
    const validator = Validator.make(data, {
      name: 'required',
      email: 'required',
      password: 'required|min_length:6|max_length:20'
    }, {}, {
      name: 'Name',
      email: 'Email',
      password: 'Password'
    })
    
    expect(Object.keys((await validator.validate()).getMessageList()).length).toBeGreaterThan(0)
  })

  test('success validation', async () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'example'
    }
    const validator = Validator.make(data, {
      name: 'required',
      email: 'required',
      password: 'required|min_length:6|max_length:20'
    }, {}, {
      name: 'Name',
      email: 'Email',
      password: 'Password'
    })
    
    expect(Object.keys((await validator.validate()).getMessageList()).length).toEqual(0)
  })
})