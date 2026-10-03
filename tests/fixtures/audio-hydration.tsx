import { hydrateRoot } from "react-dom/client"
import { AudioPlayer } from "@/registry/0db/ui/audio-player"

const failed = window.location.pathname === "/hydration-error"
hydrateRoot(document.getElementById("hydrated-audio")!, <AudioPlayer src={failed ? "/missing.wav" : "/one.wav"} label={failed ? "Unavailable reading" : "Preloaded reading"} />)
