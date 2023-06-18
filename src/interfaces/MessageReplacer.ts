import MessageReplacerContext from "../validation/MessageReplacerContext";

interface MessageReplacer {
  replace(context: MessageReplacerContext): string | Promise<string>
}

export default MessageReplacer