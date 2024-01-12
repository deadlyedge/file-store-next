import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const TokenDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className='text-sm'>API MENU</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API MENU</DialogTitle>
          <DialogDescription>
            <p className='my-2'>
              This menu will be available soon. Stay tuned! 🚀 🚀 🚀
              <br />
              /api should be useful for upload/delete/list database, which is
              hided and replaced with server action for now. but api is
              definitely best choice for developers of course.
            </p>
            <p className='my-2'>
              If you only want to &quot;get&quot; the file, just copy the [url]
              of files, by click it.
            </p>
            <p className='my-2'>
              And add
              <code className='bg-white/20 mx-1 px-1 rounded text-nowrap'>
                ?output=json
              </code>
              at the end of urls for file info.
              <code className='bg-white/20 mx-1 px-1 rounded text-nowrap'>
                ?output=download
              </code>
              also supported.
            </p>
            <p className='my-2'>
              Later I will add token here for other functions. Like below:
            </p>
            <p className='text=lg bg-green-300/10 rounded p-1 text-center'>
              Your
              <code className='bg-white/20 mx-1 px-1 rounded text-nowrap'>
                ?token=8236e2fb-f621-4712-9587-762278a44f99
              </code>
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type='submit' disabled>
            Copy Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
