import { RadarChart } from "@/registry/0db/ui/radar-chart"
import { State } from "@/components/site/state"

// A typeface judged out of ten on six counts.
const archivo = [
  { label: "Legibility", value: 9 },
  { label: "Width range", value: 10 },
  { label: "Weights", value: 9 },
  { label: "Figures", value: 7 },
  { label: "Languages", value: 8 },
  { label: "Warmth", value: 4 },
]

// Three faces on the same six counts.
const faces = archivo.map((d, i) => ({ label: d.label, archivo: d.value, bodoni: [6, 3, 5, 8, 7, 9][i], garamond: [8, 2, 4, 6, 9, 8][i] }))
const three = [
  { key: "archivo", label: "Archivo" },
  { key: "bodoni", label: "Bodoni Moda" },
  { key: "garamond", label: "EB Garamond" },
]

export default function Example() {
  return (
    <div className="flex flex-wrap items-start gap-x-24 gap-y-16">
      <RadarChart data={archivo} max={10} label="Archivo, out of ten on six counts" />
      <RadarChart data={faces} series={three.slice(0, 2)} max={10} label="Archivo and Bodoni Moda, out of ten" />
    </div>
  )
}

export function States() {
  const five = archivo.slice(0, 5)
  return (
    <>
      <State label="Rest"><RadarChart data={five} max={10} label="Archivo, out of ten" className="w-80" /></State>
      <State label="Pointed at"><RadarChart data={five} max={10} now={1} label="Archivo, out of ten" className="w-80" data-force="hover" /></State>
      <State label="three series, pointed at"><RadarChart data={faces.slice(0, 5)} series={three} max={10} now={3} label="Three faces, out of ten" className="w-80" data-force="hover" /></State>
      <State label="Right to left"><RadarChart dir="rtl" data={five} max={10} now={1} label="Archivo, out of ten" className="w-80" data-force="hover" /></State>
      <State label="Too few axes"><RadarChart data={five.slice(0, 2)} max={10} label="Archivo, out of ten" className="w-80" /></State>
    </>
  )
}
