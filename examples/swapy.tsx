"use client"

import * as React from "react"

import { State } from "@/components/site/state"
import { Swapy, type SwapyItem } from "@/registry/0db/ui/swapy"

const issue: SwapyItem[] = [
  { id: "letter", label: "Editor’s letter", kind: "Opening", meta: "2 pp" },
  { id: "halden", label: "Halden", kind: "Identity", meta: "8 pp" },
  { id: "tidewater", label: "Tidewater", kind: "Motion", meta: "6 pp" },
  { id: "marram", label: "Marram", kind: "Web", meta: "4 pp" },
  { id: "colophon", label: "Colophon", kind: "Closing", meta: "1 p" },
]

const set: SwapyItem[] = [
  { id: "a", label: "Slow harbour", meta: "4:12" },
  { id: "b", label: "Northlight", meta: "3:40" },
  { id: "c", label: "Tacet", meta: "0:58" },
  { id: "d", label: "Oda", meta: "5:06" },
]

const rtl: SwapyItem[] = [
  { id: "a", label: "رسالة المحرر", meta: "2" },
  { id: "b", label: "هالدن", meta: "8" },
  { id: "c", label: "الخاتمة", meta: "1" },
]

export default function Example() {
  const [order, setOrder] = React.useState(issue.map((i) => i.id))
  const names = order.map((id) => issue.find((i) => i.id === id)?.label)
  return (
    <div className="grid w-full max-w-3xl" style={{ gap: "var(--db-space-8)" }}>
      <div className="grid" style={{ gap: "var(--db-space-4)" }}>
        <Swapy label="Running order" items={issue} order={order} onOrderChange={setOrder} />
        <p className="db-pp" style={{ color: "var(--db-graphite)" }}>
          Press <i>move</i> and use the arrow keys, or drag it. The issue opens with {names[0]} and closes with {names.at(-1)}.
        </p>
      </div>
      <div className="grid" style={{ gap: "var(--db-space-4)" }}>
        <span className="db-label">Transpose</span>
        <Swapy label="Set list" variant="transpose" items={set} />
      </div>
    </div>
  )
}

const w = "w-[34rem] max-w-full"

export function States() {
  return (
    <>
      <State label="Rest"><Swapy className={w} label="Rest" items={issue.slice(0, 3)} /></State>
      <State label="Pointed at"><Swapy className={w} label="Pointed at" items={issue.slice(0, 3)} data-force="hover" /></State>
      <State label="Held"><Swapy className={w} label="Held" items={issue.slice(0, 3)} defaultHeld="halden" /></State>
      <State label="Transpose, held"><Swapy className={w} label="Transpose, held" variant="transpose" items={set.slice(0, 3)} defaultHeld="b" /></State>
      <State label="Disabled"><Swapy className={w} label="Disabled" items={issue.slice(0, 3)} disabled /></State>
      <State label="Right to left, held">
        <div dir="rtl" lang="ar" className="max-w-full"><Swapy className={w} label="الترتيب" items={rtl} defaultHeld="b" /></div>
      </State>
    </>
  )
}
