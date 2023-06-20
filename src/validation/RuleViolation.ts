class RuleViolation {
  private violationMessages: Record<string, string[]>

  constructor(violationMessages: Record<string, string[]>) {
    this.violationMessages = violationMessages
  }

  public isValid(): boolean {
    return Object.keys(this.violationMessages).length == 0
  }

  public getListMessages(): Record<string, string[]> {
    return this.violationMessages
  }

  public getMessages(): Record<string, string> {
    const newMessages = {}

    for(const attribute in this.violationMessages) {
      newMessages[attribute] = this.violationMessages[attribute].shift()
    }

    return newMessages
  }
}

export default RuleViolation