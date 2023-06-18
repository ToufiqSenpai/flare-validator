class ConstraintValidatorContext {
  private data: Record<string | number, any>

  private keyPath: string

  constructor(data: Record<string | number, any>, keyPath: string) {
    this.data = data
    this.keyPath = keyPath
  }

  public getAttribute(): string {
    return this.keyPath.split('.').pop()
  }

  public getKeyPath(): string {
    return this.keyPath
  }

  public getData(): any {
    return this.data
  }
}

export default ConstraintValidatorContext