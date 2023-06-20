import Validator from "../src/validation/Validator"

describe('Test register user validation', () => {
  test('failed validation', async () => {
    const data = {
      name: '',
      email: '',
      // password: 'fwewwrgggwegwrherherbebhebrber'
    }
    const validator = Validator.make(data, {
      name: 'required',
      email: 'required',
      password: 'required|min_length:6|max_length:20'
    })
    console.log((await validator.validate()).getListMessages())
  })
})