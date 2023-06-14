interface ValidationRule {
  logic(attribute: string, value: any): Promise<null | string>
}

export default ValidationRule