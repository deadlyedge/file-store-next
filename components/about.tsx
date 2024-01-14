import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Button } from "./ui/button"

export const About = () => {
  return (
    <Drawer>
      <DrawerTrigger className='w-20 block bg-zinc-400/50 p-3 transition duration-500 hover:text-zinc-700 hover:bg-amber-100  font-bold rounded-lg text-sm text-zinc-200 px-5 py-2.5'>
        About
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>About this project:</DrawerTitle>
          <DrawerDescription>
            This project is made for fun.
            <br />
            I throught it may useful when someone have a vps and want to add a
            bit more workload to it, and may make some test work easier.
            <br />
            I choose mongodb with gridFS support, because I love mongo, and I
            have had a mongodb running, and it looks less code to write.
            <br />
            <code className='text-gray-400'>
              It could help you either, I hope.
            </code>
            <br />
            <a
              className='bg-gray-200 rounded-full px-2 text-zinc-800'
              href='https://github.com/deadlyedge/pyMongoFileServer'>
              Page on GITHUB
            </a>
            <code className='float-right text-gray-300'>
              - xdream oldlu: an old student
            </code>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}
