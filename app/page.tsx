import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className='flex h-full w-full justify-center items-center'>
      <a href='/dashboard'>
        <Button>Dashboard</Button>
      </a>
    </div>
  )
}
