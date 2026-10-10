// The home overture's lifecycle, in one place: what is stored, how long it may run, and the script that decides.
//
// Storage: one key, one value ("1"), no personal data. It records that this browser has been shown the overture.
// It is written BEFORE the overture starts, so a reload, a back navigation or a second tab never replays it.
// If storage is unavailable (disabled, private mode, quota), reading or writing throws, and the overture is
// skipped: the page arrives settled. Nothing waits on storage: the script runs once, synchronously, in the
// page's own HTML before the hero paints, and does nothing else.
export const OVERTURE_KEY = "0db-overture-seen"
// Set on <html> while the overture plays, holding performance.now() when it began. CSS and the skip control
// read the attribute; the deadline is measured from that moment, so a slow hydration cannot stretch it.
export const OVERTURE_ATTR = "data-overture-at"
// Everything, the title and the field, is settled this many ms after the overture began. Under three seconds.
export const OVERTURE_DEADLINE = 2000

/** Runs in the page before the hero paints. Plays only on a browser's first visit to the top of the home page. */
export const OVERTURE_SCRIPT = `(()=>{try{if(localStorage.getItem(${JSON.stringify(OVERTURE_KEY)}))return;localStorage.setItem(${JSON.stringify(OVERTURE_KEY)},"1");if(matchMedia("(prefers-reduced-motion: reduce)").matches||location.hash||scrollY>4)return;document.documentElement.setAttribute(${JSON.stringify(OVERTURE_ATTR)},String(Math.round(performance.now())))}catch{}})()`
