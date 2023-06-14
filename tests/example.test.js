function flattenObject(obj, prefix = '') {
  const flattened = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const nestedKeys = flattenObject(obj[key], `${prefix}${key}.`);
        Object.assign(flattened, nestedKeys);
      } else {
        flattened[`${prefix}${key}`] = obj[key];
      }
    }
  }

  return flattened;
}

test('test flat object', () => {
  const person = {
    name: 'John Doe',
    age: 25,
    address: {
      city: 'manhattan',
      country: 'USA'
    }
  }
  const flatPerson = {
    name: 'John Doe',
    age: 25,
    'address.city': 'manhattan',
    'address.country': 'USA'
  }
  console.log(flattenObject(person))
  expect(Object.keys(flattenObject(person))).toEqual(Object.keys(flatPerson))
})