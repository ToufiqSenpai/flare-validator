test('replace number between dot symbol to asterisk symbol', () => {
  const string = ".5. Hello .8. World .2.";
  const replacedString = string.replace(/\.\d+\./g, ".*.");

  expect(replacedString).toEqual(".*. Hello .*. World .*.")
})

test('test asterisk wildcard is match to number regex', () => {
  function createRegex(str: string) {
    const escapedStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexStr = escapedStr.replace(/\\\*/g, '\\d+') + '$';
    return new RegExp(regexStr);
  }
  
  const regex1 = createRegex("address");
  expect(regex1.test('address')).toBeTruthy() // Output true
})

test('test number path is match to asterisk wildcard', () => {
  const regex = /\.\d+\.|\.\\*\./g.test('example.1.example.*.example');
  expect(regex).toBeTruthy()

  const str = 'example.1.example.*.example';
  const regexStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\.(\d+)\./g, '\\.\\d+\\.');
  const regex2 = new RegExp(regexStr);
  const testStr = 'example.1.example.*.example';

  console.log(regexStr)

  expect(regex2.test(testStr)).toBeTruthy()
})


test('test with chatgpt', () => {
  const str = 'example.1.example.*.example';
  const regexStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\.(\d+)\./g, '\\.\\d+\\.');
  console.log(regexStr); // Output: "example\\.\\d+\\.example\\.*\\.example"
})