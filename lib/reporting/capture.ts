export type Crop = { x: number; y: number; width: number; height: number }
const privateSelector = "input,textarea,select,[contenteditable],[data-private]"
export function captureDimensions(mode: "viewport" | "page", width: number, documentHeight: number, viewportHeight: number) {
  const height = mode === "viewport" ? viewportHeight : Math.max(documentHeight, viewportHeight)
  if (width * height > 32000000 || height > 20000) throw new Error("This page is too large to capture. Attach a screenshot from your device instead.")
  return { width, height }
}
export async function capturePage(mode: "viewport" | "page"): Promise<File> {
  if (location.pathname.includes("feedback-admin")) throw new Error("Capture is unavailable on private reports.")
  const { domToCanvas } = await import("modern-screenshot")
  const { width, height } = captureDimensions(mode, document.documentElement.clientWidth, document.documentElement.scrollHeight, innerHeight)
  const offsetX = mode === "viewport" ? scrollX : 0, offsetY = mode === "viewport" ? scrollY : 0
  const canvas = await domToCanvas(document.documentElement, {
    width, height, scale: 1, maximumCanvasSize: 20000, timeout: 8000,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    style: mode === "viewport" ? { transform: `translate(${-offsetX}px, ${-offsetY}px)`, transformOrigin: "top left" } : undefined,
    filter: node => !(node instanceof Element && (node.closest("[data-reporting-chrome],nextjs-portal,[data-slot=sheet-overlay],[data-slot=motion-drawer-content],[data-slot=motion-drawer-overlay]") || node.closest(privateSelector))),
    fetch: { requestInit: { credentials: "omit", referrerPolicy: "no-referrer" } },
    onCloneEachNode: node => {
      if (!(node instanceof HTMLElement)) return
      if (node.matches(privateSelector)) { node.textContent = ""; node.style.visibility = "hidden"; node.removeAttribute("value"); }
      if (mode === "viewport" && node.style.position === "fixed") node.style.transform = `translate(${offsetX}px, ${offsetY}px) ${node.style.transform === "none" ? "" : node.style.transform}`
    },
  })
  return canvasFile(canvas, mode === "page" ? "page-screenshot.png" : "viewport-screenshot.png")
}
export async function cropImage(file: File, crop: Crop): Promise<File> {
  const bitmap = await createImageBitmap(file)
  try {
    const x = Math.round(bitmap.width * crop.x / 100), y = Math.round(bitmap.height * crop.y / 100)
    const width = Math.max(1, Math.round(bitmap.width * crop.width / 100)), height = Math.max(1, Math.round(bitmap.height * crop.height / 100))
    if (x < 0 || y < 0 || x + width > bitmap.width + 1 || y + height > bitmap.height + 1) throw new Error("Keep the crop within the image.")
    const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height
    const context = canvas.getContext("2d"); if (!context) throw new Error("Your browser could not crop this image.")
    context.drawImage(bitmap, x, y, width, height, 0, 0, width, height)
    return canvasFile(canvas, "cropped-screenshot.png")
  } finally { bitmap.close(); }
}
function canvasFile(canvas: HTMLCanvasElement, name: string): Promise<File> {
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(new File([blob], name, { type: "image/png" })) : reject(new Error("Could not render this screenshot. Attach a file instead.")), "image/png"))
}
