import { Pick, Picks } from "@/registry/0db/ui/picks"

export default function Example() {
  return (
    <Picks legend="Pair" defaultValue="press" className="max-w-[28rem]">
      <Pick value="parma">
        <span className="db-mp">Parma</span>
        <span className="db-p block text-[var(--db-pencil)]">The house pair. Sharp and bright.</span>
      </Pick>
      <Pick value="press">
        <span className="db-mp">Press</span>
        <span className="db-p block text-[var(--db-pencil)]">Plain, warm, unhurried.</span>
      </Pick>
      <Pick value="paris">
        <span className="db-mp">Paris</span>
        <span className="db-p block text-[var(--db-pencil)]">A narrow modern voice answered in the oldest italic here.</span>
      </Pick>
    </Picks>
  )
}
