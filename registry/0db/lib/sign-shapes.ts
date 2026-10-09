/**
 * The shape table for signs: each sign is a word and the drawing it is set into, on a 24-unit square.
 *
 * A path is a list of moves: ["M", x, y] starts a run, ["L", x, y] rules a straight line to a point, and
 * ["O", cx, cy, r, from, sweep] draws an arc of a circle from `from` degrees (0 is east, 90 south) through `sweep`.
 * `line` is the strokes the word runs along, each read from its start. `fill` is the silhouette the word fills:
 * closed paths that add to it and paths that cut out of it. The table is data only, so a script can grow it to
 * hundreds of signs without a new line of layout code.
 */
type Move = ["M", number, number] | ["L", number, number] | ["O", number, number, number, number, number]
type Path = Move[]

type SignShape = {
  /** The word the sign is made of, and says when it's pointed at. */
  word: string
  /** The strokes the word runs along, for `line`. */
  line: Path[]
  /** The silhouette the word fills, for `fill`. */
  fill: { add: Path[]; cut?: Path[] }
}

/** A bar from a to b, `w` units wide, as a closed path. */
function bar(ax: number, ay: number, bx: number, by: number, w: number): Path {
  const len = Math.hypot(bx - ax, by - ay), nx = (-(by - ay) / len) * (w / 2), ny = ((bx - ax) / len) * (w / 2)
  return [["M", ax + nx, ay + ny], ["L", bx + nx, by + ny], ["L", bx - nx, by - ny], ["L", ax - nx, ay - ny]]
}
const rect = (x0: number, y0: number, x1: number, y1: number): Path => [["M", x0, y0], ["L", x1, y0], ["L", x1, y1], ["L", x0, y1]]
const disc = (cx: number, cy: number, r: number): Path => [["O", cx, cy, r, 0, 360]]

const search: SignShape = {
  word: "search",
  // The lens read clockwise from the west, then the handle down to the corner.
  line: [[["O", 10, 10, 6.5, 180, 360]], [["M", 15.6, 15.6], ["L", 21.5, 21.5]]],
  fill: { add: [disc(10, 10, 8), bar(14, 14, 21.5, 21.5, 4.4)] },
}

const arrowRight: SignShape = {
  word: "next",
  // The shaft, then each side of the head read towards the point.
  line: [[["M", 2.5, 12], ["L", 17.5, 12]], [["M", 12.5, 4], ["L", 20, 11]], [["M", 12.5, 20], ["L", 20, 13]]],
  fill: { add: [rect(2, 9.6, 14, 14.4), [["M", 11.5, 3], ["L", 22.5, 12], ["L", 11.5, 21]]] },
}

const close: SignShape = {
  word: "close",
  // Two strokes crossed: the rising one whole, the falling one in two halves that give way to it at the crossing.
  line: [[["M", 5, 19], ["L", 19, 5]], [["M", 5, 5], ["L", 12, 12]], [["M", 12, 12], ["L", 19, 19]]],
  fill: { add: [bar(4, 4, 20, 20, 5.6), bar(4, 20, 20, 4, 5.6)] },
}

const mail: SignShape = {
  word: "mail",
  // The envelope's four sides, each a stroke so the word is never bent round a corner, then the flap.
  line: [[["M", 3, 6], ["L", 21, 6]], [["M", 21, 6], ["L", 21, 18]], [["M", 3, 18], ["L", 21, 18]], [["M", 3, 18], ["L", 3, 6]], [["M", 4, 7.5], ["L", 12, 13.2]], [["M", 12, 13.2], ["L", 20, 7.5]]],
  fill: { add: [rect(1.5, 4.5, 22.5, 19.5)], cut: [[["M", 1.5, 4.5], ["L", 12, 12.4], ["L", 22.5, 4.5], ["L", 22.5, 7.2], ["L", 12, 15.3], ["L", 1.5, 7.2]]] },
}

const home: SignShape = {
  word: "home",
  // The roof over its ridge, then each wall up to it and the floor, so the word is never bent round a corner.
  line: [[["M", 2, 11.5], ["L", 12, 3], ["L", 22, 11.5]], [["M", 5, 21], ["L", 5, 10]], [["M", 19, 10], ["L", 19, 21]], [["M", 5, 21], ["L", 19, 21]]],
  fill: { add: [[["M", 12, 1.5], ["L", 23.5, 11.5], ["L", 20, 11.5], ["L", 20, 22], ["L", 4, 22], ["L", 4, 11.5], ["L", 0.5, 11.5]]], cut: [rect(10, 15.5, 14, 22.5)] },
}

const signs = { search, "arrow-right": arrowRight, close, mail, home } satisfies Record<string, SignShape>

export { signs, type Move, type Path, type SignShape }
