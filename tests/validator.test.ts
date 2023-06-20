import Required from "../src/constraints/Required"
import Validator from "../src/validation/Validator"
import { person } from "./utils/data"

const validatorAttributes = {
  firstName: 'First Name',
  lastName: 'Last Name',
  'address.city': 'City',
  'address.country': 'Country',
  'books.*.name': 'Book Name',
  'books.*.author': 'Book Author'
}

describe('test validate method', () => {
  test('call method', () => {
    // validator.validate()
  })
})

describe('test parseData method', () => {
  const validator = new Validator({
    data: person,
    rules: {
      firstName: 'required'
    }
  })
  
  test('flatten object and array with data person', () => {
    const flattenPerson = {
      firstName: "John",
      lastName: "Doe",
      'address.city': "Manhattan",
      'address.country': "USA",
      'books.0.name': "Atomic",
      'books.0.author': "Mei",
      'books.1.name': "Kistune",
      'books.1.author': "Yae",
    }
    const flattenObjectValidator = validator['parseData'](person)

    expect(Object.keys(flattenObjectValidator)).toEqual(Object.keys(flattenPerson))
  })

  test('flatten object and array with random data', () => {
    const obj = {
      a: {
        b: [
          { c: 1 },
          { d: 2 },
          { e: 3 }
        ],
        f: {
          g: [
            { h: 4 },
            { i: 5 }
          ]
        }
      },
      j: [6, 7, 8],
      k: 9
    }
    const flattenObj = {
      "a.b.0.c": 1,
      "a.b.1.d": 2,
      "a.b.2.e": 3,
      "a.f.g.0.h": 4,
      "a.f.g.1.i": 5,
      "j.0": 6,
      "j.1": 7,
      "j.2": 8,
      "k": 9
    }
    const flattenObjectValidator = validator['parseData'](obj)

    expect(Object.keys(flattenObjectValidator)).toEqual(Object.keys(flattenObj))
  })
})

describe('test validateValue method', () =>  {
  const validator = new Validator({
    data: person,
    rules: {
      firstName: 'required'
    },
    attributes: validatorAttributes,
    constraints: {
      required: Required
    }
  })

  it('should return 0 messages (success)', async() => {
    const validateValue = await validator['validateValue']('Manhattan', 'address.city', ['required'])
    expect(validateValue.length).toEqual(0)
  })

  it('should return messages (failed)', async() => {
    const validateValue = await validator['validateValue']('address.city', null, ['required'])
    expect(validateValue.length).toBeGreaterThan(0)
  })

  it('throw TypeError when constraint is not registered', () => {
    expect(async () => await validator['validateValue']('Manhattan', 'address.city', ['asd'])).rejects.toThrow(TypeError)
    expect(async () => await validator['validateValue']('Manhattan', 'address.city', ['asd'])).rejects.toThrow('Constraint asd is not registered.')
  })
})

describe('test messagePlaceholderReplacer method', () => {
  const validator = new Validator({
    data: person,
    rules: {
      firstName: 'required'
    }
  })

  test('replace string', () => {
    const args = ['foo', 'bar', 'baz']
    expect(validator['messagePlaceholderReplacer'](
      ':attribute :value :arg1 :arg2 :arg3',
      'City',
      'Manhattan',
      args
      )).toEqual('City Manhattan foo bar baz')
  })
})