// Runs in <head> before first paint, so a stored Nocturne never flashes Day.
// The same four switches as the specimen, stored together under one key.
export const THEME_KEY = "0db-theme"

// Match the rail's capability gate before CSS lays out the page. Hydration then
// measures the existing ruler without removing a native scrollbar's gutter.
const script = `(()=>{const d=document.documentElement;let t={};try{t=JSON.parse(localStorage.getItem("${THEME_KEY}")||"{}")||{}}catch{}d.dataset.mode=t.mode||(matchMedia("(prefers-color-scheme: dark)").matches?"nocturne":"day");for(const k of ["scheme","key","pair"])if(t[k])d.dataset[k]=t[k];if(matchMedia("(pointer: fine)").matches&&CSS.supports("animation-timeline: scroll()"))d.setAttribute("data-page-scrollbar","")})()`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
