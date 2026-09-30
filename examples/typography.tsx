import { Prose, ProseLead } from "@/registry/0db/ui/typography"

export default function Example() {
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
