import { Button } from "@/registry/0db/ui/button"
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogMeta,
  DialogTitle,
  DialogTrigger,
} from "@/registry/0db/ui/dialog"

export default function Example() {
  return (
    <Dialog alert>
      <DialogTrigger asChild>
        <Button variant="bracket">Delete Spring notes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogMeta>
          <span>Delete a note</span>
          <hr />
          <span>14 attachments</span>
        </DialogMeta>
        <DialogTitle>
          Delete <span className="db-yours">Spring notes</span>?
        </DialogTitle>
        <DialogDescription>The notes and their 14 attachments go for good. This can&apos;t be undone.</DialogDescription>
        <DialogActions>
          <DialogClose asChild>
            <Button variant="bracket" data-autofocus>Keep it</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="statement">Delete</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
