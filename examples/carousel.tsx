import { Carousel, CarouselItem, CarouselTitle } from "@/registry/0nlytype/ui/carousel"
import { Meta } from "@/registry/0nlytype/ui/meta"
import { State } from "@/components/site/state"

const work = [
  ["Halden", "Identity", "2026"],
  ["Northlight", "Website", "2026"],
  ["Oda Studio", "Identity", "2025"],
  ["Tidewater", "Motion", "2025"],
  ["Marram", "Website", "2025"],
]

const slides = work.map(([name, kind, year]) => (
  <CarouselItem key={name}>
    <CarouselTitle>{name}</CarouselTitle>
    <Meta>
      <span>{kind}</span>
      <span>{year}</span>
    </Meta>
  </CarouselItem>
))

export default function Example() {
  return (
    <div className="grid gap-y-24">
      <Carousel aria-label="Selected work" trackLabel="Projects" previousLabel="Previous project" nextLabel="Next project">
        {slides}
      </Carousel>
      <Carousel variant="line" aria-label="Selected work, as a line" trackLabel="Projects" previousLabel="Previous project" nextLabel="Next project">
        {slides}
      </Carousel>
      <Carousel variant="shelf" aria-label="Selected work, on the shelf" trackLabel="Projects" previousLabel="Previous project" nextLabel="Next project">
        {slides}
      </Carousel>
    </div>
  )
}

const three = work.slice(0, 3).map(([name, kind]) => (
  <CarouselItem key={name}>
    <CarouselTitle>{name}</CarouselTitle>
    <Meta>
      <span>{kind}</span>
    </Meta>
  </CarouselItem>
))

export function States() {
  return (
    <>
      {(["poster", "line", "shelf"] as const).map((variant) => (
        <State key={variant} label={`${variant}, first slide`}>
          <div className="w-80 max-w-full">
            <Carousel variant={variant} aria-label={`${variant} carousel`}>
              {three}
            </Carousel>
          </div>
        </State>
      ))}
    </>
  )
}
