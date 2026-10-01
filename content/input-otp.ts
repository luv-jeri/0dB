import { defineComponent } from "./types"

export default defineComponent({
  name: "input-otp",
  title: "Input OTP",
  movement: "VI",
  contract: "db-code",
  summary: "A one-time code on short baselines, three and three. Digits drop in as you type; whole, the lines ink in turn. Or the code closes up into one figure, or is read back in words under its digits.",
  underneath: "hook",
  props: [
    { name: "variant", type: '"line" | "close-up" | "lyric"', default: '"line"', description: "How the code waits and ends. line: short baselines, three and three; whole, they ink in turn. close-up: a dot waits for each digit, the next in the accent; whole, the spaces close into one tight figure and the proofreader's close-up mark lands over and under the join. lyric: each digit is read back in words under its line, as lyrics sit under their notes, with a comma at the halfway breath and a full stop at the end, so the code can be checked aloud." },
    { name: "length", type: "number", default: "6", description: "How many digits." },
    { name: "group", type: "number", description: "A separator stands after every this many slots. Three and three for six." },
    { name: "value / defaultValue / onValueChange", type: "string", description: "The digits typed so far. Anything that isn't a digit is dropped." },
    { name: "onComplete", type: "(value: string) => void", description: "Called once, when the last slot fills." },
    { name: "aria-invalid", type: "boolean", description: "Whole and wrong, the lines turn crimson together. Inside a Field with an error this is set for you." },
  ],
})
