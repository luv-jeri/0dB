import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { AudioPlayer } from "../registry/0db/ui/audio-player.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))

test("audio uses real media without autoplay, disables an unknown-duration seek and forwards native props", () => {
  const html = render(AudioPlayer, { src: "reading.wav", label: "Reading", audioProps: { preload: "none", loop: true, muted: true, crossOrigin: "anonymous" } })
  assert.match(html, /<audio[^>]*preload="none"[^>]*loop=""[^>]*muted=""/)
  assert.doesNotMatch(html, /autoplay|controls=""/i)
  assert.match(html, /aria-label="Play Reading"/)
  assert.match(html, /type="range"[^>]*disabled=""/)
})
