"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const testimonials = [
  {
    name: "Joel",
    avatar: "J",
    title: "Software Engineer",
    description: "This is the best application I've ever used!",
  },
  {
    name: "Antonio",
    avatar: "A",
    title: "Designer",
    description: "I use this daily for generating new photos!",
  },
  {
    name: "OldLu",
    avatar: "M",
    title: "CEO",
    description:
      "This is a learning project, but I really hope that it could help people to start using AI.",
  },
]

export function LandingContent() {
  return (
    <div className='px-10 pb-20'>
      <h2 className='text-center text-4xl text-white font-extrabold mb-10'>
        Testimonials
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className='bg-[#192339] border-none text-white'>
            <CardHeader>
              <CardTitle className='flex items-center gap-x-2'>
                <div>
                  <p className='text-lg'>{item.name}</p>
                  <p className='text-zinc-400 text-sm'>{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className='pt-4 px-0'>
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
        <Card className='bg-[#192339] border-none px-10 text-white col-span-full'>
          <CardHeader>
            <CardTitle className='flex items-center gap-x-2'>About</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
      <p className='text-center text-sx text-zinc-600 font-extrabold my-10'>
        Built with ❤️ by{" "}
        <a href='https://github.com/deadlyedge/sw-ai-che'>OldLu</a>.
      </p>
    </div>
  )
}
