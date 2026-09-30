import { defineComponent } from "./types"

export default defineComponent({
  name: "input-otp",
  title: "Input OTP",
  movement: "VI",
  contract: "db-code",
  summary: "A one-time code on short baselines, three and three. Digits drop in as you type; whole, the lines ink in turn.",
  underneath: "hook",
  props: [
    { name: "length", type: "number", default: "6", description: "How many digits." },
    { name: "group", type: "number", description: "A separator stands after every this many slots. Three and three for six." },
    { name: "value / defaultValue / onValueChange", type: "string", description: "The digits typed so far. Anything that isn't a digit is dropped." },
    { name: "onComplete", type: "(value: string) => void", description: "Called once, when the last slot fills." },
    { name: "aria-invalid", type: "boolean", description: "Whole and wrong, the lines turn crimson together. Inside a Field with an error this is set for you." },
  ],
})
