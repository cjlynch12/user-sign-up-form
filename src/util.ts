const isPresent = (input: string, char: string) => input.indexOf(char) != -1
const isNotFirst = (input: string, char: string) => input.indexOf(char) != 0
const isAfter = (input: string, char1: string, char2: string) => input.indexOf(char1) > input.indexOf(char2)

/*
  Assumptions:
  1. Must contain a TLD (.com, .ai, .org, etc)
  2. Must contain an '@' symbol
  3. Must contain more than just a '.' and an '@' ('a@a.a' might be valid)
  4. Neither '@' or '.' can be the first character
  5. Must not contain spaces

  Note: this could also be done using Regex
*/
export const validateEmail = (input: string) => {
  const validAtSym = isPresent(input, '@') && isNotFirst(input, '@')
  const validDotSym = isPresent(input, '.') && isNotFirst(input, '.')
  const doesNotContainSpace = input.indexOf(" ") === -1
  const dotSymIsNotLastChar = input.indexOf(".") !== input.length - 1
  const dotSymIsAfterAtSym = isAfter(input, '.', '@')
  return !!input && validAtSym && validDotSym && doesNotContainSpace && dotSymIsNotLastChar && dotSymIsAfterAtSym && input.length > 2
}