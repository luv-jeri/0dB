import { defineComponent } from "./types"

export default defineComponent({
  name: "message",
  title: "Message",
  movement: "XI",
  contract: "db-msg",
  summary: "No balloons. Of the speech bubble only its tail is left, a leaning hairline. What they wrote is roman; what you wrote sits on the other side, in italic.",
  underneath: "native",
  uses: ["avatar", "badge"],
  props: [
    { name: "Message from", type: '"them" | "you"', default: '"them"', description: "Whose it is. Yours sits at the end of the row, in italic, with the time before the name." },
    { name: "Message arriving", type: "boolean", default: "false", description: "Writes the body in from the left when it mounts." },
    { name: "MessageAvatar", type: "Avatar props", description: "The face beside the message. It is a direct child of Message, aria-hidden since the header names the person." },
    { name: "MessageHeader name, time, dateTime", type: "ReactNode, ReactNode, string", description: "The name in weight, the time in pencil. dateTime is the machine-readable time." },
    { name: "MessageBody", type: "div props", description: "Holds one or more bubbles or plain paragraphs." },
    { name: "MessageBubble align", type: '"start" | "end"', default: '"start"', description: "Which side the tail leans to. Use end for what you wrote." },
    { name: "MessageBubble variant", type: '"default" | "ink" | "mark"', default: '"default"', description: "Ink is reversed type in a block, the tail beneath. Mark is a highlighter behind the words." },
    { name: "MessageFooter", type: "footer props", description: "Holds the status or the reactions." },
    { name: "MessageStatus read", type: "boolean", default: "false", description: "Sent is a ring; read, it fills to a dot. Children replace the word." },
    { name: "MessageReactions", type: "span props", description: "A group of reactions. Its aria-label defaults to Reactions." },
    { name: "MessageReaction defaultPressed, defaultCount", type: "boolean, number", default: "false, 0", description: "A pressable tag with aria-pressed and a count. Pressed, its label turns italic and the count rolls." },
    { name: "MessageReaction onPressedChange", type: "(pressed, count) => void", description: "Called after each press with the new state." },
  ],
})
