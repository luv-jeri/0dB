// Runs in <head> before first paint, so a stored Nocturne never flashes Day.
// The same four switches as the specimen, stored together under one key.
export const THEME_KEY = "0db-theme"

const script = `(()=>{const d=document.documentElement;let t={};try{t=JSON.parse(localStorage.getItem("${THEME_KEY}")||"{}")}catch{}d.dataset.mode=t.mode||(matchMedia("(prefers-color-scheme: dark)").matches?"nocturne":"day");for(const k of ["scheme","key","pair"])if(t[k])d.dataset[k]=t[k]})()`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
