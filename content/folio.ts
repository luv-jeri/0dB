import { defineComponent } from "./types"

export default defineComponent({
  name: "folio",
  title: "Folio",
  movement: "VIII",
  contract: "db-folio",
  summary: "A project spread: the work at reading size, its maker's part in the margin, its title opening from the plate's edge.",
  underneath: "hook",
  props: [
    { name: "variant", type: '"plate" | "type" | "live"', default: '"plate"', description: "Plate holds an image or Halftone. Type holds the project's name, with no media. Live holds working 0dB components. Parts stack in a narrow container." },
    { name: "FolioTitle.children", type: "string", description: "The project and its meaning. Pretext measures the heading into lines; each opens once when the plate enters. The real title is always readable to assistive technology." },
    { name: "FolioLedger.rows", type: "{ label: string; value: ReactNode }[]", description: "The imprint at inline-start: labels in roman, personal values in italic. For example, My part / Product engineering." },
    { name: "FolioPlate.children", type: "ReactNode", description: "Evidence at inline-end. In type, pass the project name as text; in live, pass working components." },
  ],
})
