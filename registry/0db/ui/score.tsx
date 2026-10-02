"use client"

import * as React from "react"
import { cn } from "@/registry/0db/lib/utils"

type Score = { on: boolean; cue: (name: "set") => void; voice: (i: number) => void; resolve: () => void; letter: (ch: string) => void }
type Part = { oscillator: OscillatorNode; envelope: GainNode }
type Instrument = { context: AudioContext; master: GainNode; limiter: DynamicsCompressorNode; voices: Map<number, Part>; notes: Set<Part>; resolved: boolean }
const suspended = [130.81, 196, 293.66, 349.23, 523.25]
const major = [130.81, 196, 329.63, 392, 523.25]
const ScoreContext = React.createContext<(Score & { toggle: () => void }) | null>(null)
const silent: Score = { on: false, cue: () => {}, voice: () => {}, resolve: () => {}, letter: () => {} }

function clearNotes(synth: Instrument) {
  synth.notes.forEach(({ oscillator, envelope }) => {
    oscillator.onended = null
    oscillator.stop()
    oscillator.disconnect()
    envelope.disconnect()
  })
  synth.notes.clear()
}

/** The remembered preference never creates audio. Only the toggle's user gesture can. */
function ScoreProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = React.useState(false)
  const enabled = React.useRef(false)
  const instrument = React.useRef<Instrument | null>(null)
  const lastLetter = React.useRef(-Infinity)
  const lastCue = React.useRef(-Infinity)
  const mounted = React.useRef(true)

  const save = React.useCallback((value: boolean) => {
    enabled.current = value
    setOn(value)
    try { localStorage.setItem("0db-score", value ? "on" : "off") } catch { /* Private storage does not prevent listening. */ }
  }, [])

  React.useEffect(() => {
    mounted.current = true
    // Restore the preference, never the audio graph. A new document still needs
    // an explicit off/on gesture before it can sound.
    queueMicrotask(() => {
      if (!mounted.current) return
      try {
        const saved = localStorage.getItem("0db-score") === "on"
        enabled.current = saved
        setOn(saved)
      } catch { /* The default remains off when storage is unavailable. */ }
    })
    const visibility = () => {
      const synth = instrument.current
      if (!synth) return
      if (document.hidden) {
        clearNotes(synth)
        void synth.context.suspend().catch(() => {})
      }
      else if (enabled.current) void synth.context.resume().catch(() => { if (mounted.current) save(false) })
    }
    const storage = (event: StorageEvent) => {
      if (event.key === "0db-score" && event.newValue !== "on") {
        enabled.current = false
        setOn(false)
        const synth = instrument.current
        if (synth) {
          clearNotes(synth)
          void synth.context.suspend().catch(() => {})
        }
      }
    }
    document.addEventListener("visibilitychange", visibility)
    window.addEventListener("storage", storage)
    return () => {
      mounted.current = false
      enabled.current = false
      document.removeEventListener("visibilitychange", visibility)
      window.removeEventListener("storage", storage)
      const synth = instrument.current
      instrument.current = null
      if (synth) {
        synth.voices.forEach(({ oscillator }) => oscillator.stop())
        clearNotes(synth)
        void synth.context.close().catch(() => {})
      }
    }
  }, [save])

  const voice = React.useCallback((i: number) => {
    const synth = instrument.current
    if (!enabled.current || !synth || document.hidden || !Number.isInteger(i) || i < 0 || i > 4 || synth.voices.has(i)) return
    const oscillator = synth.context.createOscillator()
    const envelope = synth.context.createGain()
    const now = synth.context.currentTime
    oscillator.type = i % 2 ? "triangle" : "sine"
    oscillator.frequency.value = (synth.resolved ? major : suspended)[i]
    envelope.gain.setValueAtTime(0, now)
    envelope.gain.linearRampToValueAtTime(0.12, now + 1.4)
    oscillator.connect(envelope).connect(synth.master)
    oscillator.start()
    synth.voices.set(i, { oscillator, envelope })
  }, [])

  const toggle = React.useCallback(() => {
    if (enabled.current) {
      save(false)
      const synth = instrument.current
      if (synth) {
        clearNotes(synth)
        synth.master.gain.cancelScheduledValues(synth.context.currentTime)
        synth.master.gain.setTargetAtTime(0, synth.context.currentTime, 0.025)
        // Suspending immediately guarantees off is silent, including scheduled notes.
        void synth.context.suspend().catch(() => {})
      }
      return
    }
    try {
      let synth = instrument.current
      if (!synth) {
        const context = new AudioContext()
        const master = context.createGain()
        const limiter = context.createDynamicsCompressor()
        master.gain.value = 0
        limiter.threshold.value = -18
        limiter.knee.value = 12
        limiter.ratio.value = 8
        limiter.attack.value = 0.01
        limiter.release.value = 0.25
        master.connect(limiter).connect(context.destination)
        synth = { context, master, limiter, voices: new Map(), notes: new Set(), resolved: false }
        instrument.current = synth
      }
      save(true)
      synth.master.gain.cancelScheduledValues(synth.context.currentTime)
      synth.master.gain.setTargetAtTime(0.055, synth.context.currentTime, 0.08)
      voice(0)
      voice(2)
      void synth.context.resume().catch(() => { if (mounted.current) save(false) })
    } catch {
      save(false)
    }
  }, [save, voice])

  const play = React.useCallback((frequency: number, gain: number, length: number) => {
    const synth = instrument.current
    if (!enabled.current || !synth || document.hidden || synth.context.state !== "running" || synth.notes.size >= 8) return
    const now = synth.context.currentTime
    const oscillator = synth.context.createOscillator()
    const envelope = synth.context.createGain()
    const part = { oscillator, envelope }
    oscillator.type = "sine"
    oscillator.frequency.value = frequency
    envelope.gain.setValueAtTime(0, now)
    envelope.gain.linearRampToValueAtTime(gain, now + 0.012)
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + length)
    oscillator.connect(envelope).connect(synth.master)
    synth.notes.add(part)
    oscillator.onended = () => { synth.notes.delete(part); oscillator.disconnect(); envelope.disconnect() }
    oscillator.start(now)
    oscillator.stop(now + length + 0.03)
  }, [])

  const cue = React.useCallback((name: "set") => {
    if (!enabled.current || document.hidden || name !== "set") return
    const now = performance.now()
    if (now - lastCue.current < 120) return
    lastCue.current = now
    play(523.25, 0.2, 0.45)
  }, [play])
  const letter = React.useCallback((ch: string) => {
    if (!enabled.current || document.hidden || !ch.trim()) return
    const now = performance.now()
    if (now - lastLetter.current < 75) return
    lastLetter.current = now
    const chord = instrument.current?.resolved ? major : suspended
    play(chord[(ch.codePointAt(0) ?? 0) % chord.length] * 2, 0.045, 0.12)
  }, [play])
  const resolve = React.useCallback(() => {
    const synth = instrument.current
    if (!enabled.current || !synth || document.hidden || synth.resolved) return
    synth.resolved = true
    const now = synth.context.currentTime
    // Audio keeps its adagio even under reduced motion: sound was explicitly requested.
    synth.voices.forEach(({ oscillator }, i) => {
      oscillator.frequency.cancelScheduledValues(now)
      oscillator.frequency.setValueAtTime(oscillator.frequency.value, now)
      oscillator.frequency.linearRampToValueAtTime(major[i], now + 1.4)
    })
  }, [])
  const value = React.useMemo(() => ({ on, cue, voice, resolve, letter, toggle }), [on, cue, voice, resolve, letter, toggle])
  return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
}

function useScore(): Score {
  const score = React.useContext(ScoreContext)
  return score ?? silent
}

function ScoreToggle({ className, onClick, ...props }: Omit<React.ComponentProps<"button">, "children" | "aria-pressed">) {
  const score = React.useContext(ScoreContext)
  return <button {...props} type="button" data-slot="score" className={cn("db-score", className)} disabled={props.disabled || !score} aria-pressed={score?.on ?? false} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) score?.toggle() }}>Sound {score?.on ? "on" : "off"}</button>
}

export { ScoreProvider, ScoreToggle, useScore, type Score }
