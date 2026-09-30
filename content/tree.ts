import { defineComponent } from "./types"

export default defineComponent({
  name: "tree",
  title: "Tree",
  movement: "X",
  contract: "db-tree",
  summary: "A hierarchy set as a contents page: names on hairline branches, each hanging from under its folder's first letter, a folder opened at a time.",
  underneath: "native",
  props: [
    { name: "nodes", type: "TreeNode[]", description: "The hierarchy. Each node has an id and a label; a node with children is a folder (an empty array is an empty folder), one without is a leaf. value is set at the end of its line after a dotted leader, as a contents page sets its folios. A leaf with an href is a link." },
    { name: "variant", type: '"branch" | "outline"', default: '"branch"', description: "branch: a hairline spine hangs from under each open folder's first letter, and every name sits on it at a dot; a closed folder is a ring, an open one a filled dot, the chosen leaf the accent. outline: a book's decimal contents, each name numbered by its place (1, 1.2, 1.2.3) in a pencil column, flush at every depth, with no lines." },
    { name: "selected / defaultSelected / onSelectedChange", type: "string | null", description: "The chosen leaf, controlled or not. Its dot (or number) takes the accent and its name turns italic; it carries aria-current." },
    { name: "expanded / defaultExpanded / onExpandedChange", type: "string[]", description: "The open folders' ids, controlled or not. A folder you open draws its branch down and its names arrive in turn; one open from the start is simply there." },
    { name: "limit", type: "number", default: "none", description: "A folder longer than this shows its first rows, then \"and 6 more\", which opens the rest where they are, as a collapsible does." },
  ],
})
