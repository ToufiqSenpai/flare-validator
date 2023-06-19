import getObjectByPath from "../utils/getObjectByPath"

class ConstraintValidatorContext {
  private data: Record<string | number, any>

  private value: any

  private attribute: string

  private rawAttribute: string

  constructor(data: Record<string | number, any>, value: any, attribute: string, rawAttribute: string) {
    this.data = data
    this.value = value
    this.attribute = attribute ? attribute : rawAttribute
    this.rawAttribute = rawAttribute
  }

  /**
   * Return the data attribute.
   * If custom attribute for the data attribute is undefined, it will return raw attribute.
   * 
   * @returns {string}
   */
  public getAttribute(): string {
    return this.attribute
  }

  /**
   * Return data raw attribute. Example "address.city"
   * 
   * @returns {string}
   */
  public getRawAttribute(): string {
    return this.rawAttribute
  }

  public getData(path: string = ''): any {
    return getObjectByPath(this.data, path)
  }

  public getValue(): any {
    return this.value
  }
}

export default ConstraintValidatorContext