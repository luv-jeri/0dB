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
    { name: "Message variant", type: '"default" | "script" | "quote"', default: '"default"', description: "script: a play text. No face and no tail; the name stands in capitals in the margin with the time after it in parentheses, the words in one column for everyone, and only the type says who is speaking (theirs roman, yours italic). Narrow, the name runs in above the words. quote: no face and no tail; a large italic quotation mark opens theirs at the top of the start, and closes yours at the foot of the end." },
    { name: "Message arriving", type: "boolean", default: "false", description: "Writes the body in from the left when it mounts." },
    { name: "MessageAvatar", type: "Avatar props", description: "The face beside the message. It is a direct child of Message, aria-hidden since the header names the person." },
    { name: "MessageHeader name, time, dateTime", type: "ReactNode, ReactNode, string", description: "The name in weight, the time in pencil. dateTime is the machine-readable time." },
    { name: "MessageBody", type: "div props", description: "Holds one or more bubbles or plain paragraphs." },
    { name: "MessageBubble align", type: '"start" | "end"', default: '"start"', description: "Which side the tail leans to. Use end for what you wrote." },
    { name: "MessageBubble variant", type: '"default" | "ink" | "mark"', default: '"default"', description: "Ink is reversed type in a block, the tail beneath. Mark is a highlighter behind the words." },
    { name: "MessageTyping writing", type: "boolean", description: "The other side is writing. True shows the tail and three periods in pencil where their words will be, breathing in turn as a busy button's dots do; false leaves an empty, silent status that takes no room. Keep it mounted and drive writing from the real typing state, so a screen reader hears it start. Put it after the last message on its own, or give it their face: a Message holding only a MessageAvatar and a MessageBody with the typing in place of a bubble, which folds away with it while nobody writes. When their message arrives, set writing to false and add the new Message, arriving, before it." },
    { name: "MessageTyping label, align", type: 'string, "start" | "end"', default: '"Writing", "start"', description: "label is what a screen reader hears while it shows (\"Ada is writing\", \"Thinking\"). align leans the tail as a bubble's does." },
    { name: "MessageFooter", type: "footer props", description: "Holds the status or the reactions." },
    { name: "MessageStatus read", type: "boolean", default: "false", description: "Sent is a ring; read, it fills to a dot. Children replace the word." },
    { name: "MessageReactions", type: "span props", description: "A group of reactions. Its aria-label defaults to Reactions." },
    { name: "MessageReaction defaultPressed, defaultCount", type: "boolean, number", default: "false, 0", description: "A pressable tag with aria-pressed and a count. Pressed, its label turns italic and the count rolls." },
    { name: "MessageReaction onPressedChange", type: "(pressed, count) => void", description: "Called after each press with the new state." },
  ],
})
