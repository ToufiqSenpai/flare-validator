class ValidatorException extends Error {
  public constructor(message: string) {
    super(message)

    super.name = 'ValidatorException'
  }
}

export default ValidatorException