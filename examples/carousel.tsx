import { Carousel, CarouselItem, CarouselTitle } from "@/registry/0db/ui/carousel"
import { Meta } from "@/registry/0db/ui/meta"

const work = [
  ["Halden", "Identity", "2026"],
  ["Northlight", "Website", "2026"],
  ["Oda Studio", "Identity", "2025"],
  ["Tidewater", "Motion", "2025"],
  ["Marram", "Website", "2025"],
]

export default function Example() {
  return (
    <Carousel aria-label="Selected work" trackLabel="Projects" previousLabel="Previous project" nextLabel="Next project">
      {work.map(([name, kind, year]) => (
        <CarouselItem key={name}>
          <CarouselTitle>{name}</CarouselTitle>
          <Meta>
            <span>{kind}</span>
            <span>{year}</span>
          </Meta>
        </CarouselItem>
      ))}
    </Carousel>
  )
}
