"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

const clock = (n: number) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`
type AudioPlayerProps = Omit<React.ComponentProps<"div">, "children"> & {
  src: string
  label: string
  audioProps?: Omit<React.ComponentProps<"audio">, "src" | "controls" | "autoPlay" | "children">
  onTimeChange?: (seconds: number) => void
  playLabel?: string
  pauseLabel?: string
  seekLabel?: string
  errorLabel?: string
  disabled?: boolean
}

/** A recording on its own baseline. The audio ref permits a transcript or another reader to seek it. */
function AudioPlayer(props: AudioPlayerProps) {
  return <AudioRecording key={props.src} {...props} />
}

function AudioRecording({ src, label, audioProps, onTimeChange, playLabel = "Play", pauseLabel = "Pause", seekLabel = "Seek in recording", errorLabel = "Recording unavailable. Try Play again.", disabled, className, ...props }: AudioPlayerProps) {
  const id = React.useId()
  const audio = React.useRef<HTMLAudioElement>(null)
  const [state, setState] = React.useState({ src, time: 0, duration: 0, playing: false, error: false })
  const attach = React.useCallback((el: HTMLAudioElement | null) => {
    audio.current = el
    // Prerendered media can load or fail before React attaches its event handlers.
    if (el) {
      const next = { src, time: Number.isFinite(el.currentTime) ? el.currentTime : 0, duration: Number.isFinite(el.duration) ? el.duration : 0, playing: !el.paused, error: Boolean(el.error) }
      setState((previous) => Object.keys(next).every((key) => previous[key as keyof typeof next] === next[key as keyof typeof next]) ? previous : next)
    }
  }, [src])
  const audioRef = useComposedRefs(attach, audioProps?.ref)
  const current = state.src === src ? state : { src, time: 0, duration: 0, playing: false, error: false }
  const sample = (el: HTMLAudioElement) => {
    if (el !== audio.current) return
    const time = Number.isFinite(el.currentTime) ? el.currentTime : 0
    setState({ src, time, duration: Number.isFinite(el.duration) ? el.duration : 0, playing: !el.paused, error: Boolean(el.error) })
    onTimeChange?.(time)
  }
  React.useEffect(() => {
    const el = audio.current
    return () => { el?.pause() }
  }, [])
  React.useEffect(() => { if (disabled) audio.current?.pause() }, [disabled])
  return <div {...props} data-slot="audio-player" data-playing={current.playing ? "" : undefined} className={cn("db-audio", className)}>
    <span data-slot="audio-title" className="db-audio-title" id={`${id}-title`}>{label}</span>
    <audio {...audioProps} key={src} ref={audioRef} data-slot="audio-native" src={src} autoPlay={false} controls={false} preload={audioProps?.preload ?? "metadata"} aria-label={audioProps?.["aria-label"] ?? label}
      onLoadedMetadata={(e) => { audioProps?.onLoadedMetadata?.(e); sample(e.currentTarget) }}
      onDurationChange={(e) => { audioProps?.onDurationChange?.(e); sample(e.currentTarget) }}
      onTimeUpdate={(e) => { audioProps?.onTimeUpdate?.(e); sample(e.currentTarget) }}
      onPlay={(e) => { audioProps?.onPlay?.(e); sample(e.currentTarget) }}
      onPause={(e) => { audioProps?.onPause?.(e); sample(e.currentTarget) }}
      onEnded={(e) => { audioProps?.onEnded?.(e); sample(e.currentTarget) }}
      onError={(e) => { audioProps?.onError?.(e); sample(e.currentTarget) }} />
    <div className="db-audio-face">
      <button type="button" data-slot="audio-play" disabled={disabled} aria-label={`${current.playing ? pauseLabel : playLabel} ${label}`} onClick={async () => {
        const el = audio.current
        if (!el) return
        if (!el.paused) el.pause()
        else {
          try { await el.play() }
          catch { if (el === audio.current) setState((s) => ({ ...s, src, error: true })) }
        }
      }}>{current.playing ? pauseLabel : playLabel}<span className="db-audio-hold" aria-hidden="true" /></button>
      <span data-slot="audio-time" className="db-audio-time" aria-hidden="true"><bdi dir="ltr" className="db-yours">{clock(current.time)}</bdi><small> / <bdi dir="ltr">{clock(current.duration)}</bdi></small></span>
    </div>
    <label className="db-sr" htmlFor={`${id}-seek`}>{seekLabel}: {label}</label>
    <div className="db-audio-track" style={{ "--db-audio-progress": current.duration ? Math.min(1, current.time / current.duration) : 0 } as React.CSSProperties}>
    <span className="db-audio-needle" aria-hidden="true" />
    <span className="db-audio-scale" aria-hidden="true"><span>00</span><span>{clock(current.duration / 4)}</span><span>{clock(current.duration / 2)}</span><span>{clock(current.duration * 3 / 4)}</span><span>{clock(current.duration)}</span></span>
    <input data-slot="audio-seek" className="db-audio-seek" id={`${id}-seek`} type="range" min={0} max={current.duration || 1} step={0.1} value={Math.min(current.time, current.duration || 1)} disabled={disabled || !current.duration} aria-valuetext={`${clock(current.time)} / ${clock(current.duration)}`} onChange={(e) => {
      const el = audio.current
      if (!el) return
      el.currentTime = Number(e.target.value)
      sample(el)
    }} />
    </div>
    {current.error ? <p data-slot="audio-error" className="db-audio-error" role="status">{errorLabel}</p> : null}
  </div>
}

export { AudioPlayer, type AudioPlayerProps }
