import { defineComponent } from "./types"

export default defineComponent({
  name: "data-table",
  title: "Data table",
  movement: "X",
  contract: "ot-data-table",
  summary: "Records you narrow with a sentence, sort by pressing a heading (the column turns ink and the rows glide), and page at a folio, or read on as the table ends in the rest of itself.",
  underneath: "native",
  props: [
    { name: "data / columns", type: "T[] / DataTableColumn<T>[]", description: "The records, and the columns: id, header, value (what it sorts by and shows), and optionally cell (how it shows), numeric (right-aligned figures, largest first on the first press), primary (the row's name) and sortable (false to leave a heading unpressable)." },
    { name: "caption", type: "string", description: "Names the table for screen readers." },
    { name: "noun", type: "string", default: '"rows"', description: "What the rows are, in the plural. It ends the filter's sentence (Show all projects) and the count (1 to 8 of 24 projects)." },
    { name: "filters", type: "{ id; label; test }[]", description: "Ways to narrow the rows, offered as the chosen word of a sentence: Show [identity] projects. The label is lower case to sit in the sentence. all always comes first. Narrowing goes back to the first page, and the rows that stay glide to their new places." },
    { name: "filter / defaultFilter / onFilterChange", type: "string", default: '"all"', description: "The filter, controlled or not." },
    { name: "defaultSort", type: "{ id: string; dir: 1 | -1 }", description: "The column the rows start sorted by. Pressing a heading sorts by it; pressing again turns the order round." },
    { name: "variant", type: '"folio" | "tail"', default: '"folio"', description: "folio: a page at a time, the book's folio (the page over the total) at the end of the foot line, the count at its start. tail: the table ends in the rest of itself, as a collapsible does; \"and 16 more\" is the control, and the next rows arrive in turn under the last; once all are shown it says Show fewer." },
    { name: "page / defaultPage / onPageChange", type: "number", default: "1", description: "The page, controlled or not. In a tail, how many pages are shown." },
    { name: "pageSize", type: "number", default: "8", description: "Rows to a page." },
    { name: "pageHref", type: "(page: number) => string", default: "?page=n", description: "Where a page link goes when opened in a new tab. A plain press turns the page in place and keeps focus in the pager." },
    { name: "getRowId", type: "(row, index) => string", default: "the index", description: "A stable name for each row, so it keeps its place and glides through sorting and filtering." },
    { name: "tableVariant", type: '"ink" | "forte"', default: '"ink"', description: "The table's own setting. forte sets the sorted column loud, and the loudness passes as you re-sort." },
  ],
})
