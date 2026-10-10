import NextLink from "next/link"

import { Empty, EmptyActions, EmptyDescription } from "@/registry/0nlytype/ui/empty"
import { Button } from "@/registry/0nlytype/ui/button"

export default function NotFound() {
  return (
    <main id="content" className="page" style={{ paddingTop: "calc(var(--bar) + var(--ot-space-9))" }}>
      <div className="stave">
        <Empty>
          <h1 className="doc-title">Nothing here.</h1>
          <EmptyDescription>This page doesn&apos;t exist, or it moved. The index lists every item.</EmptyDescription>
          <EmptyActions>
            <Button variant="statement" asChild><NextLink href="/docs/">Open the index</NextLink></Button>
          </EmptyActions>
        </Empty>
      </div>
    </main>
  )
}
