import { defineComponent } from "./types"

export default defineComponent({
  name: "avatar",
  title: "Avatar",
  movement: "X",
  contract: "db-avatar",
  summary: "A person is a ring and their initial, in italic, since a name is theirs.",
  underneath: "native",
  props: [
    { name: "alt", type: "string", description: "The person's name. It names the avatar for assistive tech." },
    { name: "src", type: "string", description: "A photograph, set in greyscale. Without one, the initial shows." },
    { name: "fallback", type: "string", description: "What shows without an image. Defaults to the first letter of alt." },
    { name: "size", type: '"s" | "m" | "l"', default: '"m"', description: "Small, medium or large." },
    { name: "here", type: "boolean", default: "false", description: "The accent dot: this person is here now." },
    { name: "count", type: "boolean", default: "false", description: "The overflow count at the end of a group, such as +3, set in the voice." },
    { name: "AvatarGroup", type: "span props", description: "Overlaps its avatars; they step apart when pointed at. Give it an aria-label naming the group." },
  ],
})
