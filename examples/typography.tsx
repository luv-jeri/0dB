import { Prose, ProseLead, type ProseProps } from "@/registry/0nlytype/ui/typography"
import { State } from "@/components/site/state"

function Passage({ variant }: { variant: ProseProps["variant"] }) {
  return (
    <Prose variant={variant}>
      <h3>On leaving space</h3>
      <p>
        A page is mostly paper. The type takes a small part of it, and the rest is the room the reader breathes in. Set
        the margins first, before a single word, and the words will know where to stand.
      </p>
      <p>
        The old compositors had a rule for it: indent or space, never both. An ordered page needs little else, only the
        steady measure of its lines and the space kept between them.
      </p>
      <p>What is left out is part of the design. It is the part the reader never notices, and the part they would miss.</p>
      <hr />
      <p>Two faces, one accent, and a great deal of paper: that is the whole of the system.</p>
    </Prose>
  )
}

export default function Example() {
  return (
    <div className="grid gap-y-16">
      <Swiss />
      {(["book", "run-on"] as const).map((v) => (
        <div key={v} className="grid gap-y-4">
          <span className="db-label">{v}</span>
          <Passage variant={v} />
        </div>
      ))}
    </div>
  )
}

export function States() {
  const short = (variant: ProseProps["variant"]) => (
    <Prose variant={variant} className="w-80">
      <p>A page is mostly paper, and the type takes a small part of it.</p>
      <p>Set the margins first, and the words will know where to stand.</p>
    </Prose>
  )
  return (
    <>
      <State label="swiss">{short("swiss")}</State>
      <State label="book">{short("book")}</State>
      <State label="run-on">{short("run-on")}</State>
    </>
  )
}

function Swiss() {
  return (
    <Prose>
      <h2>Why two faces are enough</h2>
      <ProseLead>Every extra typeface is another voice in the room. Two is a conversation.</ProseLead>
      <p>
        The grotesque carries everything the interface says: labels, buttons, the names of things. The italic serif carries
        everything you say back. Nothing else is needed to tell the two apart, and nothing else is added. In the stylesheet,
        the whole rule is one line: <code>.db-yours</code> sets the expression, in italic. Read <a href="#">the full contract</a>.
      </p>
      <blockquote>
        <p>The space isn&rsquo;t empty. It&rsquo;s waiting for the reader.</p>
        <footer>From the studio&rsquo;s notes, 2026</footer>
      </blockquote>
      <h3>What this rules out</h3>
      <ul>
        <li>Icons that need a legend.</li>
        <li>A third face for &ldquo;personality&rdquo;.</li>
        <li>Colour that means nothing.</li>
      </ul>
      <h3>What it asks of us</h3>
      <ol>
        <li>Write every label so it can stand alone.</li>
        <li>Set the hierarchy with size and weight first.</li>
        <li>Leave the space empty when in doubt.</li>
      </ol>
      <hr />
      <h3>In the stylesheet</h3>
      <pre><code>{`.db-yours {
  font-family: var(--db-expression);
  font-style: italic;
}`}</code></pre>
      <table>
        <thead>
          <tr><th>Token</th><th>Sets</th><th>Figure</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--db-hairline</code></td><td>Rules</td><td>1px</td></tr>
          <tr><td><code>--db-stroke</code></td><td>Emphasis lines</td><td>2px</td></tr>
        </tbody>
      </table>
    </Prose>
  )
}
