## purpose

this project is sort of review, for my coding skills, just for fun.

this repo require a working mongodb uri to run, set it in enviroment.

I throught it may useful when someone have a vps and want to add a bit more
workload to it, and may make some test work easier.

I choose mongodb with gridFS support, because I love mongo, and I have had a mongodb running, and it looks less code to write.

## tech stacks

 - mongodb
 - nextjs

sharp should be installed and the version must NOT be 0.33! `npm install sharp@0.32.6`

## enviroments

 - MONGO_URI: {working database}


## TODO

 - auto fresh after upload is mess, only work locally with small file, fix it!
 - add auth