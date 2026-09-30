import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/0db/ui/pagination"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#2" /></PaginationItem>
        <PaginationItem><PaginationLink href="#1" aria-label="Page 1">01</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#2" aria-label="Page 2">02</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#3" aria-label="Page 3" isActive>03</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#4" aria-label="Page 4">04</PaginationLink></PaginationItem>
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        <PaginationItem><PaginationLink href="#9" aria-label="Page 9">09</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#4" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function States() {
  return (
    <>
      <State label="Current"><Pagination><PaginationContent><PaginationItem><PaginationLink href="#1" aria-label="Page 1" isActive>01</PaginationLink></PaginationItem></PaginationContent></Pagination></State>
      <State label="Pointed at"><Pagination><PaginationContent><PaginationItem><PaginationLink href="#2" aria-label="Page 2" data-force="hover">02</PaginationLink></PaginationItem></PaginationContent></Pagination></State>
      <State label="With a name">
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#halden">Halden</PaginationPrevious></PaginationItem>
            <PaginationItem><PaginationNext href="#marram">Marram</PaginationNext></PaginationItem>
          </PaginationContent>
        </Pagination>
      </State>
      <State label="First page"><Pagination><PaginationContent><PaginationItem><PaginationPrevious /></PaginationItem><PaginationItem><PaginationNext href="#2" /></PaginationItem></PaginationContent></Pagination></State>
    </>
  )
}
