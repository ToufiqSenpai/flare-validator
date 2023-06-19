test('replace number between dot symbol to asterisk symbol', () => {
  const string = ".5. Hello .8. World .2.";
  const replacedString = string.replace(/\.\d+\./g, ".*.");

  expect(replacedString).toEqual(".*. Hello .*. World .*.")
})