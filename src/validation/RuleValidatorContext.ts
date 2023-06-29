import getObjectByPath from "../utils/getObjectByPath"

class RuleValidatorContext {
  private data: any

  private value: any

  private attribute: string

  constructor(data: any, value: any, attribute: string) {
    this.data = data
    this.value = value
    this.attribute = attribute 
  }

  /**
   * Return the data attribute.
   * If custom attribute for the data attribute is undefined, it will return path attribute.
   * 
   * @returns {string}
   */
  public getAttribute(): string {
    return this.attribute
  }

  /**
   * Return data being validated
   * 
   * @param path 
   * @returns 
   */
  public getData(path: string = ''): any {
    return getObjectByPath(this.data, path)
  }

  /**
   * Return value being validated
   * 
   * @returns 
   */
  public getValue(): any {
    return this.value
  }
}

export default RuleValidatorContext