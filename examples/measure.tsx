import { Measure } from "@/registry/0nlytype/ui/measure"
import { State } from "@/components/site/state"

const text =
  "A line is a breath. Set it too short and the reader is thrown back to the margin before the thought has landed; set it too long and the eye finishes one line without knowing where the next begins. Somewhere between the two, a sentence sits down and is read without anyone noticing that it was set."

/** The track; a ruler of alphabets; and columns, which narrowing the line multiplies. */
export default function Example() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-y-(--ot-space-8)">
      <Measure>{text}</Measure>
      <Measure variant="alphabets" defaultMeasure={56}>{text}</Measure>
      <Measure variant="columns" defaultMeasure={34}>{text}</Measure>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Too short"><Measure className="w-[44rem] max-w-full" defaultMeasure={32}>{text}</Measure></State>
      <State label="Comfortable"><Measure className="w-[44rem] max-w-full" defaultMeasure={62}>{text}</Measure></State>
      <State label="Too long"><Measure className="w-[44rem] max-w-full" defaultMeasure={96}>{text}</Measure></State>
      <State label="Alphabets, short"><Measure variant="alphabets" className="w-[44rem] max-w-full" defaultMeasure={30}>{text}</Measure></State>
      <State label="Alphabets, long"><Measure variant="alphabets" className="w-[44rem] max-w-full" defaultMeasure={92}>{text}</Measure></State>
      <State label="Columns, one"><Measure variant="columns" className="w-[44rem] max-w-full" defaultMeasure={66}>{text}</Measure></State>
      <State label="Columns, three"><Measure variant="columns" className="w-[44rem] max-w-full" defaultMeasure={24}>{text}</Measure></State>
      <State label="Columns, right to left">
        <Measure variant="columns" dir="rtl" lang="ar" className="w-[44rem] max-w-full" defaultMeasure={30}>
          {"السطر نَفَس. إن جعلته قصيراً جداً رُدّ القارئ إلى الهامش قبل أن تستقر الفكرة، وإن جعلته طويلاً جداً أنهت العين سطراً دون أن تعرف أين يبدأ التالي. وبين الاثنين تجلس الجملة وتُقرأ دون أن يلاحظ أحد أنها صُفّت."}
        </Measure>
      </State>
    </>
  )
}
