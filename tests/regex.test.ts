test('replace number between dot symbol to asterisk symbol', () => {
  const string = ".5. Hello .8. World .2.";
  const replacedString = string.replace(/\.\d+\./g, ".*.");

  expect(replacedString).toEqual(".*. Hello .*. World .*.")
})

test('replace asterisk to number regex', () => {
  function createRegex(str: string) {
    const escapedStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexStr = escapedStr.replace(/\\\*/g, '\\d+') + '$';
    return new RegExp(regexStr);
  }
  
  const regex1 = createRegex("address.city");
  expect(regex1.test('address.city')).toBeTruthy() // Output true
})